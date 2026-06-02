// Single role guards
const isFarmer = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Farmers only' });
};

const isVendor = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Vendors only' });
};

const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Retail users only' });
};

// Combined guards
const isNotVendor = (req, res, next) => {
  if (req.user && (req.user.role === 'farmer' || req.user.role === 'user')) return next();
  return res.status(403).json({ success: false, message: 'Access denied: Not available for vendors' });
};

const isFarmerOrVendor = (req, res, next) => {
  if (req.user && (req.user.role === 'farmer' || req.user.role === 'vendor')) return next();
  return res.status(403).json({ success: false, message: 'Access denied: Farmers and Vendors only' });
};

const isFarmerOrUser = (req, res, next) => {
  if (req.user && (req.user.role === 'farmer' || req.user.role === 'user')) return next();
  return res.status(403).json({ success: false, message: 'Access denied' });
};

module.exports = { isFarmer, isVendor, isUser, isNotVendor, isFarmerOrVendor, isFarmerOrUser };
