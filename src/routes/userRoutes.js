const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/profile', protect, userController.getProfile);

router.get('/stats', protect, userController.getUserStats);
router.post('/stats', protect, userController.updateUserStats);
router.get('/leaderboard/:game_id', protect, userController.getLeaderboard);

router.post('/save-game', protect, userController.saveGameProgress);
router.get('/load-game/:game_id', protect, userController.loadGameProgress);
router.delete('/delete-game/:game_id', protect, userController.deleteGameProgress);

module.exports = router;
