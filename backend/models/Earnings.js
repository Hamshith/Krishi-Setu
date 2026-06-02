const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  amount:   { type: Number, required: true },
  date:     { type: Date, default: Date.now },
}, { _id: false });

const earningsSchema = new mongoose.Schema({
  email:          { type: String, required: true, ref: 'User', unique: true },
  total_earnings: { type: Number, default: 0 },
  transactions:   [transactionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Earnings', earningsSchema);
