const analyticsService = require('../services/analyticsService');
const { sendSuccess } = require('../utils/responseHandler');

class AnalyticsController {
  async getMetrics(req, res, next) {
    try {
      const { timeframe, vehicleId, batchId } = req.query;
      const data = await analyticsService.getMetricsHistory(req.user?.id, { timeframe, vehicleId, batchId });
      return sendSuccess(res, data, 'Analytics data retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getBatchAnalytics(req, res, next) {
    try {
      const data = await analyticsService.getBatchAnalytics(req.user?.id, req.params.batchId);
      return sendSuccess(res, data, 'Batch analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getVehicleAnalytics(req, res, next) {
    try {
      const data = await analyticsService.getVehicleAnalytics(req.user?.id, req.params.vehicleId);
      return sendSuccess(res, data, 'Vehicle analytics retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
