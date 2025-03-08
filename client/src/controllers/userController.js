const User = require('../models/User');

// Route to create a new user
const createUser = async (req, res) => {
    const newUser = req.body;

    User.create(newUser, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create user' });
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
};

// Route to find a user by email
const getUserByEmail = async (req, res) => {
    const email = req.params.email;

    User.findByEmail(email, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result[0]);
    });
};

module.exports = {
    createUser,
    getUserByEmail,
};
