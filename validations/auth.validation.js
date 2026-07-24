const { body } = require('express-validator');

/**
 * Validation rules for POST /auth/register
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .bail()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either "admin" or "user"'),
];

/**
 * Validation rules for POST /auth/login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password').notEmpty()
    .bail().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
