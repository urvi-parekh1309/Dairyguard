const store = require('../repositories/inMemoryStore');

class BatchService {
  async getBatches(userId) {
    return store.getBatches(userId);
  }

  async getBatchById(userId, batchId) {
    const batch = await store.getBatchById(userId, batchId);
    if (!batch) {
      const error = new Error('Milk batch not found');
      error.statusCode = 404;
      throw error;
    }
    return batch;
  }

  async createBatch(userId, batchData) {
    if (!batchData.milkQuantity || !batchData.source || !batchData.destination) {
      const error = new Error('Milk quantity, source location, and destination are required');
      error.statusCode = 400;
      throw error;
    }

    return store.createBatch(userId, batchData);
  }

  async updateBatch(userId, batchId, updateData) {
    const updated = await store.updateBatch(userId, batchId, updateData);
    if (!updated) {
      const error = new Error('Milk batch not found or could not be updated');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  async deleteBatch(userId, batchId) {
    const success = await store.deleteBatch(userId, batchId);
    if (!success) {
      const error = new Error('Milk batch not found');
      error.statusCode = 404;
      throw error;
    }
    return { success: true, message: 'Milk batch deleted successfully' };
  }
}

module.exports = new BatchService();
