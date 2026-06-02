import React, { useEffect, useState } from 'react';
import { Map, Tractor, AlertTriangle, ClipboardList, DollarSign } from 'lucide-react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const [data, setData] = useState({
    farmArea: 0,
    cropsCount: 0,
    alertsCount: 0,
    pendingOrdersCount: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [farmRes, cropsRes, alertsRes, ordersRes, earningsRes] = await Promise.all([
          api.get('/farm'),
          api.get('/crops/my'),
          api.get('/alerts'),
          api.get('/orders/my'),
          api.get('/earnings')
        ]);

        setData({
          farmArea: farmRes.data.farm?.farm_area || 0,
          cropsCount: cropsRes.data.crops?.length || 0,
          alertsCount: alertsRes.data.alerts?.length || 0,
          pendingOrdersCount: ordersRes.data.orders?.filter(o => o.delivery_status === 'pending').length || 0,
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
    { title: 'Total Farm Area', value: `${data.farmArea} acres`, icon: <Map className="text-primary-600" />, link: '/farmer/farm' },
    { title: 'Crops Sown', value: data.cropsCount, icon: <Tractor className="text-earth-600" />, link: '/farmer/crops' },
    { title: 'Active Alerts', value: data.alertsCount, icon: <AlertTriangle className="text-red-500" />, link: '/farmer/alerts' },
    { title: 'Pending Orders', value: data.pendingOrdersCount, icon: <ClipboardList className="text-blue-500" />, link: '/farmer/orders' },
    { title: 'Total Earnings', value: `₹${data.earnings}`, icon: <DollarSign className="text-green-600" />, link: '/farmer/earnings' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Dashboard Overview</h1>
        <p className="text-dark-500">Welcome back! Here's a quick summary of your farming operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link} className="card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-earth-100 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-dark-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 border-t-4 border-t-primary-500">
          <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link to="/farmer/crops" className="btn-outline text-center py-3">Add New Crop</Link>
            <Link to="/farmer/market" className="btn-outline text-center py-3 text-earth-700 border-earth-300 hover:bg-earth-100">Sell Produce</Link>
            <Link to="/farmer/buy" className="btn-primary text-center py-3 col-span-2 shadow-glow-green">Buy Agri-Inputs</Link>
          </div>
        </div>

        <div className="card p-6 text-center flex flex-col items-center justify-center bg-earth-50">
          <Tractor size={48} className="text-earth-400 mb-4" />
          <h3 className="text-lg font-semibold text-dark-800">KrishiSetu Ecosystem</h3>
          <p className="text-sm text-dark-600 max-w-sm mt-2">
            You are connected to a network of reliable vendors and direct buyers. Utilize the sidebar to navigate through the marketplace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
