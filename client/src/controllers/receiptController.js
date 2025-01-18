const express = require('express');
const Receipt = require('../models/Receipt'); // Path to your Receipt model
const router = express.Router();

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

// Route to find all receipts
const getAllReceipts = async (req, res) => {
    Receipt.findAll((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch receipts' });
        }
        res.status(200).json(results);
    });
};

// Route to update a receipt
const updateReceipt = async (req, res) => {
    const receiptId = req.params.id;
    const updatedReceipt = req.body;

    Receipt.update(receiptId, updatedReceipt, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update receipt' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json({ message: 'Receipt updated successfully' });
    });
};

// Route to delete a receipt
const deleteReceipt = async (req, res) => {
    const receiptId = req.params.id;

    Receipt.delete(receiptId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete receipt' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json({ message: 'Receipt deleted successfully' });
    });
};

module.exports = {
    createReceipt,
    getReceiptById,
    getAllReceipts,
    deleteReceipt,
    updateReceipt
};
