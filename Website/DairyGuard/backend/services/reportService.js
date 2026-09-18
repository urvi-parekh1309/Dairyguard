const store = require('../repositories/inMemoryStore');
const predictionService = require('./predictionService');
const { generateMilkReportPDF } = require('../utils/pdfGenerator');

class ReportService {
  /**
   * Compiles batch data, latest sensor readings, and prediction analysis into a report record
   */
  async generateReport(userId, { batchId, dateFrom, dateTo }) {
    const user = await store.findUserById(userId);
    const dairyProfile = await store.getDairyProfile(userId);
    let batch = null;

    if (batchId) {
      batch = await store.getBatchById(userId, batchId);
    }

    // Get sensor history for this batch or user
    const readings = await store.getSensorHistory(userId, { batchId });

    let avgTemp = null;
    let avgPh = null;
    let avgTds = null;
    let risk = 'Low Risk';
    let confidence = 95;

    if (readings.length > 0) {
      const sumTemp = readings.reduce((acc, r) => acc + r.temperature, 0);
      const sumPh = readings.reduce((acc, r) => acc + r.ph, 0);
      const sumTds = readings.reduce((acc, r) => acc + r.tds, 0);
      avgTemp = sumTemp / readings.length;
      avgPh = sumPh / readings.length;
      avgTds = sumTds / readings.length;

      const pred = await predictionService.evaluateRisk({
        temperature: avgTemp,
        ph: avgPh,
        tds: avgTds,
        storageDuration: 3
      });
      risk = pred.spoilageRisk;
      confidence = pred.confidence;
    }

    const reportData = {
      userId,
      dairyName: dairyProfile?.dairyName || user?.dairyName || 'Verified Cooperative',
      batchId: batch?.batchId || batchId || 'N/A',
      milkQuantity: batch?.milkQuantity || 0,
      milkType: batch?.milkType || 'Raw Cow Milk',
      vehicleId: batch?.vehicleId || 'N/A',
      vehicleNumber: batch?.vehicle || 'N/A',
      source: batch?.source || 'Collection Hub',
      destination: batch?.destination || 'Processing Facility',
      status: batch?.status || 'In-Transit',
      avgTemperature: avgTemp,
      avgPh: avgPh,
      avgTds: avgTds,
      spoilageRisk: risk,
      confidence,
      durationHours: 3.5,
      dateRange: { dateFrom, dateTo }
    };

    return store.saveReport(reportData);
  }

  async getReports(userId) {
    return store.getReports(userId);
  }

  async getReportById(reportId) {
    const report = await store.getReportById(reportId);
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }
    return report;
  }

  /**
   * Streams the generated PDF directly to the client
   */
  async streamReportPDF(reportId, outputStream) {
    const report = await this.getReportById(reportId);
    return generateMilkReportPDF(report, outputStream);
  }
}

module.exports = new ReportService();
