const store = require('../repositories/inMemoryStore');
const predictionService = require('./predictionService');

class AnalyticsService {
  async getMetricsHistory(userId, { timeframe = '7days', vehicleId, batchId }) {
    const rawReadings = await store.getSensorHistory(userId, { timeframe, vehicleId, batchId });

    if (!rawReadings || rawReadings.length === 0) {
      return {
        hasData: false,
        summary: null,
        temperatureSeries: [],
        phSeries: [],
        tdsSeries: [],
        spoilageRiskSeries: []
      };
    }

    const temperatureSeries = [];
    const phSeries = [];
    const tdsSeries = [];
    const spoilageRiskSeries = [];

    let sumTemp = 0;
    let sumPh = 0;
    let sumTds = 0;
    let maxTemp = -Infinity;
    let minTemp = Infinity;

    for (const r of rawReadings) {
      const timeLabel = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      temperatureSeries.push({ timestamp: r.timestamp, label: timeLabel, value: r.temperature });
      phSeries.push({ timestamp: r.timestamp, label: timeLabel, value: r.ph });
      tdsSeries.push({ timestamp: r.timestamp, label: timeLabel, value: r.tds });

      // Run prediction for risk curve
      const pred = await predictionService.evaluateRisk({
        temperature: r.temperature,
        ph: r.ph,
        tds: r.tds,
        storageDuration: 2
      });

      spoilageRiskSeries.push({
        timestamp: r.timestamp,
        label: timeLabel,
        riskScore: pred.riskScore,
        riskLevel: pred.spoilageRisk
      });

      sumTemp += r.temperature;
      sumPh += r.ph;
      sumTds += r.tds;
      if (r.temperature > maxTemp) maxTemp = r.temperature;
      if (r.temperature < minTemp) minTemp = r.temperature;
    }

    const count = rawReadings.length;

    return {
      hasData: true,
      summary: {
        totalReadings: count,
        avgTemperature: Number((sumTemp / count).toFixed(1)),
        minTemperature: Number(minTemp.toFixed(1)),
        maxTemperature: Number(maxTemp.toFixed(1)),
        avgPh: Number((sumPh / count).toFixed(2)),
        avgTds: Math.round(sumTds / count)
      },
      temperatureSeries,
      phSeries,
      tdsSeries,
      spoilageRiskSeries
    };
  }

  async getBatchAnalytics(userId, batchId) {
    return this.getMetricsHistory(userId, { batchId });
  }

  async getVehicleAnalytics(userId, vehicleId) {
    return this.getMetricsHistory(userId, { vehicleId });
  }
}

module.exports = new AnalyticsService();
