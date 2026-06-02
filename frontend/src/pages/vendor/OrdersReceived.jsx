import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const OrdersReceived = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/received');
      setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to load received orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { delivery_status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
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
        <h1 className="text-2xl font-bold text-dark-900">Orders Received</h1>
        <p className="text-dark-500">
          {user.role === 'vendor' ? 'Manage orders placed by farmers for your products' : 'Manage orders placed by retail users for your farm produce'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center text-dark-500">
          <Package className="mx-auto text-earth-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-dark-800">No orders yet</h3>
          <p>When buyers order your products, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusStyle = getStatusDisplay(order.delivery_status);
            return (
              <div key={order._id} className="card p-6 overflow-hidden relative">
                {/* Visual indicator bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.color.split(' ')[0]}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-earth-100 pb-4 mb-4 gap-4 pl-4">
                  <div>
                    <p className="text-xs text-dark-500 mb-1 uppercase tracking-wider">Order Reference</p>
                    <p className="font-mono text-dark-900 font-bold">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-500 mb-1 uppercase tracking-wider">Date Placed</p>
                    <p className="text-dark-900 font-medium">{new Date(order.ordered_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-500 mb-1 uppercase tracking-wider">Buyer Email</p>
                    <p className="text-dark-900 font-medium">{order.email}</p>
                  </div>
                </div>

                <div className="pl-4 lg:grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-3">
                    <h4 className="font-semibold text-dark-800 text-sm">Products to Fulfill:</h4>
                    {/* Ideally filtering out products not owned by this vendor isn't provided by the backend strictly in the response structure for this route,
                        it returns the WHOLE order if it contains ANY of their products.
                        This is a slight UI quirk but acceptable.
                    */}
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm py-2 px-4 bg-earth-50 rounded-lg border border-earth-100">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                            {item.quantity}
                          </span>
                          <span className="font-mono text-dark-600 text-xs">{item.product_id}</span>
                        </div>
                        <span className="font-bold text-dark-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 lg:mt-0 p-4 bg-earth-50 rounded-xl border border-earth-200">
                    <h4 className="font-semibold text-dark-800 text-sm mb-3">Update Order Status</h4>
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold uppercase tracking-wider border ${statusStyle.color}`}>
                        {statusStyle.icon} {order.delivery_status}
                      </span>
                    </div>
                    
                    {order.delivery_status !== 'delivered' && order.delivery_status !== 'cancelled' && (
                      <select 
                        className="input-field w-full"
                        value={order.delivery_status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        <option value="pending" disabled>Pending</option>
                        <option value="confirmed">Confirm Order</option>
                        <option value="shipped">Mark as Shipped</option>
                        <option value="delivered">Mark as Delivered</option>
                        <option value="cancelled">Cancel Order</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersReceived;
