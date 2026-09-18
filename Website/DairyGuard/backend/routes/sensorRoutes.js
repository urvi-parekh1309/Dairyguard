const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { validateSensorReading } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

// Telemetry ingestion endpoint - ready for ESP32 devices
router.post('/reading', validateSensorReading, sensorController.ingestReading);

// Telemetry query endpoints
router.get('/latest', authenticate, sensorController.getLatestReading);
router.get('/history', authenticate, sensorController.getHistory);

module.exports = router;
