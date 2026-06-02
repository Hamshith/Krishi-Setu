import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Save, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, login } = useAuth(); // we can use login to update context user data silently
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const updatePayload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        address: formData.address,
      };
      
      // Only send password if user is trying to change it
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const res = await api.put('/users/profile', updatePayload);
      
      // Update local storage user data and clear password fields
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
      // Refresh window to re-hydrate context or trigger a smaller state update if your context supports it
      toast.success('Profile updated successfully');
      setTimeout(() => window.location.reload(), 1000); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Account Settings</h1>
        <p className="text-dark-500">Update your personal details and password.</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex items-center gap-3 border-b border-earth-100 pb-4 mb-6">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
              <UserIcon size={24} />
            </div>
            <h2 className="text-lg font-bold text-dark-900">Personal Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">First Name</label>
              <input 
                type="text" 
                name="firstname" 
                value={formData.firstname} 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Last Name</label>
              <input 
                type="text" 
                name="lastname" 
                value={formData.lastname} 
                onChange={handleChange} 
                className="input-field" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1 flex items-center gap-1">
              <MapPin size={16} className="text-earth-500" /> Complete Address
            </label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="input-field min-h-[80px]" 
              placeholder="e.g. 123 Farming Lane, Agricultural District..."
            />
          </div>

          <div className="flex items-center gap-3 border-b border-earth-100 pb-4 mt-8 mb-6">
            <div className="p-3 bg-earth-100 text-earth-600 rounded-xl">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark-900">Security</h2>
              <p className="text-xs text-dark-500">Leave blank if you don't want to change your password</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">New Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="********"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="********"
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-earth-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
