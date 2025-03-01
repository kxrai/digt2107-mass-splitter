const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.get('/user/:id', paymentController.getPaymentByUser);
router.get('/:id', paymentController.getPaymentById);
router.post('/create', paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
