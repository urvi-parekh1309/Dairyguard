const store = require('../repositories/inMemoryStore');

class VehicleService {
  async getVehicles(userId) {
    return store.getVehicles(userId);
  }

  async getVehicleById(userId, vehicleId) {
    const vehicle = await store.getVehicleById(userId, vehicleId);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }

  async createVehicle(userId, vehicleData) {
    if (!vehicleData.vehicleNumber || !vehicleData.driverName) {
      const error = new Error('Vehicle number and driver name are required');
      error.statusCode = 400;
      throw error;
    }

    return store.createVehicle(userId, vehicleData);
  }

  async updateVehicle(userId, vehicleId, updateData) {
    const updated = await store.updateVehicle(userId, vehicleId, updateData);
    if (!updated) {
      const error = new Error('Vehicle not found or could not be updated');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  async deleteVehicle(userId, vehicleId) {
    const success = await store.deleteVehicle(userId, vehicleId);
    if (!success) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return { success: true, message: 'Vehicle deleted successfully' };
  }

  async assignBatch(userId, vehicleId, batchId) {
    const vehicle = await this.getVehicleById(userId, vehicleId);
    const batch = await store.getBatchById(userId, batchId);

    if (!batch) {
      const error = new Error('Batch not found');
      error.statusCode = 404;
      throw error;
    }

    // Update vehicle current batch
    const updatedVehicle = await store.updateVehicle(userId, vehicleId, {
      currentBatch: batch.batchId,
      status: 'In-Transit'
    });

    // Update batch assigned vehicle and status
    await store.updateBatch(userId, batchId, {
      vehicle: vehicle.vehicleNumber,
      vehicleId: vehicle.vehicleId,
      status: 'In-Transit'
    });

    return updatedVehicle;
  }
}

module.exports = new VehicleService();
