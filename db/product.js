const { db } = require('./db');

const createProduct = (name, type, vendor, release_date, author) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO products (name, type, vendor, release_date, add_author) VALUES (?, ?, ?, ?, ?)', [name, type, vendor, release_date, author], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID, name, type, vendor, release_date, author });
        });
    });
};

const updateProduct = (id, name, type, vendor, release_date, author) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE products SET name = ?, type = ?, vendor = ?, release_date = ?, add_author = ? WHERE id = ?', [name, type, vendor, release_date, author, id], (err) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, name, type, vendor, release_date, author });
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