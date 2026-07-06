import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Protected = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // 1. If no user is logged in, send them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Normalize the role and verify it exists
  // Using optional chaining ensures this doesn't crash if role is undefined
  const role = user?.role?.toString().toUpperCase();

  // 3. If the user is logged in but not an ADMIN, redirect them to the home page
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // 4. If all checks pass, render the protected component (AdminDashboard)
  return children;
};

export default Protected;