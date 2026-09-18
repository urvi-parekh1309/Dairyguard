const RepositoryInterface = require('./repositoryInterface');

/**
 * InMemoryStore
 * High-performance in-memory repository implementing RepositoryInterface.
 * Ready for seamless replacement with Firebase Firestore adapter when instructed.
 */
class InMemoryStore extends RepositoryInterface {
  constructor() {
    super();
    this.users = new Map(); // id -> user object
    this.vehicles = new Map(); // id -> vehicle object
    this.batches = new Map(); // id -> batch object
    this.sensorReadings = []; // array of readings
    this.reports = new Map(); // id -> report object
    this.subscriptions = new Map(); // userId -> subscription details
    this.dairyProfiles = new Map(); // userId -> dairy profile object
  }

  // --- Auth & Users ---
  async createUser(userData) {
    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const user = {
      id,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);

    // Initialize dairy profile
    this.dairyProfiles.set(id, {
      userId: id,
      dairyName: userData.dairyName || 'My Dairy Cooperative',
      phoneNumber: userData.phoneNumber || '',
      location: userData.location || '',
      licenseNumber: '',
      contactEmail: userData.email,
      updatedAt: new Date().toISOString()
    });

    // Default to DairyGuard Complete trial or unassigned
    this.subscriptions.set(id, {
      userId: id,
      planId: 'dairyguard-complete',
      status: 'active',
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

  async updateUser(id, updateData) {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updateData, updatedAt: new Date().toISOString() };
    this.users.set(id, updated);
    return updated;
  }

  async getDairyProfile(userId) {
    return this.dairyProfiles.get(userId) || null;
  }

  async updateDairyProfile(userId, profileData) {
    const existing = this.dairyProfiles.get(userId) || { userId };
    const updated = { ...existing, ...profileData, updatedAt: new Date().toISOString() };
    this.dairyProfiles.set(userId, updated);
    return updated;
  }

  // --- Subscriptions ---
  async getUserSubscription(userId) {
    return this.subscriptions.get(userId) || null;
  }

  async updateUserSubscription(userId, subscriptionData) {
    const existing = this.subscriptions.get(userId) || { userId };
    const updated = { ...existing, ...subscriptionData, updatedAt: new Date().toISOString() };
    this.subscriptions.set(userId, updated);
    return updated;
  }

  // --- Vehicles ---
  async getVehicles(userId) {
    const results = [];
    for (const vehicle of this.vehicles.values()) {
      if (vehicle.userId === userId) {
        results.push(vehicle);
      }
    }
    return results;
  }

  async getVehicleById(userId, vehicleId) {
    const vehicle = this.vehicles.get(vehicleId);
    if (vehicle && vehicle.userId === userId) {
      return vehicle;
    }
    return null;
  }

  async createVehicle(userId, vehicleData) {
    const id = 'veh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const vehicle = {
      id,
      userId,
      vehicleId: vehicleData.vehicleId || ('DG-V-' + Math.floor(100 + Math.random() * 900)),
      vehicleNumber: vehicleData.vehicleNumber,
      driverName: vehicleData.driverName,
      source: vehicleData.source,
      destination: vehicleData.destination,
      status: vehicleData.status || 'Active', // Active, In-Transit, Idle, Maintenance
      currentBatch: vehicleData.currentBatch || null,
      temperatureSensorId: vehicleData.temperatureSensorId || ('ESP32-TH-' + id.slice(-4)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(userId, vehicleId, updateData) {
    const vehicle = await this.getVehicleById(userId, vehicleId);
    if (!vehicle) return null;
    const updated = { ...vehicle, ...updateData, updatedAt: new Date().toISOString() };
    this.vehicles.set(vehicleId, updated);
    return updated;
  }

  async deleteVehicle(userId, vehicleId) {
    const vehicle = await this.getVehicleById(userId, vehicleId);
    if (!vehicle) return false;
    this.vehicles.delete(vehicleId);
    return true;
  }

  // --- Milk Batches ---
  async getBatches(userId) {
    const results = [];
    for (const batch of this.batches.values()) {
      if (batch.userId === userId) {
        results.push(batch);
      }
    }
    return results.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getBatchById(userId, batchId) {
    const batch = this.batches.get(batchId);
    if (batch && batch.userId === userId) {
      return batch;
    }
    return null;
  }

  async createBatch(userId, batchData) {
    const id = 'bat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const batch = {
      id,
      userId,
      batchId: batchData.batchId || ('DG-B-' + Math.floor(1000 + Math.random() * 9000)),
      vehicle: batchData.vehicle || 'Unassigned',
      vehicleId: batchData.vehicleId || null,
      milkQuantity: Number(batchData.milkQuantity) || 0, // Liters
      milkType: batchData.milkType || 'Cow Milk',
      source: batchData.source,
      destination: batchData.destination,
      date: batchData.date || new Date().toISOString(),
      status: batchData.status || 'Collected', // Collected, In-Transit, Delivered, Rejected
      qrPayload: JSON.stringify({
        batchId: batchData.batchId || ('DG-B-' + Date.now().toString().slice(-4)),
        quantity: batchData.milkQuantity,
        source: batchData.source,
        destination: batchData.destination
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.batches.set(id, batch);
    return batch;
  }

  async updateBatch(userId, batchId, updateData) {
    const batch = await this.getBatchById(userId, batchId);
    if (!batch) return null;
    const updated = { ...batch, ...updateData, updatedAt: new Date().toISOString() };
    this.batches.set(batchId, updated);
    return updated;
  }

  async deleteBatch(userId, batchId) {
    const batch = await this.getBatchById(userId, batchId);
    if (!batch) return false;
    this.batches.delete(batchId);
    return true;
  }

  // --- Sensor Readings ---
  async saveSensorReading(readingData) {
    const id = 'rdg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const reading = {
      id,
      temperature: Number(readingData.temperature),
      ph: Number(readingData.ph),
      tds: Number(readingData.tds),
      timestamp: readingData.timestamp ? new Date(readingData.timestamp).toISOString() : new Date().toISOString(),
      batchId: readingData.batchId || null,
      vehicleId: readingData.vehicleId || null,
      deviceId: readingData.deviceId || 'ESP32_MILK_GUARD_01',
      userId: readingData.userId || null
    };
    this.sensorReadings.push(reading);
    return reading;
  }

  async getLatestSensorReading(userId, filter = {}) {
    // If no readings exist, return null so empty state appears
    if (this.sensorReadings.length === 0) {
      return null;
    }

    // Filter by vehicle, batch, or user if provided
    let matching = this.sensorReadings;
    if (filter.batchId) {
      matching = matching.filter(r => r.batchId === filter.batchId);
    }
    if (filter.vehicleId) {
      matching = matching.filter(r => r.vehicleId === filter.vehicleId);
    }
    if (userId) {
      matching = matching.filter(r => !r.userId || r.userId === userId);
    }

    if (matching.length === 0) return null;
    return matching[matching.length - 1];
  }

  async getSensorHistory(userId, filter = {}) {
    if (this.sensorReadings.length === 0) {
      return [];
    }

    let matching = [...this.sensorReadings];
    if (filter.batchId) {
      matching = matching.filter(r => r.batchId === filter.batchId);
    }
    if (filter.vehicleId) {
      matching = matching.filter(r => r.vehicleId === filter.vehicleId);
    }
    if (userId) {
      matching = matching.filter(r => !r.userId || r.userId === userId);
    }

    // Filter by timeframe if specified
    if (filter.timeframe) {
      const now = Date.now();
      let cutOff = 0;
      if (filter.timeframe === 'today') {
        cutOff = now - 24 * 60 * 60 * 1000;
      } else if (filter.timeframe === '7days') {
        cutOff = now - 7 * 24 * 60 * 60 * 1000;
      } else if (filter.timeframe === '30days') {
        cutOff = now - 30 * 24 * 60 * 60 * 1000;
      }
      if (cutOff > 0) {
        matching = matching.filter(r => new Date(r.timestamp).getTime() >= cutOff);
      }
    }

    return matching.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // --- Reports ---
  async saveReport(reportData) {
    const id = 'rep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const report = {
      id,
      ...reportData,
      createdAt: new Date().toISOString()
    };
    this.reports.set(id, report);
    return report;
  }

  async getReports(userId) {
    const results = [];
    for (const report of this.reports.values()) {
      if (report.userId === userId) {
        results.push(report);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getReportById(reportId) {
    return this.reports.get(reportId) || null;
  }

  async seedDemoData() {
    if (this.users.size > 0) return;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userId = 'usr_demo_dairyguard';

    // Demo User
    const demoUser = {
      id: userId,
      fullName: 'Rajesh Sharma',
      email: 'demo@dairyguard.com',
      password: hashedPassword,
      dairyName: 'Amul Anand Milk Union Co-op',
      phoneNumber: '+91 98765 43210',
      location: 'Anand, Gujarat, India',
      role: 'dairy_owner',
      createdAt: new Date().toISOString()
    };
    this.users.set(userId, demoUser);

    // Profile
    this.dairyProfiles.set(userId, {
      userId,
      dairyName: 'Amul Anand Milk Union Co-op',
      phoneNumber: '+91 98765 43210',
      location: 'Anand, Gujarat, India',
      licenseNumber: 'FSSAI-10014021001234',
      contactEmail: 'demo@dairyguard.com',
      updatedAt: new Date().toISOString()
    });

    // Subscription
    this.subscriptions.set(userId, {
      userId,
      planId: 'dairyguard-complete',
      status: 'active',
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Vehicles
    const v1Id = 'veh_demo_01';
    const v2Id = 'veh_demo_02';
    const v3Id = 'veh_demo_03';

    this.vehicles.set(v1Id, {
      id: v1Id,
      userId,
      vehicleId: 'DG-V-101',
      vehicleNumber: 'GJ-01-AB-4421',
      driverName: 'Suresh Patel',
      source: 'Collection Center Alpha (Anand)',
      destination: 'Central Processing Plant #2 (Vadodara)',
      status: 'In-Transit',
      currentBatch: 'DG-B-8091',
      temperatureSensorId: 'ESP32-TH-4421',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.vehicles.set(v2Id, {
      id: v2Id,
      userId,
      vehicleId: 'DG-V-102',
      vehicleNumber: 'GJ-07-CD-8912',
      driverName: 'Manish Verma',
      source: 'Chilling Center Beta (Nadiad)',
      destination: 'Central Processing Plant #1 (Ahmedabad)',
      status: 'In-Transit',
      currentBatch: 'DG-B-8092',
      temperatureSensorId: 'ESP32-TH-8912',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.vehicles.set(v3Id, {
      id: v3Id,
      userId,
      vehicleId: 'DG-V-103',
      vehicleNumber: 'MH-12-EF-3310',
      driverName: 'Amit Deshmukh',
      source: 'Depot Gamma (Kheda)',
      destination: 'Pending Dispatch',
      status: 'Active',
      currentBatch: null,
      temperatureSensorId: 'ESP32-TH-3310',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Batches
    const b1Id = 'bat_demo_01';
    const b2Id = 'bat_demo_02';

    this.batches.set(b1Id, {
      id: b1Id,
      userId,
      batchId: 'DG-B-8091',
      vehicle: 'GJ-01-AB-4421',
      vehicleId: v1Id,
      milkQuantity: 2400,
      milkType: 'Cow Milk',
      source: 'Collection Center Alpha (Anand)',
      destination: 'Central Processing Plant #2 (Vadodara)',
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'In-Transit',
      qrPayload: JSON.stringify({
        batchId: 'DG-B-8091',
        quantity: 2400,
        source: 'Collection Center Alpha (Anand)',
        destination: 'Central Processing Plant #2 (Vadodara)'
      }),
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.batches.set(b2Id, {
      id: b2Id,
      userId,
      batchId: 'DG-B-8092',
      vehicle: 'GJ-07-CD-8912',
      vehicleId: v2Id,
      milkQuantity: 3100,
      milkType: 'Buffalo Milk',
      source: 'Chilling Center Beta (Nadiad)',
      destination: 'Central Processing Plant #1 (Ahmedabad)',
      date: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: 'In-Transit',
      qrPayload: JSON.stringify({
        batchId: 'DG-B-8092',
        quantity: 3100,
        source: 'Chilling Center Beta (Nadiad)',
        destination: 'Central Processing Plant #1 (Ahmedabad)'
      }),
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Sensor Readings (Last 12 readings for charts)
    const now = Date.now();
    for (let i = 12; i >= 0; i--) {
      const ts = new Date(now - i * 10 * 60 * 1000).toISOString();
      this.sensorReadings.push({
        id: 'rdg_demo_' + i,
        temperature: +(3.6 + Math.sin(i / 2) * 0.4).toFixed(1),
        ph: +(6.62 + Math.cos(i / 3) * 0.04).toFixed(2),
        tds: Math.round(1120 + Math.sin(i) * 30),
        timestamp: ts,
        batchId: 'DG-B-8091',
        vehicleId: v1Id,
        deviceId: 'ESP32-TH-4421',
        userId
      });
    }
  }
}

// Export singleton instance for global in-memory state during runtime
const storeInstance = new InMemoryStore();
module.exports = storeInstance;
