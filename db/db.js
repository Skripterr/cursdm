const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

const initializeDB = () => {
  db.serialize(() => {
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, username TEXT, password TEXT)');
    db.run('CREATE TABLE types (id INTEGER PRIMARY KEY, name TEXT, description TEXT)');
    db.run('CREATE TABLE vendors (id INTEGER PRIMARY KEY, name TEXT, country TEXT)');
    db.run('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, type TEXT, vendor TEXT, release_date TEXT, add_author INTEGER)');
  });
};

const closeDB = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
};

module.exports = { initializeDB, db, closeDB, };