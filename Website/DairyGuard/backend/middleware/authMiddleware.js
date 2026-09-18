const { verifyToken } = require('../utils/jwtUtils');
const { sendError } = require('../utils/responseHandler');
const store = require('../repositories/inMemoryStore');

/**
 * Authentication Middleware
 * Validates the JWT Bearer token and attaches authenticated user data to the request
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please provide a valid Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return sendError(res, 'Invalid or expired authentication token. Please log in again.', 401);
    }

    const user = await store.findUserById(decoded.userId);
    if (!user) {
      return sendError(res, 'User account associated with token not found.', 401);
    }

    // Attach sanitized user to request object
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      dairyName: user.dairyName
    };

    next();
  } catch (error) {
    return sendError(res, 'Authentication error: ' + error.message, 500);
  }
}

module.exports = {
  authenticate
};
