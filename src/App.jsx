import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './Context/AuthContext';
import { TransferModalProvider } from './Context/TransferModelContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';

import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import DashboardHome from './Pages/Dashboard/Home';
import Transfer from './Pages/Dashboard/Transfer/Transfer';
import Settings from './Pages/Dashboard/Settings';
import NotFound from './Pages/NotFound';
import AllTransactions from './Pages/Dashboard/History/AllTransactions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <TransferModalProvider>
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/transactions" element={
               <ProtectedRoute>
                 <AllTransactions />
               </ProtectedRoute>
            } />
            
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
          
        </TransferModalProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;