import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="spinner"></div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;