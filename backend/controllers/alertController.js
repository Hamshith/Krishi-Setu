const Alert = require('../models/Alert');

// GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ date: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/alerts
const createAlert = async (req, res) => {
  try {
    const { description, severity, location } = req.body;
    if (!description || !severity) {
      return res.status(400).json({ success: false, message: 'Description and severity are required' });
    }
    const alert = await Alert.create({ email: req.user.email, description, severity, location });
    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/alerts/:id
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, email: req.user.email });
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found or not authorized' });
    res.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAlerts, createAlert, deleteAlert };
