const express = require('express');
const receiptController = require('../controllers/receiptController');
const router = express.Router();

router.get('/', receiptController.getAllReceipts);
router.get('/:id', receiptController.getReceiptById);
router.post('/create', receiptController.createReceipt);
router.put('/:id', receiptController.updateReceipt);
router.delete('/:id', receiptController.deleteReceipt);

module.exports = router;
