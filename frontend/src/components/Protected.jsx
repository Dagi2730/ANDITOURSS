// frontend/src/components/Protected.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// This component acts as a wrapper around routes that require authentication
const Protected = ({ children }) => {
    // Check the Redux state for the user object (which contains the token)
    const { user } = useSelector((state) => state.auth); 

    if (!user) {
        // If no user is logged in, redirect them to the login page
        return <Navigate to='/login' replace />;
    }

    // If a user is logged in, render the child component (the AdminDashboard)
    return children;
};

export default Protected;