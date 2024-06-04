const { db } = require('./db');

const createProduct = (name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO products (name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID, name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement });
        });
    });
};

const updateProduct = (id, name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE products SET name = ?, serial_number = ?, measurement_range = ?, accuracy = ?, calibration_date = ?, trustee = ?, placement = ?', [name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement });
        });
    });
};

const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id });
        });
    });
};

const getProductsAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * from products', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const getProductOne = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * from products WHERE id = ?', [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

module.exports = { createProduct, updateProduct, deleteProduct, getProductsAll, getProductOne };