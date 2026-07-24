const catchAsync = require('../utils/catchAsync');
const todoService = require('../services/todo.service');

const createTodo = catchAsync(async (req, res) => {
  const todo = await todoService.createTodo(req.body, req.user.id);
  res.status(201).json({
    success: true,
    message: 'Todo created successfully.',
    data: { todo },
  });
});

const getAllTodos = catchAsync(async (req, res) => {
  const { data, meta } = await todoService.getAllTodos(req.query, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Todos fetched successfully.',
    data: { todos: data },
    meta,
  });
});

const getTodoById = catchAsync(async (req, res) => {
  const todo = await todoService.getTodoById(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Todo fetched successfully.',
    data: { todo },
  });
});

const updateTodo = catchAsync(async (req, res) => {
  const todo = await todoService.updateTodo(req.params.id, req.body, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Todo updated successfully.',
    data: { todo },
  });
});

const deleteTodo = catchAsync(async (req, res) => {
  await todoService.deleteTodo(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Todo deleted (archived) successfully.',
    data: null,
  });
});

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
