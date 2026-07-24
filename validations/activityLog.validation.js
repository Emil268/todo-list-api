const { query } = require('express-validator');

const ENTITY_VALUES = ['Todo', 'Category', 'User'];
const ACTION_VALUES = ['CREATE', 'UPDATE', 'DELETE'];

/**
 * Validation rules for GET /activity-logs query params
 * (pagination, sorting, filtering by entity/action)
 */
const listActivityLogQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
  query('field').optional().isString().withMessage('field must be a string'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be "asc" or "desc"'),
  query('entity')
    .optional()
    .isIn(ENTITY_VALUES)
    .withMessage(`entity must be one of: ${ENTITY_VALUES.join(', ')}`),
  query('action')
    .optional()
    .isIn(ACTION_VALUES)
    .withMessage(`action must be one of: ${ACTION_VALUES.join(', ')}`),
];

module.exports = { listActivityLogQueryValidation };
