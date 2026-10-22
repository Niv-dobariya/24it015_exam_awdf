import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Task 2: ProtectedRoute Component
 * - If user has no token -> redirect to '/' (LoginPage)
 * - If user does not meet requiredRole -> redirect to '/events' (without logging out)
 * - If authorized -> render protected children
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useContext(AuthContext);

  // Case 1: Missing Token -> Redirect to Login Page ('/')
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Case 2: Role mismatch -> Redirect to Events Page ('/events') rather than logging out
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/events" replace />;
  }

  return children;
};

export default ProtectedRoute;
