// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider, useAuth } from './Context/AuthContext';
import { TransferModalProvider } from './Context/TransferModalContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import SplashScreen from './components/SplashScreen/SplashScreen'; // NEW: Our Gatekeeper

// Pages
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import DashboardHome from './Pages/Dashboard/Home';
import Transfer from './Pages/Dashboard/Transfer/Transfer';
import BankTransfer from './Pages/Dashboard/Transfer/BankTransfer';
import Settings from './Pages/Dashboard/Settings';
import NotFound from './Pages/NotFound';
import AllTransactions from './Pages/Dashboard/History/AllTransactions';
import MyCards from './components/Cards/MyCards';

/**
 * 1. THE INTERCEPTOR (AppContent)
 * This sits inside AuthProvider so it can listen to Firebase's 'loading' state.
 */
function AppContent() {
  const { loading, user } = useAuth(); // Grab real-time Firebase status
  const [showSplash, setShowSplash] = useState(true);

  // While Splash is active, hide the entire app and wait for the 5-sec animation
  if (showSplash) {
    return (
      <SplashScreen 
        isAppLoading={loading} 
        onComplete={() => setShowSplash(false)} 
      />
    );
  }

  // Check Onboarding Status (We will use this in Step 2)
  const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding');

  return (
    <>
      <Routes>
        {/* --- AUTH & ONBOARDING ROUTES --- */}
        {/* NOTE: We will build /welcome and /unlock next! */}
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- PROTECTED DASHBOARD ROUTES --- */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <AllTransactions />
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
          path="/bank-transfer" 
          element={
            <ProtectedRoute>
              <BankTransfer />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/cards" 
          element={
            <ProtectedRoute>
              <MyCards />
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
      
      {/* Navbar handles its own visibility based on the current route */}
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <TransferModalProvider>
          <AppContent />
        </TransferModalProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;