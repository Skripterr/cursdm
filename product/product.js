const { createProduct, getProductsAll } = require('../db/product');
const dotenv = require('dotenv');

dotenv.config();

const addProduct = async (req, res, next) => {
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
    console.log('On edit');
};

const deleteProducts = async (req, res, next) => {
    console.log('On delete');
};

module.exports = { addProduct, getProducts, editProducts, deleteProducts };