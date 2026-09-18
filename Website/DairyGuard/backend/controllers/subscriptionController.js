const subscriptionService = require('../services/subscriptionService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class SubscriptionController {
  getPlans(req, res) {
    const plans = subscriptionService.getPlans();
    return sendSuccess(res, plans, 'Subscription plans retrieved');
  }

  async getCurrentSubscription(req, res, next) {
    try {
      const sub = await subscriptionService.getCurrentSubscription(req.user.id);
      return sendSuccess(res, sub, 'Current subscription retrieved');
    } catch (error) {
      next(error);
    }
  }

  async selectPlan(req, res, next) {
    try {
      const { planId } = req.body;
      if (!planId) {
        return sendError(res, 'planId is required', 400);
      }
      const updated = await subscriptionService.selectPlan(req.user.id, planId);
      return sendSuccess(res, updated, 'Subscription plan updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubscriptionController();
