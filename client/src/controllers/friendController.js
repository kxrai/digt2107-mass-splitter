const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');

// Create a friendship
const createFriend = async (req, res) => {
    const { user_id, friend_id } = req.body;

    if (!user_id || !friend_id) {
        return res.status(400).json({ error: 'Both user_id and friend_id are required' });
    }

    Friend.create(user_id, friend_id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Friendship created successfully', data: results });
    });
};

// Get all friends of a user
const getFriendById = async (req, res) => {
    const { user_id } = req.params;

    Friend.findByUserId(user_id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No friends found' });
        }

        res.status(200).json(results);
    });
};

// Get all friendships (optional)
const getAllFriends = async (req, res) => {
    Friend.findAll((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
};

//Update a friend
const updateFriend = async (req, res) => {
    try {
        await Friend.update(req.params.id, req.body);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a friendship
const deleteFriend = async (req, res) => {
    const { user_id, friend_id } = req.body;

    if (!user_id || !friend_id) {
        return res.status(400).json({ error: 'Both user_id and friend_id are required' });
    }

    Friend.delete(user_id, friend_id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Friendship not found' });
        }

        res.status(200).json({ message: 'Friendship deleted successfully' });
    });
};

//module.exports = router;
module.exports = {
    getAllFriends,
    getFriendById,
    createFriend,
    updateFriend,
    deleteFriend
}