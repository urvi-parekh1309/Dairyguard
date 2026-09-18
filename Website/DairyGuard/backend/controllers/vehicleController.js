const vehicleService = require('../services/vehicleService');
const { sendSuccess } = require('../utils/responseHandler');

class VehicleController {
  async getVehicles(req, res, next) {
    try {
      const vehicles = await vehicleService.getVehicles(req.user.id);
      return sendSuccess(res, vehicles, 'Vehicles retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getVehicleById(req, res, next) {
    try {
      const vehicle = await vehicleService.getVehicleById(req.user.id, req.params.id);
      return sendSuccess(res, vehicle, 'Vehicle retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createVehicle(req, res, next) {
    try {
      const created = await vehicleService.createVehicle(req.user.id, req.body);
      return sendSuccess(res, created, 'Vehicle added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req, res, next) {
    try {
      const updated = await vehicleService.updateVehicle(req.user.id, req.params.id, req.body);
      return sendSuccess(res, updated, 'Vehicle updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req, res, next) {
    try {
      const result = await vehicleService.deleteVehicle(req.user.id, req.params.id);
      return sendSuccess(res, result, 'Vehicle removed');
    } catch (error) {
      next(error);
    }
  }

  async assignBatch(req, res, next) {
    try {
      const { batchId } = req.body;
      const result = await vehicleService.assignBatch(req.user.id, req.params.id, batchId);
      return sendSuccess(res, result, 'Batch assigned to vehicle successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VehicleController();
