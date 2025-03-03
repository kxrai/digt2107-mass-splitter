const db = require('../database/db-connection');

const Group = {
    create: (group, callback) => {
        const sql = 'INSERT INTO pay_groups (group_name, billers) VALUES (?, ?)';
        const billersJson = JSON.stringify(group.billers); // Convert billers array to JSON string
        db.query(sql, [group.group_name, billersJson], callback);
    },
    
    addMember: (group, callback) => {
        const sql = 'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)';
        db.query(sql, [group.group_id, group.user_id], callback);
    },
    
    findById: (id, callback) => {
        const sql = 'SELECT * FROM pay_groups WHERE group_id = ?';
        db.query(sql, [id], callback);
    },

    findByName: (id, callback) => {
        const sql = 'SELECT group_id, billers FROM pay_groups WHERE group_name = ?';
        db.query(sql, [id], callback);
    },
    
    // findAll: (callback) => {
    //     const sql = 'SELECT * FROM pay_groups';
    //     db.query(sql, callback);
    // },
    findAll: (callback) => {
        const sql = 'SELECT * FROM pay_groups';
        db.query(sql, (err, results) => {
            if (err) return callback(err, null);

            callback(null, results); // ✅ No hardcoded groups here (handled in controller)
        });
    },

    findByUserEmail: (email, callback) => {
        const sql = `
            SELECT pg.group_id, pg.group_name
            FROM users u
            JOIN group_members gm ON u.user_id = gm.user_id
            JOIN pay_groups pg ON gm.group_id = pg.group_id
            WHERE u.email = ?`;
        db.query(sql, [email], callback);
    },
    
    findAllMembers: (id, callback) => {
        const sql = `
            SELECT u.user_id, u.username
            FROM group_members gm
            JOIN users u ON gm.user_id = u.user_id
            WHERE gm.group_id = ?`;
        db.query(sql, [id], callback);
    },

    update: (id, group, callback) => {
        const sql = 'UPDATE pay_groups SET group_name = ? WHERE group_id = ?';
        db.query(sql, [group.group_name, id], callback);
    },
    
    delete: (id, callback) => {
        const sql = 'DELETE FROM pay_groups WHERE group_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Group;
