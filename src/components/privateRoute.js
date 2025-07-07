import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the user is authenticated (this can come from localStorage, context, etc.)
  const isAuthenticated = Boolean(localStorage.getItem('adminToken'));
  
  // If authenticated, render the child component; otherwise, redirect to /login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
