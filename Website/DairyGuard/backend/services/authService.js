const store = require('../repositories/inMemoryStore');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

class AuthService {
  async signup({ fullName, email, password, dairyName, phoneNumber, location }) {
    const existing = await store.findUserByEmail(email);
    if (existing) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await store.createUser({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      dairyName,
      phoneNumber: phoneNumber || '',
      location: location || '',
      role: 'dairy_owner'
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return {
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        dairyName: newUser.dairyName,
        phoneNumber: newUser.phoneNumber,
        location: newUser.location,
        role: newUser.role
      },
      token
    };
  }

  async login({ email, password }) {
    const user = await store.findUserByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        dairyName: user.dairyName,
        phoneNumber: user.phoneNumber,
        location: user.location,
        role: user.role
      },
      token
    };
  }

  async forgotPassword(email) {
    const user = await store.findUserByEmail(email);
    if (!user) {
      // Return success anyway to avoid user enumeration
      return { message: 'If an account exists with this email, a password reset link has been dispatched.' };
    }

    // In-memory reset token creation
    const resetToken = 'rst_' + Math.random().toString(36).substr(2, 10);
    await store.updateUser(user.id, { resetToken, resetExpires: Date.now() + 3600000 });

    return {
      message: 'Password reset link has been dispatched to your email.',
      resetToken // Returned in dev for easy verification
    };
  }

  async resetPassword({ resetToken, newPassword }) {
    for (const user of store.users.values()) {
      if (user.resetToken === resetToken && user.resetExpires > Date.now()) {
        const hashedPassword = await hashPassword(newPassword);
        await store.updateUser(user.id, {
          password: hashedPassword,
          resetToken: null,
          resetExpires: null
        });
        return { message: 'Password has been updated successfully. You can now log in.' };
      }
    }
    const error = new Error('Password reset token is invalid or has expired');
    error.statusCode = 400;
    throw error;
  }
}

module.exports = new AuthService();
