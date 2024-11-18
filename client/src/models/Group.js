const db = require('../config/dbConfig');

const Group = {
    create: (group, callback) => {
        const sql = 'INSERT INTO groups (group_name) VALUES (?)';
        db.query(sql, [group.group_name], callback);
    },
    
    findById: (id, callback) => {
        const sql = 'SELECT * FROM groups WHERE group_id = ?';
        db.query(sql, [id], callback);
    },
    
    findAll: (callback) => {
        const sql = 'SELECT * FROM groups';
        db.query(sql, callback);
    },
    
    update: (id, group, callback) => {
        const sql = 'UPDATE groups SET group_name = ? WHERE group_id = ?';
        db.query(sql, [group.group_name, id], callback);
    },
    
    delete: (id, callback) => {
        const sql = 'DELETE FROM groups WHERE group_id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Group;
