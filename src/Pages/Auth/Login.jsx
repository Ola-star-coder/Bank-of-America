import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- Added useNavigate
import { useAuth } from '../../Context/AuthContext';
import { GoogleLogo, AppleLogo, FacebookLogo, Eye, EyeSlash } from 'phosphor-react';
import './Auth.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // <--- Added loading state to prevent double clicks
  
  const { login } = useAuth();
  const navigate = useNavigate(); // <--- Initialize navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Disable button while loading

    try {
      await login(email, password);
      // SUCCESS! Redirect to Dashboard
      navigate('/'); 
    } catch (err) {
      // Error handling
      console.error(err);
      setError('Failed to log in. Please check your email and password.');
      setLoading(false); // Re-enable button if it failed
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo Icon */}
        <div className="auth-logo">
          <div className="logo-shape"></div>
        </div>

        <h2>Login</h2>
        <p className="auth-subtitle">Login to continue using the app</p>

        {/* Error Message Display */}
        {error && <div className="auth-error" style={{color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

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
            <div className="forgot-password">
              <Link to="/forgot-password">Forget password?</Link>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">Or Login with</div>

        <div className="social-login">
          <button className="social-btn" type="button"><FacebookLogo size={24} weight="fill" color="#1877F2" /></button>
          <button className="social-btn" type="button"><GoogleLogo size={24} weight="bold" color="#EA4335" /></button>
          <button className="social-btn" type="button"><AppleLogo size={24} weight="fill" /></button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;