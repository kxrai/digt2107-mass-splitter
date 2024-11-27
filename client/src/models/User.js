const db = require('../database/db-connection');

const User = {
    create: (user, callback) => {
        const sql = 'INSERT INTO users (username, email, phone_number, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [user.username, user.email, user.phone_number, user.password], callback);
    },
    
    findById: (id, callback) => {
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        db.query(sql, [id], callback);
    },
    
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], callback);
    },
    
    findAll: (callback) => {
        const sql = 'SELECT * FROM users';
        db.query(sql, callback);
    },
    
    update: (id, user, callback) => {
        const sql = 'UPDATE users SET username = ?, email = ?, phone_number = ?, password = ? WHERE user_id = ?';
        db.query(sql, [user.username, user.email, user.phone_number, user.password, id], callback);
    },
    
    delete: (id, callback) => {
        const sql = 'DELETE FROM users WHERE user_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = User;