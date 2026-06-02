const express = require('express');
const router = express.Router();
const { checkout, getMyOrders, getOrderById, updateOrderStatus, getReceivedOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { isNotVendor, isFarmerOrVendor } = require('../middleware/roleGuard');

router.post('/checkout', protect, checkout);
router.get('/my', protect, getMyOrders);
router.get('/received', protect, isFarmerOrVendor, getReceivedOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, isFarmerOrVendor, updateOrderStatus);

module.exports = router;
