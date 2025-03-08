const db = require('../database/db-connection');

const User = {
    // Create a new user account
    create: (user, callback) => {
        const sql = 'INSERT INTO users (username, email, phone_number, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [user.username, user.email, user.phone_number, user.password], callback);
    },
    // Get a user's information by their email
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], callback);
    }
};

module.exports = User;