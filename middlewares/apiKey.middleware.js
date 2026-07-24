const AppError = require('../utils/AppError');
const env = require('../config/env');

/**
 * Protects endpoints intended for external / machine-to-machine
 * consumers using a static API key, instead of a user JWT.
 *
 * Expects header: `x-api-key: <API_KEY>`
 */
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(AppError.unauthorized('API key is missing. Provide it via the "x-api-key" header.'));
  }

  if (apiKey !== env.API_KEY) {
    return next(AppError.forbidden('Invalid API key.'));
  }

  return next();
};

module.exports = requireApiKey;
