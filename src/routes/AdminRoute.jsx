// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isAdmin = isAuthenticated && user?.authority?.includes('ADMIN');

  return isAdmin ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
