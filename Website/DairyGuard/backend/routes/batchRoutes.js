const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', batchController.getBatches);
router.post('/', batchController.createBatch);
router.get('/:id', batchController.getBatchById);
router.put('/:id', batchController.updateBatch);
router.delete('/:id', batchController.deleteBatch);

module.exports = router;
