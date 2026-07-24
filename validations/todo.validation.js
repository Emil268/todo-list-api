const { body, param, query } = require('express-validator');

const STATUS_VALUES = ['pending', 'in-progress', 'completed'];
const PRIORITY_VALUES = ['low', 'medium', 'high'];

/**
 * Validation rules for POST /todos
 */
const createTodoValidation = [
  body('title')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be at most 200 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),

  body('status')
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(', ')}`),

  body('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`),

  body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('dueDate must be a valid date'),

  body('category').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid category id'),
];

/**
 * Validation rules for PUT /todos/:id
 */
const updateTodoValidation = [
  param('id').isMongoId().withMessage('Invalid todo id'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be at most 200 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),

  body('status')
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(', ')}`),

  body('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`),

  body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('dueDate must be a valid date'),

  body('category').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid category id'),
];

/**
 * Validation rule for routes with a todo :id param only
 * (GET /todos/:id, DELETE /todos/:id)
 */
const todoIdParamValidation = [param('id').isMongoId().withMessage('Invalid todo id')];

/**
 * Validation rules for GET /todos query params
 * (pagination, sorting, filtering, search)
 */
const listTodoQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
  query('field').optional().isString().withMessage('field must be a string'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be "asc" or "desc"'),
  query('category').optional().isMongoId().withMessage('Invalid category id'),
  query('status')
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`status must be one of: ${STATUS_VALUES.join(', ')}`),
  query('search').optional().trim().isLength({ max: 200 }).withMessage('search must be at most 200 characters'),
];

module.exports = {
  createTodoValidation,
  updateTodoValidation,
  todoIdParamValidation,
  listTodoQueryValidation,
};
