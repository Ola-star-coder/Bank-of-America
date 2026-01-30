import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { GoogleLogo, AppleLogo, FacebookLogo, Eye, EyeSlash } from 'phosphor-react';
import './Auth.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get googleSignIn from context
  const { login, googleSignIn } = useAuth(); 
  const navigate = useNavigate();

  // Handle standard Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Failed to log in. Please check your details.');
      setLoading(false);
    }
  };

  // Handle Google Login --- NEW ADDITION ---
  const handleGoogleLogin = async () => {
    try {
      setError('');
      await googleSignIn();
      navigate('/'); // Go to dashboard immediately
    } catch (err) {
      console.error(err);
      setError('Failed to login with Google.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-shape"></div>
        </div>

        <h2>Login</h2>
        <p className="auth-subtitle">Login to continue using the app</p>

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
          {/* Facebook (Decorative for now) */}
          <button className="social-btn" type="button">
            <FacebookLogo size={24} weight="fill" color="#1877F2" />
          </button>
          
          {/* Google (FUNCTIONAL) */}
          <button 
            className="social-btn" 
            type="button" 
            onClick={handleGoogleLogin}
          >
            <GoogleLogo size={24} weight="bold" color="#EA4335" />
          </button>
          
          {/* Apple (Decorative for now) */}
          <button className="social-btn" type="button">
            <AppleLogo size={24} weight="fill" />
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;