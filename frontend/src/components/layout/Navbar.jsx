import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, AlertTriangle, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [alerts, setAlerts] = useState([]);
  
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  
  useEffect(() => {
    if (user?.role === 'farmer') {
      const fetchTopAlerts = async () => {
        try {
          const res = await api.get('/alerts');
          setAlerts(res.data.alerts || []);
        } catch (error) {
          console.error("Failed to fetch alerts", error);
        }
      };
      fetchTopAlerts();
    }
  }, [user]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const roleLabels = {
    farmer: 'Farmer',
    vendor: 'Vendor',
    user: 'Retail User'
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm lg:px-8 border-b border-earth-100">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="rounded-lg p-2 text-dark-500 hover:bg-earth-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-medium text-dark-800 hidden sm:block">
            Dashboard
          </span>
          <span className="text-xs text-dark-500 hidden sm:block capitalize">
            {roleLabels[user.role]} View
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user.role === 'farmer' && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowProfileDropdown(false);
              }}
              className="relative rounded-full p-2 text-dark-500 hover:bg-earth-100 transition-colors"
            >
              <Bell size={20} />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
              )}
            </button>

            {/* Alerts Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-card border border-earth-100 overflow-hidden z-50 animate-slide-up">
                <div className="p-3 border-b border-earth-100 flex justify-between items-center bg-earth-50">
                  <h3 className="font-bold text-dark-900 text-sm">Recent Alerts</h3>
                  {alerts.length > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {alerts.length} New
                    </span>
                  )}
                </div>
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {alerts.length === 0 ? (
                    <div className="p-4 text-center text-sm text-dark-500">
                      No recent alerts.
                    </div>
                  ) : (
                    <div className="divide-y divide-earth-100">
                      {alerts.slice(0, 3).map(alert => (
                        <div key={alert._id} className="p-3 hover:bg-earth-50 transition-colors">
                          <div className="flex items-start gap-2">
                            <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-dark-900 line-clamp-2 leading-snug">
                                {alert.description}
                              </p>
                              <p className="text-xs text-dark-500 mt-1">
                                {new Date(alert.date).toLocaleDateString()} • {alert.location || 'General'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Link 
                  to="/farmer/alerts" 
                  onClick={() => setShowDropdown(false)}
                  className="block w-full text-center p-2.5 text-sm font-semibold text-primary-600 bg-earth-50 hover:bg-primary-50 transition-colors border-t border-earth-100"
                >
                  View All Alerts
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Profile Section */}
        <div className="relative pl-4 border-l border-earth-200" ref={profileRef}>
          <button 
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowDropdown(false);
            }} 
            className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium text-dark-900">{user.firstname} {user.lastname}</span>
              <span className="text-xs text-dark-500 capitalize">{user.role}</span>
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold border border-primary-200 shadow-sm">
              {user.firstname.charAt(0).toUpperCase()}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-card border border-earth-100 overflow-hidden z-50 animate-slide-up">
              <div className="p-4 border-b border-earth-100 bg-earth-50">
                <p className="text-sm font-bold text-dark-900 line-clamp-1">{user.firstname} {user.lastname}</p>
                <p className="text-xs text-dark-500 mt-0.5 line-clamp-1">{user.email}</p>
              </div>
              
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-dark-400 uppercase tracking-wider">
                  Account
                </div>

                <Link to={`/${user.role}/profile`} className="flex items-center gap-3 px-3 py-2 text-sm text-dark-700 hover:bg-earth-100 rounded-lg transition-colors" onClick={() => setShowProfileDropdown(false)}>
                  <UserIcon size={16} /> Personal Settings
                </Link>
                
                {user.role === 'farmer' && (
                  <Link to="/farmer/farm" className="flex items-center gap-3 px-3 py-2 text-sm text-dark-700 hover:bg-earth-100 rounded-lg transition-colors" onClick={() => setShowProfileDropdown(false)}>
                    <UserIcon size={16} /> My Farm Profile
                  </Link>
                )}
                {user.role === 'vendor' && (
                  <Link to="/vendor/shop" className="flex items-center gap-3 px-3 py-2 text-sm text-dark-700 hover:bg-earth-100 rounded-lg transition-colors" onClick={() => setShowProfileDropdown(false)}>
                    <UserIcon size={16} /> My Shop Profile
                  </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 mt-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
