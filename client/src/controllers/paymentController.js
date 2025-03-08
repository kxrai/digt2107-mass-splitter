const Payment = require('../models/Payment');

// Route to create a new Payment
const createPayment = async (req, res) => {
    const newPayment = req.body;

    Payment.create(newPayment, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create Payment' });
        }
        res.status(201).json({ message: 'Payment created successfully', PaymentId: result.insertId });
    });
};

// Route to find all Payments of a certain user
const getPaymentByUser = async (req, res) => {
    const userId = req.params.id;
    Payment.findByUser(userId, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch Payments' });
        }
        res.status(200).json(results);
    });
};

// Route to update a Payment
const updatePayment = async (req, res) => {
    const paymentId = req.params.id;
    const updatedPayment = req.body;

    Payment.update(paymentId, updatedPayment, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update Payment' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully' });
    });
};

// Route to delete a Payment
const deletePayment = async (req, res) => {
    const paymentId = req.params.id;

    Payment.delete(paymentId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete Payment' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    });
};

module.exports = {
    createPayment,
    getPaymentByUser,
    deletePayment,
    updatePayment
};
