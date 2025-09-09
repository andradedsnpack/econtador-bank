const express = require('express');
const TransferController = require('../controllers/transferController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', TransferController.getTransfers);
router.post('/', TransferController.createTransfer);

module.exports = router;