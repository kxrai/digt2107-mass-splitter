const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Adjust path if necessary

// Create a new group
router.post('/create', (req, res) => {
    const group = req.body; // Expecting { group_name: "Example Group" }
    Group.create(group, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to create group' });
        res.status(201).json({ message: 'Group created', groupId: result.insertId });
    });
});

// Get group by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Group.findById(id, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch group' });
        if (results.length === 0) return res.status(404).json({ error: 'Group not found' });
        res.status(200).json(results[0]); // Send the group details
    });
});

// Get all groups
router.get('/', (req, res) => {
    Group.findAll((err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch groups' });
        res.status(200).json(results); // Send the list of groups
    });
});

// Update a group
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const group = req.body; // Expecting { group_name: "Updated Group Name" }
    Group.update(id, group, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update group' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Group not found' });
        res.status(200).json({ message: 'Group updated' });
    });
});

// Delete a group
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Group.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to delete group' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Group not found' });
        res.status(200).json({ message: 'Group deleted' });
    });
});

module.exports = router;
