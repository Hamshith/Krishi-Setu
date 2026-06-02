import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({ description: '', severity: 'low', location: '' });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.alerts);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alerts', formData);
      toast.success('Alert broadcasted successfully');
      setShowModal(false);
      setFormData({ description: '', severity: 'low', location: '' });
      fetchAlerts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post alert');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this alert?')) {
      try {
        await api.delete(`/alerts/${id}`);
        toast.success('Alert removed');
        fetchAlerts();
      } catch (error) {
        toast.error('Failed to remove alert');
      }
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-earth-50 border-earth-200 text-dark-800';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Community Alerts</h1>
          <p className="text-dark-500">View and post alerts regarding weather, pests, or other issues</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white">
          <AlertTriangle size={20} /> Broadcast Alert
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {alerts.length === 0 ? (
          <div className="col-span-full card p-12 text-center text-dark-500">
            <AlertTriangle className="mx-auto text-earth-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-dark-800">No active alerts</h3>
            <p>The community is currently quiet. Everything looks good!</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert._id} className={`rounded-xl border p-5 shadow-sm relative ${getSeverityStyle(alert.severity)}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/50 backdrop-blur-sm border shadow-sm">
                  {alert.severity}
                </span>
                {alert.email === user.email && (
                  <button onClick={() => handleDelete(alert._id)} className="text-dark-400 hover:text-red-600 transition-colors bg-white/50 rounded p-1">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <p className="font-medium text-lg leading-snug mb-4">{alert.description}</p>
              
              <div className="mt-auto space-y-2 text-xs font-medium opacity-80 border-t border-black/10 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} /> {alert.location || 'General/Widespread'}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} /> {new Date(alert.date).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-70">Posted by:</span> {alert.email}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-dark-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <AlertTriangle /> Broadcast New Alert
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  required 
                  className="input-field min-h-[100px]" 
                  placeholder="Describe the issue (e.g. Swarm of locusts heading south...)" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Severity *</label>
                <select 
                  name="severity" 
                  value={formData.severity} 
                  onChange={(e) => setFormData({...formData, severity: e.target.value})} 
                  className="input-field border-red-200 focus:ring-red-500"
                >
                  <option value="low">Low - General information</option>
                  <option value="medium">Medium - Be aware</option>
                  <option value="high">High - Take precautions</option>
                  <option value="critical">Critical - Immediate action required</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Location (Optional)</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                  className="input-field" 
                  placeholder="e.g. Northern District" 
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-earth-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Publish Alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
