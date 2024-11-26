const db = require('../database/db-connection');

const Receipt = {
    create: (receipt, callback) => {
        const sql = 'INSERT INTO receipts (total_amount, receipt_date, group_id, billers) VALUES (?, ?, ?, ?)';
        db.query(sql, [receipt.total_amount, receipt.receipt_date, receipt.group_id, receipt.billers], callback);
    },
    
    findById: (id, callback) => {
        const sql = 'SELECT * FROM receipts WHERE receipt_id = ?';
        db.query(sql, [id], callback);
    },
    
    findAll: (callback) => {
        const sql = 'SELECT * FROM receipts';
        db.query(sql, callback);
    },
    
    update: (id, user, callback) => {
        const sql = 'UPDATE receipts SET total_amount = ?, receipt_date = ?, group_id = ?, billers = ? WHERE receipt_id = ?';
        db.query(sql, [receipt.total_amount, receipt.receipt_date, receipt.group_id, receipt.billers, id], callback);
    },
    
    delete: (id, callback) => {
        const sql = 'DELETE FROM receipts WHERE receipt_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Receipt;
