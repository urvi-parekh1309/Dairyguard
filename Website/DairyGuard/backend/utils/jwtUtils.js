const jwt = require('jsonwebtoken');
const config = require('../config/default');

/**
 * Generates signed JSON Web Token for authenticated user session
 */
function generateToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

/**
 * Verifies JWT token and returns decoded payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};
