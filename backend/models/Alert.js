const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  email:       { type: String, required: true, ref: 'User' },
  description: { type: String, required: true },
  severity:    { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  location:    { type: String, default: '' },
  date:        { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
