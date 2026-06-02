const express = require('express');
const router = express.Router();
const { updateProfile, getProfileByEmail } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.get('/profile/:email', protect, getProfileByEmail);

module.exports = router;
