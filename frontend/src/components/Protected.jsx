// frontend/src/components/Protected.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Protected = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toString().toUpperCase();
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;