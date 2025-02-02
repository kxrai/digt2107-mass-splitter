const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Adjust path if necessary

// Create a new group
const createGroup = async (req, res) => {
    const group = req.body; // Expecting { group_name: "Example Group" }
    Group.create(group, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to create group' });
        res.status(201).json({ message: 'Group created', groupId: result.insertId });
    });
};

// Add a new group member
const addMember = async (req, res) => {
    const group = req.body; 
    Group.addMember(group, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to add member' });
        res.status(201).json({ message: 'Added member', groupId: result.insertId });
    });
};

// Get group by ID
const getGroupById = async (req, res) => {
    const { id } = req.params;
    Group.findById(id, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch group' });
        if (results.length === 0) return res.status(404).json({ error: 'Group not found' });
        res.status(200).json(results[0]); // Send the group details
    });
};

// Get group by name
const getGroupByName = async (req, res) => {
    const { groupName } = req.params;
    Group.findByName(groupName, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch group_id' });
        if (results.length === 0) return res.status(404).json({ error: 'Group_id not found' });
        const { group_id, billers } = results[0];
        res.status(200).json({ group_id, billers }); // Send the group details
    });
};

// Get all groups
// const getAllGroups = async (req, res) => {
//     const userEmail = req.query.email; // Get user's email from the request
//     if (!userEmail) {
//         return res.status(400).json({ error: 'User email is required' });
//     }

//     Group.findByUserEmail(userEmail, (err, results) => {
//         if (err) return res.status(500).json({ error: 'Failed to fetch user groups' });
//         res.status(200).json(results); // Send only groups the user is part of
//     });
// };

// Hard coded groups
const getAllGroups = async (req, res) => {
    Group.findAll((err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch groups' });

        // ✅ Hardcoded test group
        const testGroup = {
            group_id: 9999, // Unique ID for testing
            group_name: "testGroup-1",
            billers: JSON.stringify(["testAlicia", "testMahjabin", "testSienna", "testSteeve"]),
        };

        // ✅ Ensure test group is **always included** with actual user groups
        const updatedResults = [...results, testGroup];

        res.status(200).json(updatedResults);
    });
};

// Update a group
const updateGroup = async (req, res) => {
    const { id } = req.params;
    const group = req.body; // Expecting { group_name: "Updated Group Name" }
    Group.update(id, group, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update group' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Group not found' });
        res.status(200).json({ message: 'Group updated' });
    });
};

// Delete a group
const deleteGroup = async (req, res) => {
    const { id } = req.params;
    Group.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to delete group' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Group not found' });
        res.status(200).json({ message: 'Group deleted' });
    });
};

module.exports = {
    createGroup,
    addMember,
    getGroupById,
    getGroupByName,
    getAllGroups,
    updateGroup,
    deleteGroup
};
