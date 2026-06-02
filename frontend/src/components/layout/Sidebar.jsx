import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, LogOut, Home, Map, Tractor, ShoppingCart, 
  Store, AlertTriangle, DollarSign, Package, ClipboardList, PieChart
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'farmer':
        return [
          { name: 'Dashboard', path: '/farmer/dashboard', icon: <Home size={20} /> },
          { name: 'My Farm', path: '/farmer/farm', icon: <Map size={20} /> },
          { name: 'My Crops', path: '/farmer/crops', icon: <Tractor size={20} /> },
          { name: 'Crop Summary', path: '/farmer/crop-summary', icon: <PieChart size={20} /> },
          { name: 'Sell Produce', path: '/farmer/market', icon: <Store size={20} /> },
          { name: 'Crop Market', path: '/farmer/crop-market', icon: <Store size={20} /> },
          { name: 'Buy Products', path: '/farmer/buy', icon: <ShoppingCart size={20} /> },
          { name: 'My Cart', path: '/farmer/cart', icon: <Package size={20} /> },
          { name: 'My Orders', path: '/farmer/orders', icon: <ClipboardList size={20} /> },
          { name: 'Orders Received', path: '/farmer/received-orders', icon: <ClipboardList size={20} /> },
          { name: 'Alerts', path: '/farmer/alerts', icon: <AlertTriangle size={20} /> },
          { name: 'Earnings', path: '/farmer/earnings', icon: <DollarSign size={20} /> },
        ];
      case 'vendor':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard', icon: <Home size={20} /> },
          { name: 'Crop Market', path: '/vendor/crop-market', icon: <Store size={20} /> },
          { name: 'My Shop', path: '/vendor/shop', icon: <Store size={20} /> },
          { name: 'My Products', path: '/vendor/products', icon: <Package size={20} /> },
          { name: 'My Cart', path: '/vendor/cart', icon: <ShoppingCart size={20} /> },
          { name: 'My Orders', path: '/vendor/orders', icon: <ClipboardList size={20} /> },
          { name: 'Orders Received', path: '/vendor/received-orders', icon: <ClipboardList size={20} /> },
          { name: 'Earnings', path: '/vendor/earnings', icon: <DollarSign size={20} /> },
        ];
      case 'user':
        return [
          { name: 'Dashboard', path: '/user/dashboard', icon: <Home size={20} /> },
          { name: 'Crop Market', path: '/user/market', icon: <Store size={20} /> },
          { name: 'My Cart', path: '/user/cart', icon: <ShoppingCart size={20} /> },
          { name: 'My Orders', path: '/user/orders', icon: <ClipboardList size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 text-earth-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
    mobileOpen ? 'translate-x-0' : '-translate-x-full'
  } flex flex-col`;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-dark-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="h-16 flex items-center gap-2 px-6 bg-dark-900 border-b border-dark-800">
          <div className="bg-primary-500 p-1.5 rounded-lg text-white">
            <Sprout size={24} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-white">KrishiSetu</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20 font-medium' 
                        : 'text-earth-300 hover:bg-dark-800 hover:text-white'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-dark-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
