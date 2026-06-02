const Shop = require('../models/Shop');

// GET /api/shop
const getShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ email: req.user.email });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/shop
const updateShop = async (req, res) => {
  try {
    const { shop_name } = req.body;
    if (!shop_name) return res.status(400).json({ success: false, message: 'Shop name is required' });
    const shop = await Shop.findOneAndUpdate(
      { email: req.user.email },
      { shop_name },
      { new: true }
    );
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getShop, updateShop };
