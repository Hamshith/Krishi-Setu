const User = require('../models/User');

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { firstname, lastname, address, password } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (address !== undefined) user.address = address;
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();
    
    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/profile/:email
const getProfileByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateProfile, getProfileByEmail };
