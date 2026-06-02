const express = require('express');
const router = express.Router();
const { getFarm, updateFarm } = require('../controllers/farmController');
const { protect } = require('../middleware/auth');
const { isFarmer } = require('../middleware/roleGuard');

router.get('/', protect, isFarmer, getFarm);
router.put('/', protect, isFarmer, updateFarm);

module.exports = router;
