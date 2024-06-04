const { createProduct, getProductsAll, getProductOne, updateProduct, deleteProduct } = require('../db/product');
const { jsPDF } = require('jspdf');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const addProducts = async (req, res, next) => {
    try {
        const { name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement } = req.body;
        console.log(req.body);

        if (!name || !serial_number || !measurement_range || !accuracy || !calibration_date || !trustee || !placement) {
            return res.render('dashboard', { name: req.userName, username: req.userUserName, items: req.items || [], message: 'Заполните все поля.' });
        }

        await createProduct(name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement);
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
        const { id, name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement } = req.body;

        if (!id || !name || !serial_number || !measurement_range || !accuracy || !calibration_date || !trustee || !placement) {
            return res.render('dashboard', { name: req.userName, username: req.userUserName, items: req.items || [], message: 'Заполните все поля.' });
        }

        await updateProduct(id, name, serial_number, measurement_range, accuracy, calibration_date, trustee, placement);
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
            return res.render('dashboard', { name: req.userName, username: req.userUserName, items: req.items || [], message: 'Заполните все поля.' });
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
            return res.render('dashboard', { name: req.userName, username: req.userUserName, items: req.items || [], message: 'Заполните все поля.' });
        }

        product = await getProductOne(id);

        if (!product) {
            return res.status(404).render('error', { code: 404, message: 'Продукт не найден.' });
        }

        req.itemId = product.id;
        req.itemName = product.name;
        req.itemSerialNumber = product.serial_number;
        req.itemMeasurementRange = product.measurement_range;
        req.itemAccuracy = product.accuracy;
        req.itemCalibrationDate = product.calibration_date;
        req.itemTrustee = product.trustee;
        req.itemPlacement = product.placement;

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
        // Font doesn't support UTF-8
        doc.setFont('Times', 'Roman');

        doc.setFontSize(16);

        doc.text('Certified device report', 10, 20);

        doc.setFontSize(12);
        doc.text('Device #' + req.itemId + ': ' + req.itemName, 10, 30);
        doc.text('Device serial number: ' + req.itemSerialNumber, 10, 40);
        doc.text('Device measurement range: ' + req.itemMeasurementRange, 10, 50);
        doc.text('Device accuracy: ' + req.itemAccuracy, 10, 60);
        doc.text('Trustee: ' + req.itemTrustee, 10, 70);
        doc.text('Placement: ' + req.itemPlacement, 10, 80);
        doc.text('Last calibration date: ' + req.itemCalibrationDate, 10, 90);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="report.pdf"');
        res.send(doc.output());

    } catch (err) {
        console.error(err);
        res.status(500).render('error', { code: 500, message: 'Внутренняя ошибка сервера.' });
    }
};

module.exports = { addProducts, getProducts, editProducts, deleteProducts, getProduct, createReport };