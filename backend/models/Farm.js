const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  email:     { type: String, required: true, ref: 'User', unique: true },
  farm_area: { type: Number, required: true, min: 0 }, // in acres
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
