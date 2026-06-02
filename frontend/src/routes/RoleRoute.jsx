import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-earth-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-earth-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!user || (!allowedRoles.includes(user.role) && !allowedRoles.includes('all'))) {
    // Redirect to their specific dashboard if they are logged in but have the wrong role
    if (user) {
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
