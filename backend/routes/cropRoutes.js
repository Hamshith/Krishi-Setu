const express = require('express');
const router = express.Router();
const { getMyCrops, addCrop, updateCrop, deleteCrop, getCropSummary } = require('../controllers/cropController');
const { protect } = require('../middleware/auth');
const { isFarmer } = require('../middleware/roleGuard');

router.get('/summary', protect, getCropSummary);      // all roles can view
router.get('/my', protect, isFarmer, getMyCrops);
router.post('/', protect, isFarmer, addCrop);
router.put('/:id', protect, isFarmer, updateCrop);
router.delete('/:id', protect, isFarmer, deleteCrop);

module.exports = router;
