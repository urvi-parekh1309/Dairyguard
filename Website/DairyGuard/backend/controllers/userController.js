const userService = require('../services/userService');
const { sendSuccess } = require('../utils/responseHandler');

class UserController {
  async getProfile(req, res, next) {
    try {
      const profile = await userService.getProfile(req.user.id);
      return sendSuccess(res, profile, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);
      return sendSuccess(res, updated, 'User profile updated');
    } catch (error) {
      next(error);
    }
  }

  async getDairyProfile(req, res, next) {
    try {
      const dairy = await userService.getDairyProfile(req.user.id);
      return sendSuccess(res, dairy, 'Dairy profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateDairyProfile(req, res, next) {
    try {
      const updated = await userService.updateDairyProfile(req.user.id, req.body);
      return sendSuccess(res, updated, 'Dairy profile updated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
