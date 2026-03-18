const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', userController.getAllUsers);

router.get('/stats', protect, userController.getUserStats);
router.post('/stats', protect, userController.updateUserStats);
router.get('/leaderboard/:game_id', protect, userController.getLeaderboard);

module.exports = router;
