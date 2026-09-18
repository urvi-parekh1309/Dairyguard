const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/generate', reportController.generateReport);
router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.get('/:id/pdf', reportController.downloadPDF);

module.exports = router;
