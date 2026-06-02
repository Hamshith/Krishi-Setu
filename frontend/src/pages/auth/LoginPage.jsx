import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, ArrowLeft, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.firstname}!`);
        
        // If they came directly to login, route based on role
        if (from === '/') {
          navigate(`/${res.data.user.role}/dashboard`, { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-earth-50">
      {/* Left panel - Image/Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-earth-200 transition-colors mb-12">
            <ArrowLeft size={20} /> Back to home
          </Link>
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary-500 p-2 rounded-lg text-white">
              <Sprout size={32} />
            </div>
            <span className="text-4xl font-display font-bold tracking-tight">KrishiSetu</span>
          </div>
          <h1 className="text-4xl font-display font-bold leading-tight max-w-md">
            Welcome back to the Agriculture Ecosystem.
          </h1>
        </div>
        
        <div className="relative z-10 pb-8">
          <p className="text-earth-200">Trusted by thousands of farmers & vendors.</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative animate-fade-in">
        <Link to="/" className="lg:hidden absolute top-6 left-6 text-dark-500 flex items-center gap-2">
          <ArrowLeft size={16} /> Home
        </Link>
        
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-dark-900 mb-2">Log In</h2>
            <p className="text-dark-600">Enter your credentials to access your account</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-dark-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-dark-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 flex justify-center items-center gap-2 disabled:bg-primary-400"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-dark-600">
              Don't have an account? <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
