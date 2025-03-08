const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

// All payment related routes
router.get('/user/:id', paymentController.getPaymentByUser);
router.post('/create', paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
