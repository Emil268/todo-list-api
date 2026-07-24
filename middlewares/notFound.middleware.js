const AppError = require('../utils/AppError');

/**
 * Catch-all 404 handler.
 * Registered after all valid routes; forwards a consistent
 * AppError(404) to the global error handling middleware for
 * any request that didn't match a known route.
 */
const notFound = (req, res, next) => {
  next(AppError.notFound(`Cannot find ${req.originalUrl} on this server.`));
};

module.exports = notFound;
