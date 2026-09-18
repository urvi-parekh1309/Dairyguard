const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const batchRoutes = require('./batchRoutes');
const sensorRoutes = require('./sensorRoutes');
const predictionRoutes = require('./predictionRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const reportRoutes = require('./reportRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'DairyGuard IoT API Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount domain routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/batches', batchRoutes);
router.use('/sensors', sensorRoutes);
router.use('/prediction', predictionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
