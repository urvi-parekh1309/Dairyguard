const store = require('../repositories/inMemoryStore');

class UserService {
  async getProfile(userId) {
    const user = await store.findUserById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      dairyName: user.dairyName,
      phoneNumber: user.phoneNumber,
      location: user.location,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  async updateProfile(userId, updateData) {
    const allowed = ['fullName', 'phoneNumber', 'location'];
    const filtered = {};
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        filtered[key] = updateData[key];
      }
    }

    const updated = await store.updateUser(userId, filtered);
    return {
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      dairyName: updated.dairyName,
      phoneNumber: updated.phoneNumber,
      location: updated.location
    };
  }

  async getDairyProfile(userId) {
    const dairy = await store.getDairyProfile(userId);
    return dairy || {
      dairyName: 'Default Cooperative',
      phoneNumber: '',
      location: '',
      licenseNumber: ''
    };
  }

  async updateDairyProfile(userId, profileData) {
    const updated = await store.updateDairyProfile(userId, profileData);
    // Also keep user dairyName in sync
    if (profileData.dairyName) {
      await store.updateUser(userId, { dairyName: profileData.dairyName });
    }
    return updated;
  }
}

module.exports = new UserService();
