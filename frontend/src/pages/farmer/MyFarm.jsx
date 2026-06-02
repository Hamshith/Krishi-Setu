import React, { useState, useEffect } from 'react';
import { Map, Edit2, Save, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const MyFarm = () => {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editArea, setEditArea] = useState('');

  useEffect(() => {
    fetchFarm();
  }, []);

  const fetchFarm = async () => {
    try {
      const res = await api.get('/farm');
      setFarm(res.data.farm);
      setEditArea(res.data.farm.farm_area);
    } catch (error) {
      toast.error('Failed to load farm details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (Number(editArea) <= 0) {
        return toast.error('Farm area must be greater than 0');
      }
      const res = await api.put('/farm', { farm_area: Number(editArea) });
      setFarm(res.data.farm);
      setIsEditing(false);
      toast.success('Farm area updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update farm area');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">My Farm Profile</h1>
        <p className="text-dark-500">Manage your land details</p>
      </div>

      <div className="card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full -mr-10 -mt-10 opacity-50 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8 border-b border-earth-100 pb-6">
            <div className="bg-primary-50 p-4 rounded-xl text-primary-600">
              <Map size={40} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark-900">Registered Land</h2>
              <p className="text-dark-500">Used for validating your crop production limits</p>
            </div>
          </div>

          {isEditing ? (
            <div className="bg-earth-50 p-6 rounded-xl border border-earth-200">
              <label className="block text-sm font-medium text-dark-700 mb-2">Update Total Farm Area</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    step="0.1" 
                    className="input-field pr-16" 
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-earth-500 font-medium">acres</span>
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-4">
                  <Save size={18} /> Save
                </button>
                <button onClick={() => {setIsEditing(false); setEditArea(farm.farm_area)}} className="btn-secondary px-3">
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-earth-50 p-6 rounded-xl border border-earth-200">
              <div>
                <p className="text-sm font-medium text-dark-500 uppercase tracking-wider mb-1">Total Available Area</p>
                <p className="text-4xl font-display font-bold text-primary-700">{farm?.farm_area} <span className="text-xl font-normal text-dark-600">acres</span></p>
              </div>
              <button onClick={() => setIsEditing(true)} className="btn-outline flex items-center gap-2">
                <Edit2 size={18} /> Edit Area
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-earth-100 text-sm text-dark-500 flex items-start gap-2">
            <AlertTriangle size={16} className="text-earth-400 flex-shrink-0 mt-0.5" />
            <p>Note: Decreasing your farm area might not be possible if you already have crops sown that exceed the new requested limit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFarm;
