const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor_email: { type: String, required: true, ref: 'User' },
  item:         { type: String, required: true, trim: true },
  price:        { type: Number, required: true, min: 0 },
  description:  { type: String, default: '' },
  category:     { type: String, enum: ['seed', 'fertilizer', 'pesticide', 'equipment', 'other'], required: true },
  stock:        { type: Number, required: true, min: 0, default: 0 },
  imageUrl:     { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
