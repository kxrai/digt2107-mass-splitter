const db = require('../database/db-connection');

const Receipt = {
    // Create a receipt
    create: (receipt, callback) => {
        const sql = 'INSERT INTO receipts (total_amount, receipt_date, description, group_id, billers) VALUES (?, ?, ?, ?, ?)';
        const billersJson = JSON.stringify(receipt.billers); // Convert billers array to JSON string
        db.query(sql, [receipt.amount, receipt.date, receipt.description, receipt.group_id, billersJson], callback);
    },
    // Get a receipt's info by receipt ID
    findById: (id, callback) => {
        const sql = 'SELECT * FROM receipts WHERE receipt_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Receipt;
