import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CropMarketPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchListings();
  }, [searchTerm]);

  const fetchListings = async () => {
    try {
      let url = '/cropmarket';
      if (searchTerm) url += `?search=${searchTerm}`;
      const res = await api.get(url);
      setListings(res.data.listings);
    } catch (error) {
      toast.error('Failed to load crop market');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (listing) => {
    setAddingToCart(listing._id);
    try {
      await api.post('/cart/add', {
        product_id: listing._id,
        product_type: 'crop_market',
        quantity: listing.min_purchase_quantity || 1
      });
      toast.success(`${listing.item} added to cart`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Crop Market</h1>
        <p className="text-dark-500">Buy fresh farm produce directly from the farmers</p>
      </div>

      <div className="card p-4 flex gap-4 max-w-xl">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-earth-400" />
          </div>
          <input 
            type="text" 
            className="input-field pl-10" 
            placeholder="Search produce (e.g., Tomatoes, Rice)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading market...</div>
      ) : listings.length === 0 ? (
        <div className="card p-12 text-center text-dark-500">
          <Store size={48} className="mx-auto text-earth-300 mb-4" />
          <h3 className="text-lg font-semibold text-dark-700">No produce found</h3>
          <p>No farmers have listed produce matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="card group flex flex-col hover:shadow-card transition-shadow border-t-4 border-t-primary-500">
              <div className="p-5 flex-1 flex flex-col">
                <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold w-fit mb-3 uppercase tracking-wider">
                  Farm Fresh
                </div>
                
                <h3 className="font-bold text-dark-900 text-xl mb-1">{listing.item}</h3>
                <p className="text-dark-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{listing.description || 'No description provided.'}</p>
                
                <div className="bg-earth-50 rounded-xl p-4 mb-4 mt-auto border border-earth-100">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-dark-600">Price</span>
                    <span className="font-display font-bold text-xl text-primary-700">
                      ₹{listing.price} <span className="text-sm font-normal text-dark-500">/ {listing.unit}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-dark-600">
                    <span>Min. Order: <span className="font-semibold">{listing.min_purchase_quantity} {listing.unit}</span></span>
                    <span>Stock: <span className="font-semibold">{listing.stock} {listing.unit}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-dark-400 mb-4">
                  <Store size={14}/> Listed by farmer: <span className="font-medium text-dark-600 truncate">{listing.farmer_email}</span>
                </div>

                <button 
                  onClick={() => handleAddToCart(listing)}
                  disabled={listing.farmer_email === user.email || listing.stock < listing.min_purchase_quantity || addingToCart === listing._id}
                  className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                    listing.farmer_email === user.email 
                      ? 'bg-earth-100 text-earth-800 cursor-not-allowed opacity-70'
                      : listing.stock < listing.min_purchase_quantity 
                        ? 'bg-earth-100 text-earth-400 cursor-not-allowed' 
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {addingToCart === listing._id ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : listing.farmer_email === user.email ? (
                    'Your Produce'
                  ) : listing.stock < listing.min_purchase_quantity ? (
                    'Insufficient Stock'
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropMarketPage;
