import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are required roles and the user's role doesn't match
  if (requiredRoles.length > 0 && (!userRole || !requiredRoles.includes(userRole))) {
    // Admin can access everything
    if (userRole === 'admin') {
      return <>{children}</>;
    }
    
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}