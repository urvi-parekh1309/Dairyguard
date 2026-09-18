const sensorService = require('../services/sensorService');
const { sendSuccess } = require('../utils/responseHandler');

class SensorController {
  /**
   * Endpoint for ESP32 and telemetry devices to push readings
   */
  async ingestReading(req, res, next) {
    try {
      const reading = await sensorService.ingestReading({
        ...req.body,
        userId: req.user?.id || req.body.userId || null
      });
      return sendSuccess(res, reading, 'Sensor reading ingested successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves latest sensor reading.
   * If none exists, data will be null to trigger "No sensor data available." in UI.
   */
  async getLatestReading(req, res, next) {
    try {
      const { vehicleId, batchId } = req.query;
      const latest = await sensorService.getLatestReading(req.user?.id, { vehicleId, batchId });
      return sendSuccess(res, latest, latest ? 'Latest sensor reading retrieved' : 'No sensor data available.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves historical sensor readings
   */
  async getHistory(req, res, next) {
    try {
      const { vehicleId, batchId, timeframe } = req.query;
      const history = await sensorService.getHistory(req.user?.id, { vehicleId, batchId, timeframe });
      return sendSuccess(res, history, 'Sensor history retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SensorController();
