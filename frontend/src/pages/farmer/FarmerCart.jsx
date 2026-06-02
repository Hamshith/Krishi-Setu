import React, { useState, useEffect } from 'react';
import { Package, Trash2, Plus, Minus, CreditCard, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FarmerCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      const cartData = res.data.cart;
      setCart(cartData);

      // Fetch details for each product in cart to display name/image
      if (cartData && cartData.products.length > 0) {
        const details = {};
        for (const item of cartData.products) {
          try {
            const endpoint = item.product_type === 'vendor_product' ? `/products/${item.product_id}` : `/cropmarket/${item.product_id}`;
            const detailRes = await api.get(endpoint);
            details[item.product_id] = item.product_type === 'vendor_product' ? detailRes.data.product : detailRes.data.listing;
          } catch (e) {
            console.error('Failed to fetch detail for item', item.product_id);
          }
        }
        setProductDetails(details);
      }
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    try {
      const res = await api.put(`/cart/update/${itemId}`, { quantity: newQty });
      setCart(res.data.cart);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/remove/${itemId}`);
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await api.post('/orders/checkout');
      if (res.data.success) {
        toast.success('Order placed successfully!');
        setCart({ products: [], total_payable: 0 }); // Empty cart in UI
        navigate('/farmer/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const isCartEmpty = !cart || cart.products.length === 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Your Cart</h1>
        <p className="text-dark-500">Review your items and proceed to checkout</p>
      </div>

      {isCartEmpty ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-earth-100 p-6 rounded-full mb-6">
            <ShoppingCart size={48} className="text-earth-400" />
          </div>
          <h2 className="text-xl font-bold text-dark-800 mb-2">Your cart is empty</h2>
          <p className="text-dark-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          {user?.role === 'farmer' ? (
            <div className="flex gap-4">
              <button onClick={() => navigate('/farmer/buy')} className="btn-primary">
                Browse Agri-Inputs
              </button>
              <button onClick={() => navigate('/farmer/crop-market')} className="btn-secondary bg-white border border-primary-500 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-bold transition-colors">
                Browse Market Place
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate(user?.role === 'user' ? '/user/market' : '/vendor/crop-market')} 
              className="btn-primary"
            >
              Browse Market Place
            </button>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map((item) => {
              const details = productDetails[item.product_id] || {};
              const name = details.item || 'Loading...';
              
              return (
                <div key={item._id} className="card p-4 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="h-24 w-24 bg-earth-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {details.imageUrl ? (
                      <img src={details.imageUrl} alt={name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <Package size={32} className="text-earth-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left w-full">
                    <div className="text-xs font-semibold text-primary-600 mb-1 uppercase tracking-wider">
                      {item.product_type === 'vendor_product' ? 'Vendor Product' : 'Crop Market'}
                    </div>
                    <h3 className="text-lg font-bold text-dark-900 mb-1">{name}</h3>
                    <p className="text-dark-500 font-medium">₹{item.price_at_add} / unit</p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 bg-earth-50 rounded-lg p-1 border border-earth-200">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity, -1)}
                        className="p-1 text-dark-600 hover:bg-earth-200 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity, 1)}
                        className="p-1 text-dark-600 hover:bg-earth-200 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-bold text-dark-900">₹{(item.price_at_add * item.quantity).toFixed(2)}</p>
                  </div>

                  <button 
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors ml-auto sm:ml-0 self-start sm:self-center"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-bold text-dark-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 text-dark-600 font-medium">
              <div className="flex justify-between">
                <span>Subtotal ({cart.products.length} items)</span>
                <span>₹{cart.total_payable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-primary-600">Free</span>
              </div>
            </div>
            
            <div className="border-t border-earth-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-dark-900 font-bold text-lg">Total</span>
                <span className="font-display font-bold text-2xl text-dark-900">₹{cart.total_payable.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-glow-green text-lg"
            >
              {checkingOut ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CreditCard size={20} /> Checkout Securely
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerCart;
