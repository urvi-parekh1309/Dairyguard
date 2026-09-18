const batchService = require('../services/batchService');
const { sendSuccess } = require('../utils/responseHandler');

class BatchController {
  async getBatches(req, res, next) {
    try {
      const batches = await batchService.getBatches(req.user.id);
      return sendSuccess(res, batches, 'Milk batches retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getBatchById(req, res, next) {
    try {
      const batch = await batchService.getBatchById(req.user.id, req.params.id);
      return sendSuccess(res, batch, 'Batch details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createBatch(req, res, next) {
    try {
      const created = await batchService.createBatch(req.user.id, req.body);
      return sendSuccess(res, created, 'Milk batch registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateBatch(req, res, next) {
    try {
      const updated = await batchService.updateBatch(req.user.id, req.params.id, req.body);
      return sendSuccess(res, updated, 'Batch status updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteBatch(req, res, next) {
    try {
      const result = await batchService.deleteBatch(req.user.id, req.params.id);
      return sendSuccess(res, result, 'Batch archived');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BatchController();
