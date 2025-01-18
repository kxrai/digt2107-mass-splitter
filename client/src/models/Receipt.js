const db = require('../database/db-connection');

const Receipt = {
    create: (receipt, callback) => {
        const sql = 'INSERT INTO receipts (total_amount, receipt_date, description, group_id, billers) VALUES (?, ?, ?, ?, ?)';
        const billersJson = JSON.stringify(receipt.billers); // Convert billers array to JSON string
        db.query(sql, [receipt.amount, receipt.date, receipt.description, receipt.group_id, billersJson], callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM receipts WHERE receipt_id = ?';
        db.query(sql, [id], callback);
    },
    
    findAll: (callback) => {
        const sql = 'SELECT * FROM receipts';
        db.query(sql, callback);
    },
    
    update: (id, receipt, callback) => {
        const sql = 'UPDATE receipts SET total_amount = ?, receipt_date = ?, description = ?, group_id = ?, billers = ? WHERE receipt_id = ?';
        const billersJson = JSON.stringify(receipt.billers); // Convert billers array to JSON string
        db.query(sql, [receipt.amount, receipt.date, receipt.description, receipt.group_id, billersJson, id], callback);
    },
    
    delete: (id, callback) => {
        const sql = 'DELETE FROM receipts WHERE receipt_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Receipt;
