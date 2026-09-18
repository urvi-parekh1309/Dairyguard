const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/authMiddleware');

// Public route to view plan features and pricing
router.get('/plans', subscriptionController.getPlans);

// Protected routes to manage user subscription
router.get('/current', authenticate, subscriptionController.getCurrentSubscription);
router.post('/select', authenticate, subscriptionController.selectPlan);

module.exports = router;
