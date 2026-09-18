const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', analyticsController.getMetrics);
router.get('/batch/:batchId', analyticsController.getBatchAnalytics);
router.get('/vehicle/:vehicleId', analyticsController.getVehicleAnalytics);

module.exports = router;
