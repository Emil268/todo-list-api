/**
 * Wraps an async route/controller function and forwards any rejected
 * promise (thrown error) to Express's `next`, so it reaches the
 * global error handling middleware instead of crashing the process.
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function}
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
