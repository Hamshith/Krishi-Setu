const express = require('express');
const router = express.Router();
const { getListings, getListingById, addListing, updateListing, deleteListing } = require('../controllers/cropMarketController');
const { protect } = require('../middleware/auth');
const { isFarmer } = require('../middleware/roleGuard');

router.get('/', protect, getListings);
router.get('/:id', protect, getListingById);
router.post('/', protect, isFarmer, addListing);
router.put('/:id', protect, isFarmer, updateListing);
router.delete('/:id', protect, isFarmer, deleteListing);

module.exports = router;
