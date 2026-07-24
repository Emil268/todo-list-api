const { param, query } = require('express-validator');

const userIdParamValidation = [param('id').isMongoId().withMessage('Invalid user id')];

/**
 * Validation rules for GET /users query params (Admin only)
 * (pagination, sorting, search, role filter)
 */
const listUserQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
  query('field').optional().isString().withMessage('field must be a string'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be "asc" or "desc"'),
  query('role').optional().isIn(['admin', 'user']).withMessage('role must be "admin" or "user"'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('search must be at most 200 characters'),
];

module.exports = { userIdParamValidation, listUserQueryValidation };
