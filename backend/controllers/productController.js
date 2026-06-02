const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    if (req.query.search) filter.item = { $regex: req.query.search, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products
const addProduct = async (req, res) => {
  try {
    const { item, price, description, category, stock, imageUrl } = req.body;
    if (!item || !price || !category) {
      return res.status(400).json({ success: false, message: 'Item, price, and category are required' });
    }
    const product = await Product.create({
      vendor_email: req.user.email, item, price: Number(price), description, category, stock: Number(stock) || 0, imageUrl,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, vendor_email: req.user.email });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or not authorized' });
    const { item, price, description, category, stock, imageUrl } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { item, price: price ? Number(price) : product.price, description, category, stock: stock !== undefined ? Number(stock) : product.stock, imageUrl },
      { new: true }
    );
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor_email: req.user.email });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or not authorized' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
