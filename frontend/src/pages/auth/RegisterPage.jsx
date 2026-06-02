import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, Leaf, Store, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'farmer',
    address: '',
    farm_area: '',
    shop_name: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare payload, cleaning up unused role fields just in case
    const payload = { ...formData };
    if (payload.role !== 'farmer') delete payload.farm_area;
    if (payload.role !== 'vendor') delete payload.shop_name;

    try {
      const res = await api.post('/auth/register', payload);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        toast.success('Registration successful!');
        navigate(`/${res.data.user.role}/dashboard`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-800 transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>
        <div className="flex items-center gap-2">
          <div className="bg-primary-100 p-1.5 rounded-lg text-primary-600">
            <Sprout size={20} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">KrishiSetu</span>
        </div>
      </div>

      <div className="w-full max-w-3xl card p-8 md:p-10 animate-slide-up">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">Create an Account</h1>
          <p className="text-dark-600">Join the agricultural ecosystem today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-dark-700">Choose your role</label>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'farmer', title: 'Farmer', icon: <Leaf size={24}/>, desc: 'Grow & Sell' },
                { id: 'vendor', title: 'Vendor', icon: <Store size={24}/>, desc: 'Sell Agri-Inputs' },
                { id: 'user', title: 'Retail User', icon: <User size={24}/>, desc: 'Buy Produce' },
              ].map((r) => (
                <div 
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                    formData.role === r.id 
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' 
                      : 'border-earth-200 bg-white hover:border-earth-300 text-dark-600'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 ${formData.role === r.id ? 'bg-primary-100' : 'bg-earth-100'}`}>
                    {r.icon}
                  </div>
                  <h3 className="font-semibold text-dark-900">{r.title}</h3>
                  <p className="text-xs opacity-80">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">First Name</label>
              <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required className="input-field" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Last Name</label>
              <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required className="input-field" placeholder="Doe" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-700 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field" placeholder="Create a strong password" minLength="6" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-700 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="input-field" placeholder="Your full address/location" />
            </div>

            {/* Conditional Fields based on Role */}
            {formData.role === 'farmer' && (
              <div className="md:col-span-2 animate-fade-in">
                <label className="block text-sm font-medium text-dark-700 mb-1">Farm Area (in acres)</label>
                <div className="relative">
                  <input type="number" step="0.1" name="farm_area" value={formData.farm_area} onChange={handleChange} required className="input-field pr-16" placeholder="e.g. 5.5" />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-earth-500 font-medium text-sm">acres</span>
                  </div>
                </div>
                <p className="text-xs text-dark-500 mt-1">This will be used to validate your crop capacities.</p>
              </div>
            )}

            {formData.role === 'vendor' && (
              <div className="md:col-span-2 animate-fade-in">
                <label className="block text-sm font-medium text-dark-700 mb-1">Shop/Business Name</label>
                <input type="text" name="shop_name" value={formData.shop_name} onChange={handleChange} required className="input-field" placeholder="Your registered shop name" />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 flex justify-center items-center gap-2 text-lg shadow-glow-green"
          >
            {loading ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-dark-600 border-t border-earth-100 pt-6">
          Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Log in instead</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
