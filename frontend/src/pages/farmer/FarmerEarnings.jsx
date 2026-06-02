import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const FarmerEarnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await api.get('/earnings');
      setEarningsData(res.data.earnings);
    } catch (error) {
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const total = earningsData?.total_earnings || 0;
  const transactions = earningsData?.transactions || [];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Earnings</h1>
        <p className="text-dark-500">Track your revenue from crop market sales</p>
      </div>

      <div className="card p-8 bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <DollarSign size={160} />
        </div>
        <div className="relative z-10">
          <p className="text-earth-200 font-medium mb-1">Total Lifetime Earnings</p>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-6xl font-display font-bold">₹{total.toLocaleString()}</span>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
            <TrendingUp size={20} className="text-primary-300" />
            <span className="font-medium text-sm text-primary-50">Earnings update automatically upon successful orders</span>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-earth-100 bg-earth-50/50">
          <h2 className="text-lg font-bold text-dark-900">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-earth-200 text-sm text-dark-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold text-right">Amount Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {transactions.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-dark-500">No transactions recorded yet.</td></tr>
              ) : (
                transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map((tx, idx) => (
                  <tr key={idx} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4 text-dark-700 flex items-center gap-2 whitespace-nowrap">
                      <Calendar size={16} className="text-earth-400" />
                      {new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-4 font-mono text-sm text-dark-600">{tx.order_id}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                        + ₹{tx.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerEarnings;
