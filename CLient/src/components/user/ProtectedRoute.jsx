import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute; 