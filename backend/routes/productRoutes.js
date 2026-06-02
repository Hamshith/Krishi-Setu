const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { isVendor } = require('../middleware/roleGuard');

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, isVendor, addProduct);
router.put('/:id', protect, isVendor, updateProduct);
router.delete('/:id', protect, isVendor, deleteProduct);

module.exports = router;
