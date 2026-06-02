const Earnings = require('../models/Earnings');

// GET /api/earnings
const getEarnings = async (req, res) => {
  try {
    let earnings = await Earnings.findOne({ email: req.user.email });
    if (!earnings) {
      earnings = { email: req.user.email, total_earnings: 0, transactions: [] };
    }
    res.json({ success: true, earnings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEarnings };
