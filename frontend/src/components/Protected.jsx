import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Protected = ({ children, adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);

  // 1. If no user is logged in, send them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If this route is exclusively for admins, verify role
  if (adminOnly) {
    const role = user?.role?.toString().toUpperCase();
    if (role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
  }

  // 3. If all checks pass, render the protected component
  return children;
};

export default Protected;