const { db } = require('./db');
const bcrypt = require('bcryptjs');

const createUser = (name, username, password) => {
    return new Promise((resolve, reject) => {
        const hashedPassword = bcrypt.hashSync(password, 8);
        db.run('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', [name, username, hashedPassword], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID, name, username, password: hashedPassword });
        });
    });
};

const updateUser = (id, name, username, password) => {
    return new Promise((resolve, reject) => {
        const hashedPassword = bcrypt.hashSync(password, 8);
        db.run('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?', [name, username, hashedPassword, id], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, name, username, password: hashedPassword });
        });
    });
};

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id });
        });
    });
};

const getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

module.exports = { createUser, updateUser, deleteUser, getUserById, getUserByUsername };