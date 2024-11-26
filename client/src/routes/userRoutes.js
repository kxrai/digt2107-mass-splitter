const express = require('express');
const User = require('../models/User'); // Path to your User model
const router = express.Router();

// Route to create a new user
router.post('/create', (req, res) => {
    const newUser = req.body;

    User.create(newUser, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create user' });
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
});

// Route to find a user by ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;

    User.findById(userId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result[0]);
    });
});

// Route to find all users
router.get('/', (req, res) => {
    User.findAll((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.status(200).json(results);
    });
});

// Route to update a user
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;

    User.update(userId, updatedUser, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Route to delete a user
router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    User.delete(userId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

module.exports = router;
