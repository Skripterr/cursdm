
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../db/user');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const signIn = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('signin', { message: 'Заполните все поля.' });
    }

    try {
        const user = await getUserByUsername(username);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('signin', { message: 'Неверный логин или пароль.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('access_token', token).redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', {code: 500, message: 'Внутренняя ошибка сервера.'});
    }
};

const validateJsonWebToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        res.status(403).render('error', {code: 403, message: 'Вы не вошли как пользователь.'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Cookie can't unset due to browser privacy.
            // Happens when i tries to login in Requestly
            res.status(403);
            res.clearCookie('access_token');
            res.render('error', {code: 403, message: 'Вы не вошли как пользователь.'});
        }

        req.userId = decoded.userId;
        next();
    });
};

const signOut = (req, res) => {
    if (req.cookies.access_token) {
        res.clearCookie('access_token');
    }

    res.redirect('/signin');
};

module.exports = { signIn, validateJsonWebToken, signOut };