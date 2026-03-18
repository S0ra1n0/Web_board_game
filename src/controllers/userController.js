const db = require('../db/db');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await db('users').select('id', 'username', 'email', 'role', 'created_at');
        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
