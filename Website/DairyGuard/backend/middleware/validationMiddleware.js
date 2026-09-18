const { sendError } = require('../utils/responseHandler');

/**
 * Validates signup payload
 */
function validateSignup(req, res, next) {
  const { fullName, email, password, confirmPassword, dairyName } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length < 2) errors.push('Full name must be at least 2 characters long');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email address is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters long');
  if (password !== confirmPassword) errors.push('Passwords do not match');
  if (!dairyName || dairyName.trim().length < 2) errors.push('Dairy / Cooperative name is required');

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }
  next();
}

/**
 * Validates login payload
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email address is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }
  next();
}

/**
 * Validates sensor reading payload (ready for ESP32)
 */
function validateSensorReading(req, res, next) {
  const { temperature, ph, tds } = req.body;
  const errors = [];

  if (temperature === undefined || isNaN(Number(temperature))) errors.push('Numeric temperature (°C) is required');
  if (ph === undefined || isNaN(Number(ph))) errors.push('Numeric pH value is required');
  if (tds === undefined || isNaN(Number(tds))) errors.push('Numeric TDS (ppm) is required');

  if (errors.length > 0) {
    return sendError(res, 'Sensor reading payload invalid', 400, errors);
  }
  next();
}

/**
 * Validates prediction request payload
 */
function validatePrediction(req, res, next) {
  const { temperature, ph, tds, storageDuration } = req.body;
  const errors = [];

  if (temperature === undefined || isNaN(Number(temperature))) errors.push('Temperature (°C) is required');
  if (ph === undefined || isNaN(Number(ph))) errors.push('pH is required');
  if (tds === undefined || isNaN(Number(tds))) errors.push('TDS is required');
  if (storageDuration === undefined || isNaN(Number(storageDuration))) errors.push('Storage duration in hours is required');

  if (errors.length > 0) {
    return sendError(res, 'Prediction request parameters invalid', 400, errors);
  }
  next();
}

module.exports = {
  validateSignup,
  validateLogin,
  validateSensorReading,
  validatePrediction
};
