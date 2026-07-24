const AppError = require('../utils/AppError');
const env = require('../config/env');

/**
 * Transforms known Mongoose errors into consistent AppError instances.
 */
const handleCastErrorDB = (err) =>
  AppError.badRequest(`Invalid value for field "${err.path}": ${err.value}`);

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = field ? err.keyValue[field] : '';
  return AppError.conflict(`Duplicate value "${value}" for field "${field}". Please use another value.`);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return AppError.badRequest('Validation failed', messages);
};

const handleJWTError = () => AppError.unauthorized('Invalid token. Please log in again.');

const handleJWTExpiredError = () => AppError.unauthorized('Your token has expired. Please log in again.');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    errors: err.errors || [],
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      errors: err.errors || [],
    });
  } else {
    // Unknown / programming error: don't leak details to the client
    // eslint-disable-next-line no-console
    console.error('UNEXPECTED ERROR 💥', err);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Global Express error handling middleware.
 * Must be registered last, after all routes.
 */
module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
    return;
  }

  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  sendErrorProd(error, res);
};
