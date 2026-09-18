/**
 * Repository Interface
 * Defines the contract that any storage engine (InMemory, Firebase Firestore, MongoDB)
 * must satisfy for DairyGuard.
 */
class RepositoryInterface {
  // User & Dairy Profile methods
  async createUser(userData) { throw new Error('Not implemented'); }
  async findUserByEmail(email) { throw new Error('Not implemented'); }
  async findUserById(id) { throw new Error('Not implemented'); }
  async updateUser(id, updateData) { throw new Error('Not implemented'); }
  async getDairyProfile(userId) { throw new Error('Not implemented'); }
  async updateDairyProfile(userId, profileData) { throw new Error('Not implemented'); }

  // Subscription methods
  async getUserSubscription(userId) { throw new Error('Not implemented'); }
  async updateUserSubscription(userId, subscriptionData) { throw new Error('Not implemented'); }

  // Vehicle methods
  async getVehicles(userId) { throw new Error('Not implemented'); }
  async getVehicleById(userId, vehicleId) { throw new Error('Not implemented'); }
  async createVehicle(userId, vehicleData) { throw new Error('Not implemented'); }
  async updateVehicle(userId, vehicleId, updateData) { throw new Error('Not implemented'); }
  async deleteVehicle(userId, vehicleId) { throw new Error('Not implemented'); }

  // Batch methods
  async getBatches(userId) { throw new Error('Not implemented'); }
  async getBatchById(userId, batchId) { throw new Error('Not implemented'); }
  async createBatch(userId, batchData) { throw new Error('Not implemented'); }
  async updateBatch(userId, batchId, updateData) { throw new Error('Not implemented'); }
  async deleteBatch(userId, batchId) { throw new Error('Not implemented'); }

  // Sensor methods
  async saveSensorReading(readingData) { throw new Error('Not implemented'); }
  async getLatestSensorReading(userId, filter) { throw new Error('Not implemented'); }
  async getSensorHistory(userId, filter) { throw new Error('Not implemented'); }

  // Reports
  async saveReport(reportData) { throw new Error('Not implemented'); }
  async getReports(userId) { throw new Error('Not implemented'); }
  async getReportById(reportId) { throw new Error('Not implemented'); }
}

module.exports = RepositoryInterface;
