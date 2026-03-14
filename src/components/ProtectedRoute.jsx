import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If they are logged in, let them through to the page!
  return children;
};

// 👇 THIS IS THE LINE VITE WAS CRYING ABOUT! 👇
export default ProtectedRoute;