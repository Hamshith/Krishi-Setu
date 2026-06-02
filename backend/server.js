require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const farmRoutes = require('./routes/farmRoutes');
const shopRoutes = require('./routes/shopRoutes');
const cropRoutes = require('./routes/cropRoutes');
const productRoutes = require('./routes/productRoutes');
const cropMarketRoutes = require('./routes/cropMarketRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const alertRoutes = require('./routes/alertRoutes');
const earningsRoutes = require('./routes/earningsRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cropmarket', cropMarketRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/earnings', earningsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'KrishiSetu API is running 🌾' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 KrishiSetu server running on port ${PORT}`);
});
