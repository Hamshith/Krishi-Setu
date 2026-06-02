const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id:   { type: mongoose.Schema.Types.ObjectId, required: true },
  product_type: { type: String, enum: ['vendor_product', 'crop_market'], required: true },
  quantity:     { type: Number, required: true },
  price:        { type: Number, required: true },
  seller_email: { type: String } // To handle delayed payouts correctly
}, { _id: false });

const orderSchema = new mongoose.Schema({
  email:           { type: String, required: true, ref: 'User' },
  products:        [orderItemSchema],
  total_cost:      { type: Number, required: true },
  delivery_status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  is_paid:     { type: Boolean, default: false },
  ordered_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now },
}, { timestamps: false });

module.exports = mongoose.model('Order', orderSchema);
