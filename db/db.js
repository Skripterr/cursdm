const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

let db;

const initializeDB = () => {
  db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  db.serialize(() => {
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, username TEXT, password TEXT)');
    db.run('CREATE TABLE types (id INTEGER PRIMARY KEY, name TEXT, description TEXT)');
    db.run('CREATE TABLE vendors (id INTEGER PRIMARY KEY, name TEXT, country TEXT)');
  });
  addUser('Дмитрий М.', 'dima', 'test');
};

const closeDB = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
};

const addUser = (name, username, password) => {
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

module.exports = { initializeDB, closeDB, addUser, updateUser, deleteUser, getUserById, getUserByUsername };