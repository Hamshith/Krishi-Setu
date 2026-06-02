import React, { useEffect, useState } from 'react';
import { Package, ClipboardList, DollarSign, Store } from 'lucide-react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
  const [data, setData] = useState({
    productsCount: 0,
    ordersCount: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes, earningsRes] = await Promise.all([
          api.get('/products'), 
          api.get('/orders/received'),
          api.get('/earnings')
        ]);

        // Products route returns all, we should filter by our own if needed, but the backend doesn't have a /my/products route currently,
        // so we fetch all and let the table handle it, OR we fix it by getting email from me:
        const userRes = await api.get('/auth/me');
        const myProducts = productsRes.data.products.filter(p => p.vendor_email === userRes.data.user.email);

        setData({
          productsCount: myProducts.length,
          ordersCount: ordersRes.data.orders?.length || 0,
          earnings: earningsRes.data.earnings?.total_earnings || 0
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const statCards = [
    { title: 'My Products', value: data.productsCount, icon: <Package className="text-primary-600" />, link: '/vendor/products' },
    { title: 'Orders Received', value: data.ordersCount, icon: <ClipboardList className="text-blue-500" />, link: '/vendor/orders' },
    { title: 'Total Earnings', value: `₹${data.earnings}`, icon: <DollarSign className="text-green-600" />, link: '/vendor/earnings' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Vendor Dashboard</h1>
        <p className="text-dark-500">Welcome to your shop management center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link} className="card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-earth-100 rounded-xl">
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-dark-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-dark-900">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 border-t-4 border-t-earth-500">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Store/> Manage Your Business</h2>
          <div className="flex flex-col gap-3">
            <Link to="/vendor/products" className="btn-primary text-center py-3">Add New Product</Link>
            <Link to="/vendor/orders" className="btn-outline text-center py-3">Review Pending Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
