// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <h2>🚫 Access Denied</h2>;

  return children;
};

export default PrivateRoute;
