const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// GET /api/crops/my
const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ email: req.user.email }).sort({ createdAt: -1 });
    const farm = await Farm.findOne({ email: req.user.email });
    const usedArea = crops.reduce((sum, c) => sum + c.area_used, 0);
    res.json({ success: true, crops, farm_area: farm?.farm_area || 0, used_area: usedArea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/crops
const addCrop = async (req, res) => {
  try {
    const { crop_name, area_used, seed_used, variety } = req.body;
    if (!crop_name || !area_used) {
      return res.status(400).json({ success: false, message: 'Crop name and area are required' });
    }
    const farm = await Farm.findOne({ email: req.user.email });
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });

    const existingCrops = await Crop.find({ email: req.user.email });
    const usedArea = existingCrops.reduce((sum, c) => sum + c.area_used, 0);

    if (usedArea + Number(area_used) > farm.farm_area) {
      return res.status(400).json({
        success: false,
        message: `Insufficient farm area. Available: ${farm.farm_area - usedArea} acres, Requested: ${area_used} acres`,
      });
    }

    const crop = await Crop.create({ email: req.user.email, crop_name, area_used: Number(area_used), seed_used, variety });
    res.status(201).json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/crops/:id
const updateCrop = async (req, res) => {
  try {
    const { crop_name, area_used, seed_used, variety } = req.body;
    const crop = await Crop.findOne({ _id: req.params.id, email: req.user.email });
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

    if (area_used) {
      const farm = await Farm.findOne({ email: req.user.email });
      const allCrops = await Crop.find({ email: req.user.email, _id: { $ne: crop._id } });
      const usedArea = allCrops.reduce((sum, c) => sum + c.area_used, 0);
      if (usedArea + Number(area_used) > farm.farm_area) {
        return res.status(400).json({
          success: false,
          message: `Insufficient farm area. Available: ${farm.farm_area - usedArea} acres`,
        });
      }
    }

    const updated = await Crop.findByIdAndUpdate(
      req.params.id,
      { crop_name, area_used: area_used ? Number(area_used) : crop.area_used, seed_used, variety },
      { new: true }
    );
    res.json({ success: true, crop: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/crops/:id
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, email: req.user.email });
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/crops/summary — aggregate across all farmers
const getCropSummary = async (req, res) => {
  try {
    const summary = await Crop.aggregate([
      { $group: { _id: '$crop_name', total_area: { $sum: '$area_used' }, farmers_count: { $sum: 1 } } },
      { $sort: { total_area: -1 } },
      { $project: { crop_name: '$_id', total_area: 1, farmers_count: 1, _id: 0 } },
    ]);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyCrops, addCrop, updateCrop, deleteCrop, getCropSummary };
