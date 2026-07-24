const { body, param, query } = require('express-validator');

/**
 * Validation rules for POST /categories
 */
const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  body('color')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Color value must be at most 20 characters'),
];

/**
 * Validation rules for PUT /categories/:id
 */
const updateCategoryValidation = [
  param('id').isMongoId().withMessage('Invalid category id'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  body('color')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Color value must be at most 20 characters'),
];

/**
 * Validation rule for routes with a category :id param only
 * (GET /categories/:id, DELETE /categories/:id)
 */
const categoryIdParamValidation = [param('id').isMongoId().withMessage('Invalid category id')];

/**
 * Validation rules for GET /categories query params
 * (pagination, sorting, search)
 */
const listCategoryQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
  query('field').optional().isString().withMessage('field must be a string'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be "asc" or "desc"'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('search must be at most 200 characters'),
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdParamValidation,
  listCategoryQueryValidation,
};
