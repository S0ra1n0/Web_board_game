const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password' });
        }

        // Check if user already exists
        const existingUser = await db('users').where({ email }).orWhere({ username }).first();
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email or username' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user (default role is 'user')
        const [newUser] = await db('users').insert({
            username,
            email,
            password_hash: hashedPassword,
            role: 'user'
        }).returning(['id', 'username', 'email', 'role']);

        const token = signToken(newUser.id, newUser.role);

        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await db('users').where({ email }).first();

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        const token = signToken(user.id, user.role);

        // Remove password from output
        delete user.password_hash;

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        if (!username || !newPassword) {
            return res.status(400).json({ error: 'Please provide username and new password' });
        }

        // Find user by username
        const user = await db('users').where({ username }).first();
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await db('users').where({ id: user.id }).update({
            password_hash: hashedPassword
        });

        res.status(200).json({
            status: 'success',
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};
