const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Generic request validation middleware, meant to run AFTER an array of
 * express-validator validation chains (body/query/param checks) have
 * been attached to the route.
 *
 * Usage:
 *   const { registerValidation } = require('../validations/auth.validation');
 *   router.post('/register', registerValidation, validate, authController.register);
 *
 * If any validation chain fails, collects all messages and forwards a
 * single AppError (400 Bad Request) with the full list of issues.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(AppError.badRequest('Validation failed', messages));
  }

  return next();
};

module.exports = validate;
