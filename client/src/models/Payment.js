const db = require('../database/db-connection');

const Payment = {
    create: (bill, callback) => {
        const sql = 'INSERT INTO payments (receipt_id, user_id, debt, paid, type) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [bill.receipt_id, bill.user_id, bill.amount, 0, bill.type], callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM payments WHERE payment_id = ?';
        db.query(sql, [id], callback);
    },
    
    findByUser: (id, callback) => {
        const sql = 'SELECT * FROM payments WHERE user_id = ?';
        db.query(sql, [id], callback);
    },
    
    update: (id, payment, callback) => {
        const sql = 'UPDATE payments SET debt = ?, paid = ?, method = ? WHERE payment_id = ?';
        db.query(sql, [0, payment.amount, payment.method, id], callback);
    },
    
    delete: (id, callback) => {
        const sql = 'DELETE FROM payments WHERE payment_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Payment;
