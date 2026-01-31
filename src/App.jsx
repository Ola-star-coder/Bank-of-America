import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from './Context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';

import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import DashboardHome from './Pages/Dashboard/Home';
import Transfer from './Pages/Dashboard/Transfer';
import Settings from './Pages/Dashboard/Settings';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Navbar/>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;