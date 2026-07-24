const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const env = require('../config/env');
const User = require('../models/User.model');

/**
 * Verifies the JWT access token sent in the Authorization header
 * (format: "Bearer <token>") and attaches the authenticated user
 * to `req.user`.
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(AppError.unauthorized('You are not logged in. Please log in to get access.'));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return next(AppError.unauthorized('Invalid or expired token. Please log in again.'));
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(AppError.unauthorized('The user belonging to this token no longer exists.'));
  }

  req.user = currentUser;
  next();
});

/**
 * Role-Based Access Control middleware factory.
 * Usage: restrictTo('admin') or restrictTo('admin', 'user')
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(AppError.forbidden('You do not have permission to perform this action.'));
  }
  return next();
};

module.exports = { protect, restrictTo };
