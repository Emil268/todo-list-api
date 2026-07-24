const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user.id);
  res.status(201).json({
    success: true,
    message: 'Category created successfully.',
    data: { category },
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const { data, meta } = await categoryService.getAllCategories(req.query, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Categories fetched successfully.',
    data: { categories: data },
    meta,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Category fetched successfully.',
    data: { category },
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Category updated successfully.',
    data: { category },
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Category deleted (archived) successfully.',
    data: null,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
