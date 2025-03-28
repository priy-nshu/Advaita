const express = require('express');
const router = express.Router();
const { 
  getUserStats, 
  updateWalletAddress, 
  getUserAchievements, 
  getLeaderboard 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getUserStats);
router.put('/wallet', protect, updateWalletAddress);
router.get('/achievements', protect, getUserAchievements);
router.get('/leaderboard', getLeaderboard);

module.exports = router; 