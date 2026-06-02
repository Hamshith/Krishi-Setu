const express = require('express');
const router = express.Router();
const { getShop, updateShop } = require('../controllers/shopController');
const { protect } = require('../middleware/auth');
const { isVendor } = require('../middleware/roleGuard');

router.get('/', protect, isVendor, getShop);
router.put('/', protect, isVendor, updateShop);

module.exports = router;
