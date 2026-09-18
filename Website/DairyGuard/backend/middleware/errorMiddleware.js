const { sendError } = require('../utils/responseHandler');

/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('[DairyGuard Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal error occurred';

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
}

/**
 * 404 Route Not Found Handler
 */
function notFoundHandler(req, res, next) {
  return sendError(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
}

module.exports = {
  errorHandler,
  notFoundHandler
};
