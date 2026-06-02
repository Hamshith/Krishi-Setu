import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending': return { icon: <Clock size={16} />, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'confirmed': return { icon: <Package size={16} />, color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'shipped': return { icon: <Truck size={16} />, color: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'delivered': return { icon: <CheckCircle size={16} />, color: 'bg-green-100 text-green-700 border-green-200' };
      case 'cancelled': return { icon: <XCircle size={16} />, color: 'bg-red-100 text-red-700 border-red-200' };
      default: return { icon: <Clock size={16} />, color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Order History</h1>
        <p className="text-dark-500">Track the status of your purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center text-dark-500">
          <Package className="mx-auto text-earth-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-dark-800">No orders yet</h3>
          <p>You haven't placed any orders. Check out the Agri-Inputs section!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusStyle = getStatusDisplay(order.delivery_status);
            return (
              <div key={order._id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-earth-100 pb-4 mb-4 gap-4">
                  <div>
                    <p className="text-sm text-dark-500 mb-1">Order ID</p>
                    <p className="font-mono text-dark-900 font-medium">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 mb-1">Date</p>
                    <p className="text-dark-900 font-medium">{new Date(order.ordered_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 mb-1">Total</p>
                    <p className="text-dark-900 font-bold">₹{order.total_cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusStyle.color}`}>
                      {statusStyle.icon} {order.delivery_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-dark-800 text-sm">Items Ordered:</h4>
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-2 px-4 bg-earth-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-earth-200 flex items-center justify-center text-xs font-bold text-dark-700">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-dark-800">{item.product_id}</span> {/* Ideal scenario: Backend returns populated names, here falling back to ID */}
                        <span className="text-xs text-dark-500 bg-white px-2 py-0.5 rounded border border-earth-200 uppercase">
                          {item.product_type}
                        </span>
                      </div>
                      <span className="font-semibold text-dark-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
