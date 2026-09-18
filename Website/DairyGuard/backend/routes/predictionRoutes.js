const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { validatePrediction } = require('../middleware/validationMiddleware');

router.post('/evaluate', validatePrediction, predictionController.evaluate);

module.exports = router;
