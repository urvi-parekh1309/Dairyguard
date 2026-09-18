const predictionService = require('../services/predictionService');
const { sendSuccess } = require('../utils/responseHandler');

class PredictionController {
  async evaluate(req, res, next) {
    try {
      const { temperature, ph, tds, storageDuration } = req.body;
      const prediction = await predictionService.evaluateRisk({
        temperature,
        ph,
        tds,
        storageDuration
      });
      return sendSuccess(res, prediction, 'Spoilage prediction evaluation complete');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PredictionController();
