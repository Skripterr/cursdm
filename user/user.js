const { getUserById } = require('../db/user');
const dotenv = require('dotenv');

dotenv.config();

const getUser = async (req, res, next) => {
    try {
        user = await getUserById(req.userId);

        if (!user) {
            return res.status(404).render('error', { code: 404, message: 'Не найден пользователь. Обратитесь к администратору.' });
        }

        req.name = user.name;
        req.username = user.username;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).render('error', {code: 500, message: 'Внутренняя ошибка сервера.'});
    }
};

module.exports = { getUser };