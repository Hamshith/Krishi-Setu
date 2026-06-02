const Cart = require('../models/Cart');
const Product = require('../models/Product');
const CropMarket = require('../models/CropMarket');

const recalcTotal = (products) => products.reduce((sum, item) => sum + item.price_at_add * item.quantity, 0);

// GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ email: req.user.email });
    if (!cart) cart = await Cart.create({ email: req.user.email, products: [], total_payable: 0 });
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { product_id, product_type, quantity } = req.body;
    if (!product_id || !product_type) {
      return res.status(400).json({ success: false, message: 'product_id and product_type are required' });
    }
    let price;
    if (product_type === 'vendor_product') {
      const p = await Product.findById(product_id);
      if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
      if (p.stock < (quantity || 1)) return res.status(400).json({ success: false, message: 'Insufficient stock' });
      price = p.price;
    } else if (product_type === 'crop_market') {
      const p = await CropMarket.findById(product_id);
      if (!p) return res.status(404).json({ success: false, message: 'Crop market listing not found' });
      if (p.stock < (quantity || 1)) return res.status(400).json({ success: false, message: 'Insufficient stock' });
      price = p.price;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid product_type' });
    }

    let cart = await Cart.findOne({ email: req.user.email });
    if (!cart) cart = await Cart.create({ email: req.user.email, products: [], total_payable: 0 });

    const existingIdx = cart.products.findIndex(
      (p) => p.product_id.toString() === product_id && p.product_type === product_type
    );
    if (existingIdx > -1) {
      cart.products[existingIdx].quantity += Number(quantity) || 1;
    } else {
      cart.products.push({ product_id, product_type, quantity: Number(quantity) || 1, price_at_add: price });
    }
    cart.total_payable = recalcTotal(cart.products);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/cart/update/:itemId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid quantity required' });
    }
    const cart = await Cart.findOne({ email: req.user.email });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.products.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });
    item.quantity = Number(quantity);
    cart.total_payable = recalcTotal(cart.products);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/remove/:itemId
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ email: req.user.email });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.products = cart.products.filter((p) => p._id.toString() !== req.params.itemId);
    cart.total_payable = recalcTotal(cart.products);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { email: req.user.email },
      { products: [], total_payable: 0 },
      { new: true }
    );
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
