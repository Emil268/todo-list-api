const morgan = require('morgan');
const env = require('../config/env');

/**
 * Basic request logger middleware.
 * - Uses the concise 'dev' format while developing (colored, minimal).
 * - Uses the more detailed 'combined' (Apache-style) format in production,
 *   which is more suitable for log aggregation/analysis.
 */
const logger = morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined');

module.exports = logger;
