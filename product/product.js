const { createProduct, getProductsAll, getProductOne, updateProduct, deleteProduct } = require('../db/product');
const { jsPDF } = require('jspdf');
const dotenv = require('dotenv');
const fs = require('fs');

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

const getProduct = async (req, res, next) => {
    try {
        const id = req.body.id;

        if (!id) {
            return res.render('dashboard', { name: req.name, username: req.username, items: req.items || [], message: 'Заполните все поля.' });
        }

        product = await getProductOne(id);

        if (!product) {
            return res.status(404).render('error', { code: 404, message: 'Продукт не найден.' });
        }

        req.itemId = product.id;
        req.itemName = product.name;
        req.itemType = product.type;
        req.itemVendor = product.vendor;
        req.itemReleaseDate = product.release_date;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { code: 500, message: 'Внутренняя ошибка сервера.' });
    }
};

const createReport = async (req, res) => {
    try {
        const doc = new jsPDF();

        console.log(doc.getFontList());
        doc.setFont('Times', 'Roman');

        doc.setFontSize(16);

        doc.text('Certified device report', 10, 20);

        doc.setFontSize(12);
        doc.text('Device #' + req.itemId + ': ' + req.itemName, 10, 30);
        doc.text('Device type: ' + req.itemType, 10, 40);
        doc.text('Device vendor: ' + req.itemVendor, 10, 50);
        doc.text('Release date: ' + req.itemReleaseDate, 10, 60);
        //doc.save('report.pdf');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="report.pdf"');
        res.send(doc.output());

    } catch (err) {
        console.error(err);
        res.status(500).render('error', { code: 500, message: 'Внутренняя ошибка сервера.' });
    }
};

module.exports = { addProducts, getProducts, editProducts, deleteProducts, getProduct, createReport };