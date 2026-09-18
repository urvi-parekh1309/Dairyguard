const store = require('../repositories/inMemoryStore');
const predictionService = require('./predictionService');

class SensorService {
  /**
   * Ingests a new telemetry reading from an IoT device (such as an ESP32)
   */
  async ingestReading({ temperature, ph, tds, timestamp, batchId, vehicleId, deviceId, userId }) {
    const reading = await store.saveSensorReading({
      temperature: Number(temperature),
      ph: Number(ph),
      tds: Number(tds),
      timestamp: timestamp || new Date().toISOString(),
      batchId: batchId || null,
      vehicleId: vehicleId || null,
      deviceId: deviceId || 'ESP32_MILK_GUARD',
      userId: userId || null
    });

    return reading;
  }

  /**
   * Retrieves the latest sensor reading for a user or vehicle/batch.
   * Returns null if no sensor data is available yet (for proper empty state).
   */
  async getLatestReading(userId, filter = {}) {
    const reading = await store.getLatestSensorReading(userId, filter);
    if (!reading) {
      return null;
    }

    // Attach automated prediction analysis based on the latest reading
    const prediction = await predictionService.evaluateRisk({
      temperature: reading.temperature,
      ph: reading.ph,
      tds: reading.tds,
      storageDuration: 2 // default baseline 2 hours transit
    });

    return {
      ...reading,
      prediction
    };
  }

  /**
   * Retrieves historical telemetry readings with optional filters
   */
  async getHistory(userId, filter = {}) {
    return store.getSensorHistory(userId, filter);
  }
}

module.exports = new SensorService();
