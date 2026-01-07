import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, userType }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userType && user.user_type !== userType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
