const CropMarket = require('../models/CropMarket');

// GET /api/cropmarket
const getListings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) filter.item = { $regex: req.query.search, $options: 'i' };
    const listings = await CropMarket.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cropmarket/:id
const getListingById = async (req, res) => {
  try {
    const listing = await CropMarket.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/cropmarket
const addListing = async (req, res) => {
  try {
    const { item, price, min_purchase_quantity, description, unit, stock } = req.body;
    if (!item || !price || !stock) {
      return res.status(400).json({ success: false, message: 'Item, price, and stock are required' });
    }
    const listing = await CropMarket.create({
      farmer_email: req.user.email, item, price: Number(price),
      min_purchase_quantity: Number(min_purchase_quantity) || 1,
      description, unit: unit || 'kg', stock: Number(stock),
    });
    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/cropmarket/:id
const updateListing = async (req, res) => {
  try {
    const listing = await CropMarket.findOne({ _id: req.params.id, farmer_email: req.user.email });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found or not authorized' });
    const { item, price, min_purchase_quantity, description, unit, stock } = req.body;
    const updated = await CropMarket.findByIdAndUpdate(
      req.params.id,
      { item, price: price ? Number(price) : listing.price, min_purchase_quantity: min_purchase_quantity ? Number(min_purchase_quantity) : listing.min_purchase_quantity, description, unit, stock: stock !== undefined ? Number(stock) : listing.stock },
      { new: true }
    );
    res.json({ success: true, listing: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cropmarket/:id
const deleteListing = async (req, res) => {
  try {
    const listing = await CropMarket.findOneAndDelete({ _id: req.params.id, farmer_email: req.user.email });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found or not authorized' });
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getListings, getListingById, addListing, updateListing, deleteListing };
