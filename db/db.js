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
    db.run('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, serial_number TEXT, measurement_range TEXT, accuracy TEXT, calibration_date TEXT, trustee TEXT, placement TEXT)');
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