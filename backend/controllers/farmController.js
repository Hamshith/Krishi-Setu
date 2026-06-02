const Farm = require('../models/Farm');

// GET /api/farm
const getFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({ email: req.user.email });
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
    res.json({ success: true, farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/farm
const updateFarm = async (req, res) => {
  try {
    const { farm_area } = req.body;
    if (!farm_area || farm_area <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid farm area' });
    }
    const farm = await Farm.findOneAndUpdate(
      { email: req.user.email },
      { farm_area: Number(farm_area) },
      { new: true }
    );
    res.json({ success: true, farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFarm, updateFarm };
