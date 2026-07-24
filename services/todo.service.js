const Todo = require('../models/Todo.model');
const Category = require('../models/Category.model');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');
const activityLogService = require('./activityLog.service');

const validateCategoryOwnership = async (categoryId, userId) => {
  if (!categoryId) return;
  const category = await Category.findOne({ _id: categoryId, createdBy: userId });
  if (!category) {
    throw AppError.badRequest('Invalid category: category does not exist or does not belong to you.');
  }
};

const createTodo = async (payload, userId) => {
  await validateCategoryOwnership(payload.category, userId);

  const todo = await Todo.create({
    ...payload,
    user: userId,
    createdBy: userId,
  });

  await activityLogService.record({
    action: 'CREATE',
    entity: 'Todo',
    entityId: todo._id,
    description: `Todo "${todo.title}" was created.`,
    metadata: { status: todo.status, priority: todo.priority },
    performedBy: userId,
  });

  return todo;
};

/**
 * GET /todos with pagination, sorting, filtering (category, status),
 * and search (title/description) — scoped to the logged-in user.
 */
const getAllTodos = async (query, userId) => {
  const baseFilter = { user: userId };
  const baseQuery = Todo.find(baseFilter).populate('category', 'name color');

  const features = new ApiFeatures(baseQuery, query)
    .search(['title', 'description'])
    .filter(['category', 'status'])
    .sort()
    .paginate();

  // Make sure ownership filter is always enforced together with search/filter
  features.query = features.query.find(baseFilter);
  features.baseFilter = { ...features.baseFilter, ...baseFilter };

  const [data, meta] = await Promise.all([features.query, features.getMeta()]);
  return { data, meta };
};

const getTodoById = async (id, userId) => {
  const todo = await Todo.findOne({ _id: id, user: userId }).populate('category', 'name color');
  if (!todo) throw AppError.notFound('Todo not found.');
  return todo;
};

const updateTodo = async (id, payload, userId) => {
  await validateCategoryOwnership(payload.category, userId);

  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: userId },
    { ...payload, updatedBy: userId },
    { new: true, runValidators: true }
  ).populate('category', 'name color');

  if (!todo) throw AppError.notFound('Todo not found.');

  await activityLogService.record({
    action: 'UPDATE',
    entity: 'Todo',
    entityId: todo._id,
    description: `Todo "${todo.title}" was updated.`,
    metadata: payload,
    performedBy: userId,
  });

  return todo;
};

const deleteTodo = async (id, userId) => {
  // Soft delete
  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: userId },
    { archived: true, updatedBy: userId },
    { new: true }
  );

  if (!todo) throw AppError.notFound('Todo not found.');

  await activityLogService.record({
    action: 'DELETE',
    entity: 'Todo',
    entityId: todo._id,
    description: `Todo "${todo.title}" was archived (soft deleted).`,
    performedBy: userId,
  });

  return todo;
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
