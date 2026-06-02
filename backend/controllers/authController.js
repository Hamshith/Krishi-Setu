const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Shop = require('../models/Shop');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, address, farm_area, shop_name } = req.body;
    if (!firstname || !lastname || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ firstname, lastname, email, password, role, address });

    // Auto-create Farm or Shop
    if (role === 'farmer') {
      if (!farm_area || farm_area <= 0) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ success: false, message: 'Farm area is required for farmers' });
      }
      await Farm.create({ email, farm_area: Number(farm_area) });
    } else if (role === 'vendor') {
      if (!shop_name) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ success: false, message: 'Shop name is required for vendors' });
      }
      await Shop.create({ email, shop_name });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, firstname, lastname, email, role, address },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role, address: user.address },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe };
