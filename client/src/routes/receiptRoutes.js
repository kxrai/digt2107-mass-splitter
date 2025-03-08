const express = require('express');
const receiptController = require('../controllers/receiptController');
const router = express.Router();

// All receipt related routes
router.get('/:id', receiptController.getReceiptById);
router.post('/create', receiptController.createReceipt);

module.exports = router;
