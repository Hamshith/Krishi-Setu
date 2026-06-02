const express = require('express');
const router = express.Router();
const { getEarnings } = require('../controllers/earningsController');
const { protect } = require('../middleware/auth');
const { isFarmerOrVendor } = require('../middleware/roleGuard');

router.get('/', protect, isFarmerOrVendor, getEarnings);

module.exports = router;
