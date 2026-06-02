import React, { useState, useEffect } from 'react';
import { Store, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const SellProduce = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', item: '', price: '', min_purchase_quantity: '1', description: '', unit: 'kg', stock: '' });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/cropmarket');
      // For seller view, only show their own listings
      const userRes = await api.get('/auth/me');
      const myEmail = userRes.data.user.email;
      const myListings = res.data.listings.filter(l => l.farmer_email === myEmail);
      setListings(myListings);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (listing = null) => {
    if (listing) {
      setFormData({ 
        id: listing._id, item: listing.item, price: listing.price, 
        min_purchase_quantity: listing.min_purchase_quantity, description: listing.description, 
        unit: listing.unit, stock: listing.stock 
      });
    } else {
      setFormData({ id: '', item: '', price: '', min_purchase_quantity: '1', description: '', unit: 'kg', stock: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/cropmarket/${formData.id}`, formData);
        toast.success('Listing updated successfully');
      } else {
        await api.post('/cropmarket', formData);
        toast.success('Wait for buyer to order!');
      }
      setShowModal(false);
      fetchListings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      try {
        await api.delete(`/cropmarket/${id}`);
        toast.success('Listing removed');
        fetchListings();
      } catch (error) {
        toast.error('Failed to remove listing');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Crop Market (Sell Produce)</h1>
          <p className="text-dark-500">List your harvested produce for retail users to buy</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add to Market
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earth-100/50 border-b border-earth-200 text-sm text-dark-600 uppercase tracking-wider">
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Price/Unit</th>
                <th className="p-4 font-semibold">Min Qty</th>
                <th className="p-4 font-semibold text-right">Stock</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {listings.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-dark-500">You haven't listed any produce yet.</td></tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4 font-medium text-dark-900">{listing.item}</td>
                    <td className="p-4 text-sm text-dark-600 max-w-xs truncate">{listing.description}</td>
                    <td className="p-4 font-medium text-primary-700">₹{listing.price} / {listing.unit}</td>
                    <td className="p-4 text-dark-600">{listing.min_purchase_quantity} {listing.unit}</td>
                    <td className="p-4 text-right font-medium">{listing.stock} {listing.unit}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleOpenModal(listing)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(listing._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-900/50 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Store className="text-primary-600" />
              <h2 className="text-xl font-bold">{formData.id ? 'Edit Listing' : 'Create Market Listing'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Produce Name *</label>
                <input type="text" name="item" value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} required className="input-field" placeholder="e.g. Organic Tomatoes" />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field min-h-[80px]" placeholder="Briefly describe the quality, variety, etc." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="input-field" placeholder="0" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Unit *</label>
                  <select name="unit" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="input-field">
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="dozen">dozen</option>
                    <option value="bunch">bunch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Total Stock Available *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required className="input-field" placeholder="0" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Min. Purchase Qty</label>
                  <input type="number" name="min_purchase_quantity" value={formData.min_purchase_quantity} onChange={(e) => setFormData({...formData, min_purchase_quantity: e.target.value})} className="input-field" placeholder="1" min="1" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-earth-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellProduce;
