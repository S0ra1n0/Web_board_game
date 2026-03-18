const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

// Admin Dashboard Stub
router.get('/dashboard', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to the Admin Dashboard!',
        admin: {
            username: req.user.username,
            email: req.user.email
        }
    });
});

module.exports = router;
