const Category = require('../models/Category.model');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');

const createCategory = async (payload, userId) => {
  const category = await Category.create({
    ...payload,
    createdBy: userId,
  });
  return category;
};

const getAllCategories = async (query, userId) => {
  const baseFilter = { createdBy: userId };
  const baseQuery = Category.find(baseFilter);

  const features = new ApiFeatures(baseQuery, query)
    .search(['name', 'description'])
    .filter([])
    .sort()
    .paginate();

  // Ensure the base filter (ownership) always applies alongside search/filter
  features.query = features.query.find(baseFilter);
  features.baseFilter = { ...features.baseFilter, ...baseFilter };

  const [data, meta] = await Promise.all([features.query, features.getMeta()]);
  return { data, meta };
};

const getCategoryById = async (id, userId) => {
  const category = await Category.findOne({ _id: id, createdBy: userId });
  if (!category) throw AppError.notFound('Category not found.');
  return category;
};

const updateCategory = async (id, payload, userId) => {
  const category = await Category.findOneAndUpdate(
    { _id: id, createdBy: userId },
    { ...payload, updatedBy: userId },
    { new: true, runValidators: true }
  );
  if (!category) throw AppError.notFound('Category not found.');
  return category;
};

const deleteCategory = async (id, userId) => {
  // Soft delete: set archived = true instead of removing the document
  const category = await Category.findOneAndUpdate(
    { _id: id, createdBy: userId },
    { archived: true, updatedBy: userId },
    { new: true }
  );
  if (!category) throw AppError.notFound('Category not found.');
  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
