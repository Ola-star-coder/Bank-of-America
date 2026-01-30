import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext' 

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="loading-screen">Loading Bank App...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;