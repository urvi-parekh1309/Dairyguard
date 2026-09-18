const reportService = require('../services/reportService');
const { sendSuccess } = require('../utils/responseHandler');

class ReportController {
  async generateReport(req, res, next) {
    try {
      const report = await reportService.generateReport(req.user?.id, req.body);
      return sendSuccess(res, report, 'Report generated successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getReports(req, res, next) {
    try {
      const reports = await reportService.getReports(req.user?.id);
      return sendSuccess(res, reports, 'Reports retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req, res, next) {
    try {
      const report = await reportService.getReportById(req.params.id);
      return sendSuccess(res, report, 'Report details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async downloadPDF(req, res, next) {
    try {
      const report = await reportService.getReportById(req.params.id);
      const filename = `DairyGuard_Report_${report.batchId || 'Batch'}_${Date.now()}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      await reportService.streamReportPDF(req.params.id, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
