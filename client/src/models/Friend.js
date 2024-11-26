const db = require('../database/db-connection');

const Friend = {
    // Create a friendship
    create: (user_id, friend_id, callback) => {
        const sql = 'INSERT INTO friends (user_id, friend_id) VALUES (?, ?)';
        db.query(sql, [user_id, friend_id], callback);
    },

    // Find all friends of a user
    findByUserId: (user_id, callback) => {
        const sql = 'SELECT u.user_id, u.username FROM friends f JOIN users u ON f.friend_id = u.user_id WHERE f.user_id = ?';
        db.query(sql, [user_id], callback);
    },

    // Find all friendships (optional)
    findAll: (callback) => {
        const sql = 'SELECT * FROM friends';
        db.query(sql, callback);
    },

    // Delete a friendship
    delete: (user_id, friend_id, callback) => {
        const sql = 'DELETE FROM friends WHERE user_id = ? AND friend_id = ?';
        db.query(sql, [user_id, friend_id], callback);
    },
};

module.exports = Friend;