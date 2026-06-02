import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyFarm from './pages/farmer/MyFarm';
import MyCrops from './pages/farmer/MyCrops';
import SellProduce from './pages/farmer/SellProduce';
import BuyProducts from './pages/farmer/BuyProducts';
import FarmerCart from './pages/farmer/FarmerCart';
import FarmerOrders from './pages/farmer/FarmerOrders';
import Alerts from './pages/farmer/Alerts';
import FarmerEarnings from './pages/farmer/FarmerEarnings';
import CropSummary from './pages/farmer/CropSummary';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import MyShop from './pages/vendor/MyShop';
import MyProducts from './pages/vendor/MyProducts';
import OrdersReceived from './pages/vendor/OrdersReceived';
import VendorEarnings from './pages/vendor/VendorEarnings';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import CropMarketPage from './pages/user/CropMarketPage';
import UserCart from './pages/user/UserCart';
import UserOrders from './pages/user/UserOrders';

// Shared
import ProfilePage from './pages/shared/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            
            {/* Farmer Routes */}
            <Route element={<RoleRoute allowedRoles={['farmer']} />}>
              <Route path="/farmer/*" element={
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<FarmerDashboard />} />
                    <Route path="farm" element={<MyFarm />} />
                    <Route path="crops" element={<MyCrops />} />
                    <Route path="buy" element={<BuyProducts />} />
                    <Route path="cart" element={<FarmerCart />} />
                    <Route path="orders" element={<FarmerOrders />} />
                    <Route path="received-orders" element={<OrdersReceived />} />
                    <Route path="market" element={<SellProduce />} />
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="earnings" element={<FarmerEarnings />} />
                    <Route path="crop-summary" element={<CropSummary />} />
                    <Route path="crop-market" element={<CropMarketPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              } />
            </Route>

            {/* Vendor Routes */}
            <Route element={<RoleRoute allowedRoles={['vendor']} />}>
              <Route path="/vendor/*" element={
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<VendorDashboard />} />
                    <Route path="crop-market" element={<CropMarketPage />} />
                    <Route path="shop" element={<MyShop />} />
                    <Route path="products" element={<MyProducts />} />
                    <Route path="cart" element={<FarmerCart />} />
                    <Route path="orders" element={<FarmerOrders />} />
                    <Route path="received-orders" element={<OrdersReceived />} />
                    <Route path="earnings" element={<VendorEarnings />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              } />
            </Route>

            {/* User Routes */}
            <Route element={<RoleRoute allowedRoles={['user']} />}>
              <Route path="/user/*" element={
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="market" element={<CropMarketPage />} />
                    <Route path="cart" element={<UserCart />} />
                    <Route path="orders" element={<UserOrders />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              } />
            </Route>

          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
