const Group = require('../models/Group');

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

// Get all the groups a user is in
const getAllGroups = async (req, res) => {
    const { email } = req.params; // Get user's email from the request
    if (!email) {
        return res.status(400).json({ error: 'User email is required' });
    }

    Group.findByUserEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch user groups' });
        res.status(200).json(results); // Send only groups the user is part of
    });
};

// Get all the members in a group
const getAllMembers = async (req, res) => {
    const { id } = req.params;
    Group.findAllMembers(id, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to find group members' });
        res.status(200).json(results);
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
    getAllMembers,
    deleteGroup
};
