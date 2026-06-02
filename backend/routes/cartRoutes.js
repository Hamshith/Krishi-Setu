const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { isNotVendor } = require('../middleware/roleGuard');

router.use(protect);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/remove/:itemId', removeCartItem);
router.delete('/clear', clearCart);

module.exports = router;
