const User = require('../models/User');

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats eloRating');
    if (user) {
      res.json({
        stats: user.stats,
        eloRating: user.eloRating
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user wallet address
// @route   PUT /api/users/wallet
// @access  Private
const updateWalletAddress = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.walletAddress = walletAddress;
      await user.save();
      res.json({ message: 'Wallet address updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user achievements
// @route   GET /api/users/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('achievements nfts');
    if (user) {
      res.json({
        achievements: user.achievements,
        nfts: user.nfts
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('username eloRating stats')
      .sort({ eloRating: -1 })
      .limit(100);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserStats,
  updateWalletAddress,
  getUserAchievements,
  getLeaderboard
}; 