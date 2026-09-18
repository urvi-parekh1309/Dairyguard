const pricingConfig = require('../config/pricing.config');
const store = require('../repositories/inMemoryStore');

class SubscriptionService {
  getPlans() {
    return pricingConfig.plans;
  }

  async getCurrentSubscription(userId) {
    const sub = await store.getUserSubscription(userId);
    const planDetails = pricingConfig.plans.find(p => p.id === (sub?.planId || 'dairyguard-complete')) || pricingConfig.plans[2];

    return {
      ...sub,
      planDetails
    };
  }

  async selectPlan(userId, planId) {
    const validPlan = pricingConfig.plans.find(p => p.id === planId);
    if (!validPlan) {
      const error = new Error(`Invalid plan selected: ${planId}`);
      error.statusCode = 400;
      throw error;
    }

    const updated = await store.updateUserSubscription(userId, {
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    return {
      ...updated,
      planDetails: validPlan
    };
  }
}

module.exports = new SubscriptionService();
