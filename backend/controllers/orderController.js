const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const CropMarket = require('../models/CropMarket');
const Earnings = require('../models/Earnings');

// POST /api/orders/checkout
const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ email: req.user.email });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Validate stock and collect seller info
    const orderItems = [];

    for (const item of cart.products) {
      if (item.product_type === 'vendor_product') {
        const product = await Product.findById(item.product_id);
        if (!product) return res.status(404).json({ success: false, message: `Product ${item.product_id} not found` });
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.item}` });
        }
        product.stock -= item.quantity;
        await product.save();
        orderItems.push({ product_id: item.product_id, product_type: item.product_type, quantity: item.quantity, price: item.price_at_add, seller_email: product.vendor_email });
      } else if (item.product_type === 'crop_market') {
        const listing = await CropMarket.findById(item.product_id);
        if (!listing) return res.status(404).json({ success: false, message: `Listing ${item.product_id} not found` });
        if (listing.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${listing.item}` });
        }
        listing.stock -= item.quantity;
        await listing.save();
        orderItems.push({ product_id: item.product_id, product_type: item.product_type, quantity: item.quantity, price: item.price_at_add, seller_email: listing.farmer_email });
      }
    }

    const order = await Order.create({
      email: req.user.email,
      products: orderItems,
      total_cost: cart.total_payable,
      delivery_status: 'pending',
      is_paid: false
    });

    // Clear cart
    await Cart.findOneAndUpdate({ email: req.user.email }, { products: [], total_payable: 0 });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.user.email }).sort({ ordered_at: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.email !== req.user.email && req.user.role === 'user') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/status  (vendor/farmer who owns the product)
const updateOrderStatus = async (req, res) => {
  try {
    const { delivery_status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(delivery_status)) {
      return res.status(400).json({ success: false, message: 'Invalid delivery status' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Check if transitioning to delivered and not already paid
    const isNowDelivered = order.delivery_status !== 'delivered' && delivery_status === 'delivered';

    order.delivery_status = delivery_status;
    order.updated_at = new Date();

    if (isNowDelivered && !order.is_paid) {
      // Aggregate earnings from this order based on the new seller_email field
      const earningsMap = {};
      for (const item of order.products) {
        if (item.seller_email) {
          const amount = item.price * item.quantity;
          earningsMap[item.seller_email] = (earningsMap[item.seller_email] || 0) + amount;
        }
      }
      
      // Update earnings for each seller found in the order
      for (const [sellerEmail, amount] of Object.entries(earningsMap)) {
        await Earnings.findOneAndUpdate(
          { email: sellerEmail },
          {
            $inc: { total_earnings: amount },
            $push: { transactions: { order_id: order._id, amount, date: new Date() } },
          },
          { upsert: true, new: true }
        );
      }
      
      order.is_paid = true;
    }

    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/received  (vendor or farmer — orders containing their products)
const getReceivedOrders = async (req, res) => {
  try {
    let sellerProductIds = [];
    if (req.user.role === 'vendor') {
      const Product = require('../models/Product');
      const products = await Product.find({ vendor_email: req.user.email }).select('_id');
      sellerProductIds = products.map((p) => p._id.toString());
    } else if (req.user.role === 'farmer') {
      const CropMarket = require('../models/CropMarket');
      const listings = await CropMarket.find({ farmer_email: req.user.email }).select('_id');
      sellerProductIds = listings.map((l) => l._id.toString());
    }
    const orders = await Order.find({ 'products.product_id': { $in: sellerProductIds } }).sort({ ordered_at: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkout, getMyOrders, getOrderById, updateOrderStatus, getReceivedOrders };
