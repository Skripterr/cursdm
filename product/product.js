const { createProduct, getProductsAll, updateProduct, deleteProduct } = require('../db/product');
const dotenv = require('dotenv');

dotenv.config();

const addProducts = async (req, res, next) => {
    try {
        const { name, type, vendor, release_date } = req.body;

        if (!name || !type || !vendor || !release_date) {
            return res.render('dashboard', { name: req.name, username: req.username, items: req.items || [], message: 'Заполните все поля.' });
        }

        await createProduct(name, type, vendor, release_date, req.userId);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { code: 500, message: 'Внутренняя ошибка сервера.' });
    }
};

const getProducts = async (req, res, next) => {
    try {
        req.items = await getProductsAll();
        next();
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { code: 500, message: 'Внутренняя ошибка сервера.' });
    }
};

const editProducts = async (req, res, next) => {
    try {
        const { id, name, type, vendor, release_date } = req.body;

        if (!id || !name || !type || !vendor || !release_date) {
            return res.render('dashboard', { name: req.name, username: req.username, items: req.items || [], message: 'Заполните все поля.' });
        }

        await updateProduct(id, name, type, vendor, release_date, req.userId);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { code: 500, message: 'Внутренняя ошибка сервера.' });
    }
};

const deleteProducts = async (req, res, next) => {
    try {
        const id = req.body.id;

        if (!id) {
            return res.render('dashboard', { name: req.name, username: req.username, items: req.items || [], message: 'Заполните все поля.' });
        }

        await deleteProduct(id);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { code: 500, message: 'Внутренняя ошибка сервера.' });
    }
};

module.exports = { addProducts, getProducts, editProducts, deleteProducts };