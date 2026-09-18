const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class AuthController {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);
      return sendSuccess(res, result, 'Account created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Login successful', 200);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      return sendSuccess(res, null, 'Logged out successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return sendError(res, 'Email address is required', 400);
      }
      const result = await authService.forgotPassword(email);
      return sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { resetToken, newPassword } = req.body;
      if (!resetToken || !newPassword) {
        return sendError(res, 'Reset token and new password are required', 400);
      }
      const result = await authService.resetPassword({ resetToken, newPassword });
      return sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
