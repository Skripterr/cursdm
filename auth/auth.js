
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../db/db');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const signIn = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const user = await getUserByUsername(username);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Incorrect username or password.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ success: true, data: { access_token: token } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const validateJsonWebToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(400).json({ success: false, message: 'No Json Web Token specified.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid Json Web Token.' });
        }

        console.log(decoded);

        req.userId = decoded.userId;
        next();
    });
};

const signOut = (req, res) => {
    if (req.cookies.access_token) {
        res.clearCookie('access_token');
    }

    res.redirect('/signin')
};

module.exports = { signIn, validateJsonWebToken, signOut };