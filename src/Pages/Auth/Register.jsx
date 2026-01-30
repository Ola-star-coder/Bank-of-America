import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { Eye, EyeSlash } from 'phosphor-react';
import './Auth.css'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic Validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError('');
      setLoading(true);
      // 2. Create the user in Firebase
      await signup(email, password);
      // 3. If successful, go to Dashboard
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError('Failed to create an account. Email might be in use.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
           {/* You can use the same logo shape here */}
           <div className="logo-shape"></div>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">Start managing your finances today</p>

        {error && <div className="auth-error" style={{color: 'red', fontSize: '14px', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a password"
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

          {/* Confirm Password Input */}
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer" style={{marginTop: '20px'}}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;