const mongoose = require('mongoose');

const cropMarketSchema = new mongoose.Schema({
  farmer_email:          { type: String, required: true, ref: 'User' },
  item:                  { type: String, required: true, trim: true },
  price:                 { type: Number, required: true, min: 0 },
  min_purchase_quantity: { type: Number, default: 1 },
  description:           { type: String, default: '' },
  unit:                  { type: String, default: 'kg' }, // kg, quintal, ton, etc.
  stock:                 { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CropMarket', cropMarketSchema);
