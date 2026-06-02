import React, { useEffect, useState } from 'react';
import { ShoppingCart, Package, Store } from 'lucide-react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [data, setData] = useState({
    cartItemsCount: 0,
    ordersCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [cartRes, ordersRes] = await Promise.all([
          api.get('/cart'),
          api.get('/orders/my')
        ]);

        setData({
          cartItemsCount: cartRes.data.cart?.products?.length || 0,
          ordersCount: ordersRes.data.orders?.length || 0
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
    { title: 'Items in Cart', value: data.cartItemsCount, icon: <ShoppingCart className="text-primary-600" />, link: '/user/cart' },
    { title: 'Orders Placed', value: data.ordersCount, icon: <Package className="text-earth-600" />, link: '/user/orders' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Welcome to KrishiSetu</h1>
        <p className="text-dark-500">Buy fresh produce directly from farmers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link} className="card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer shadow-glow-earth">
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

      <div className="mt-8 max-w-2xl">
        <div className="card p-8 bg-hero-gradient text-white border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Store size={140} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Explore the Crop Market</h2>
            <p className="text-earth-200 mb-6 max-w-md">Browse fresh, high-quality agricultural produce listed directly by the farmers who grew it.</p>
            <Link to="/user/market" className="btn-primary bg-white text-primary-700 hover:bg-earth-100 inline-block">
              Go to Market
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
