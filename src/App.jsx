import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your Context
import { AuthProvider } from './context/AuthContext';

// Import your Protected Route
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages (We will create these files later)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DashboardHome from './pages/Dashboard/Home';
import Transfer from './pages/Dashboard/Transfer';
import Settings from './pages/Dashboard/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES - Anyone can see these */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVATE ROUTES - Only logged-in users can see these */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/transfer" 
            element={
              <ProtectedRoute>
                <Transfer />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* CATCH ALL - If they type a random URL, send them to 404 or Login */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Toast Notifications (placed here to work everywhere) */}
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;