const db = require('../database/db-connection');

const Payment = {
    // Create a payment transaction
    create: (bill, callback) => {
        const sql = 'INSERT INTO payments (receipt_id, user_id, debt, paid, type) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [bill.receipt_id, bill.user_id, bill.amount, 0, bill.type], callback);
    },
    // Get all the payments transactions of a user by their user ID
    findByUser: (id, callback) => {
        const sql = 'SELECT * FROM payments WHERE user_id = ?';
        db.query(sql, [id], callback);
    },
    // Update a payment transaction
    update: (id, payment, callback) => {
        const sql = 'UPDATE payments SET debt = ?, paid = ?, method = ? WHERE payment_id = ?';
        db.query(sql, [0, payment.amount, payment.method, id], callback);
    },
    // Delete a payment transaction
    delete: (id, callback) => {
        const sql = 'DELETE FROM payments WHERE payment_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Payment;
