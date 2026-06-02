import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Tractor } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyCrops = () => {
  const [crops, setCrops] = useState([]);
  const [farmData, setFarmData] = useState({ farm_area: 0, used_area: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ id: '', crop_name: '', area_used: '', seed_used: '', variety: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/crops/my');
      setCrops(res.data.crops);
      setFarmData({ farm_area: res.data.farm_area, used_area: res.data.used_area });
    } catch (error) {
      toast.error('Failed to load crop data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (crop = null) => {
    if (crop) {
      setFormData({ id: crop._id, crop_name: crop.crop_name, area_used: crop.area_used, seed_used: crop.seed_used, variety: crop.variety });
    } else {
      setFormData({ id: '', crop_name: '', area_used: '', seed_used: '', variety: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/crops/${formData.id}`, formData);
        toast.success('Crop updated successfully');
      } else {
        await api.post('/crops', formData);
        toast.success('Crop added successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await api.delete(`/crops/${id}`);
        toast.success('Crop deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete crop');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  const remainingArea = farmData.farm_area - farmData.used_area;
  const usagePercentage = farmData.farm_area > 0 ? (farmData.used_area / farmData.farm_area) * 100 : 0;

  // Chart Data
  const chartData = {
    labels: crops.map(c => c.crop_name),
    datasets: [
      {
        label: 'Area Used (acres)',
        data: crops.map(c => c.area_used),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(22, 163, 74, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Acres' } }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">My Crops</h1>
          <p className="text-dark-500">Manage what you are currently growing</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add New Crop
        </button>
      </div>

      {/* Land Usage Progress */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Tractor className="text-primary-600" size={20}/> Land Usage Status
        </h3>
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-dark-700">Used: {farmData.used_area} / {farmData.farm_area} acres</span>
          <span className={`${remainingArea <= 0 ? 'text-red-500' : 'text-primary-600'}`}>
            {remainingArea.toFixed(2)} acres remaining
          </span>
        </div>
        <div className="h-4 bg-earth-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 75 ? 'bg-earth-500' : 'bg-primary-500'}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Crops Table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-earth-100/50 border-b border-earth-200 text-sm text-dark-600 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Crop Name</th>
                  <th className="p-4 font-semibold">Variety</th>
                  <th className="p-4 font-semibold">Seed Type</th>
                  <th className="p-4 font-semibold text-right">Area (Acres)</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {crops.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-dark-500">No crops added yet. Start by adding a crop!</td></tr>
                ) : (
                  crops.map((crop) => (
                    <tr key={crop._id} className="hover:bg-earth-50 transition-colors">
                      <td className="p-4 font-medium text-dark-900">{crop.crop_name}</td>
                      <td className="p-4 text-dark-600">{crop.variety || '-'}</td>
                      <td className="p-4 text-dark-600">{crop.seed_used || '-'}</td>
                      <td className="p-4 text-right font-medium">{crop.area_used}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenModal(crop)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(crop._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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

        {/* Chart */}
        <div className="card p-4 min-h-[300px]">
          <h3 className="font-semibold mb-4 text-center">Crop Distribution</h3>
          {crops.length > 0 ? (
            <div className="h-64 relative">
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-earth-400">No data to chart</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-900/50 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Crop' : 'Add New Crop'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Crop Name *</label>
                <input type="text" name="crop_name" value={formData.crop_name} onChange={(e) => setFormData({...formData, crop_name: e.target.value})} required className="input-field" placeholder="e.g. Wheat" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Area Used (Acres) *</label>
                <input type="number" step="0.1" name="area_used" value={formData.area_used} onChange={(e) => setFormData({...formData, area_used: e.target.value})} required className="input-field" placeholder="0.0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Seed Type/Brand</label>
                  <input type="text" name="seed_used" value={formData.seed_used} onChange={(e) => setFormData({...formData, seed_used: e.target.value})} className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Variety</label>
                  <input type="text" name="variety" value={formData.variety} onChange={(e) => setFormData({...formData, variety: e.target.value})} className="input-field" placeholder="Optional" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-earth-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Crop</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCrops;
