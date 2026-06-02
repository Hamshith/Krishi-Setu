const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product_id:    { type: mongoose.Schema.Types.ObjectId, required: true },
  product_type:  { type: String, enum: ['vendor_product', 'crop_market'], required: true },
  quantity:      { type: Number, required: true, min: 1, default: 1 },
  price_at_add:  { type: Number, required: true },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  email:         { type: String, required: true, ref: 'User', unique: true },
  products:      [cartItemSchema],
  total_payable: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
