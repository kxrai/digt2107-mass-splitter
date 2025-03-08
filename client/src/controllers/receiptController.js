const Receipt = require('../models/Receipt');

// Route to create a new receipt
const createReceipt = async (req, res) => {
    const newReceipt = req.body;

    Receipt.create(newReceipt, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create receipt' });
        }
        res.status(201).json({ message: 'Receipt created successfully', receiptId: result.insertId });
    });
};

// Route to find a receipt by ID
const getReceiptById = async (req, res) => {
    const receiptId = req.params.id;

    Receipt.findById(receiptId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch receipt' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json(result[0]);
    });
};

module.exports = {
    createReceipt,
    getReceiptById,
};
