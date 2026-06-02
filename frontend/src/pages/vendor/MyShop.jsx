import React, { useState, useEffect } from 'react';
import { Store, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const MyShop = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const res = await api.get('/shop');
      setShop(res.data.shop);
      setEditName(res.data.shop.shop_name);
    } catch (error) {
      toast.error('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!editName.trim()) {
        return toast.error('Shop name cannot be empty');
      }
      const res = await api.put('/shop', { shop_name: editName });
      setShop(res.data.shop);
      setIsEditing(false);
      toast.success('Shop profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update shop');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">My Shop Profile</h1>
        <p className="text-dark-500">Manage your business identity</p>
      </div>

      <div className="card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-earth-100 rounded-bl-full -mr-10 -mt-10 opacity-50 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8 border-b border-earth-100 pb-6">
            <div className="bg-earth-100 p-4 rounded-xl text-earth-600">
              <Store size={40} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark-900">Business Details</h2>
              <p className="text-dark-500">Visible to farmers making purchases</p>
            </div>
          </div>

          {isEditing ? (
            <div className="bg-earth-50 p-6 rounded-xl border border-earth-200">
              <label className="block text-sm font-medium text-dark-700 mb-2">Update Shop Name</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  className="input-field flex-1" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-4">
                  <Save size={18} /> Save
                </button>
                <button onClick={() => {setIsEditing(false); setEditName(shop.shop_name)}} className="btn-secondary px-3">
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-earth-50 p-6 rounded-xl border border-earth-200">
              <div>
                <p className="text-sm font-medium text-dark-500 uppercase tracking-wider mb-1">Registered Store Name</p>
                <p className="text-3xl font-display font-bold text-dark-900">{shop?.shop_name}</p>
              </div>
              <button onClick={() => setIsEditing(true)} className="btn-outline flex items-center gap-2">
                <Edit2 size={18} /> Edit Name
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyShop;
