const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  email:     { type: String, required: true, ref: 'User' },
  crop_name: { type: String, required: true, trim: true },
  area_used: { type: Number, required: true, min: 0 },
  seed_used: { type: String, default: '' },
  variety:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
