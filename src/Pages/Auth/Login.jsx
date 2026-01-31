import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { Eye, EyeSlash, CircleNotch, UserCircle, X } from 'phosphor-react';
import { toast } from 'react-toastify';
import './Auth.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for "Smart Login"
  const [returningUser, setReturningUser] = useState(null); // Stores { name, email } if found

  const { login } = useAuth(); 
  const navigate = useNavigate();

  // 1. Check for saved user on load
  useEffect(() => {
    const savedData = localStorage.getItem('last_user_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setReturningUser(parsed);
      setEmail(parsed.email); // Pre-fill email logic
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Perform Login
      const userCredential = await login(email, password);
      const user = userCredential.user;

      // 3. Save User Data for NEXT time (The "Smart" part)
      // We assume user.displayName is set. If not, fallback to email prefix.
      const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
      
      localStorage.setItem('last_user_data', JSON.stringify({
        email: user.email,
        name: firstName
      }));

      toast.success("Login Successful");
      navigate('/'); 
    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to switch to a different account
  const handleSwitchAccount = () => {
    localStorage.removeItem('last_user_data');
    setReturningUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        
        {/* HEADER LOGIC */}
        <header className="auth-header">
           {returningUser ? (
             // RETURNING USER HEADER
             <div className="welcome-back-header">
               <div className="avatar-circle">
                 <UserCircle size={48} weight="light" color="#2563EB" />
               </div>
               <h1>Welcome back, {returningUser.name}</h1>
               <div className="using-email-tag">
                 <span>Using {returningUser.email}</span>
                 <button onClick={handleSwitchAccount} className="switch-btn">
                   <X size={12} weight="bold"/> 
                 </button>
               </div>
             </div>
           ) : (
             // STANDARD HEADER
             <>
               <Link to="/" className="back-arrow">←</Link>
               <h1>Log in</h1>
               <p>Securely access your global account.</p>
             </>
           )}
        </header>

        <form onSubmit={handleSubmit}>
          
          {/* Email Input - ONLY SHOW IF NOT RETURNING USER */}
          {!returningUser && (
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          )}

          {/* Password Input - ALWAYS SHOW */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="forgot-password-link">
             <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <CircleNotch size={24} className="spinner-animate" /> : 'Log In'}
          </button>
        </form>

        {/* Footer Links */}
        {!returningUser && (
          <div className="login-prompt">
              Don't have an account? <Link to="/register">Create one</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;