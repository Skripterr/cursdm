const { getUserById } = require('../db/db');
const dotenv = require('dotenv');

dotenv.config();

const getUser = async (req, res) => {
    try {
        const { userId } = req.query;

        user = await getUserById(userId || req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({ success: true, data: { id: 10000000 + user.id, name: user.name, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = { getUser };