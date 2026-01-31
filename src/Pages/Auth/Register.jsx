import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile, sendEmailVerification } from 'firebase/auth';
import { Eye, EyeSlash, CircleNotch, Check, CaretDown } from 'phosphor-react';
import { toast } from 'react-toastify';
import './Auth.css'; 

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1', 
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth(); 
  const navigate = useNavigate();

  // List of targeted countries
  const countries = [ 
    { code: '+1',   flag: '🇺🇸', name: 'USA' }, // USA
    { code: '+44',  flag: '🇬🇧', name: 'UK' },  // UK
    { code: '+1',   flag: '🇨🇦', name: 'CAN' }, // Canada (Note: Same code as US, but distinct option)
    { code: '+49',  flag: '🇩🇪', name: 'GER' }, // Germany
    { code: '+33',  flag: '🇫🇷', name: 'FRA' }, // France
    { code: '+234', flag: '🇳🇬', name: 'NG' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreed) return toast.error("Please agree to the Terms & Conditions");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");

    try {
      setLoading(true);
      
      // 1. Create User
      const userCredential = await signup(formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Profile
      await updateProfile(user, { displayName: formData.fullName });

      // 3. Create Bank Data
      const accountNumber = '30' + Math.floor(10000000 + Math.random() * 90000000).toString();

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: `${formData.countryCode}${formData.phone}`,
        country: formData.countryCode === '+1' ? 'USA' : 'International',
        accountNumber: accountNumber,
        balance: 1000.00,
        isVerified: false,
        createdAt: new Date().toISOString(),
        transactions: [] 
      });

      // 4. FIXED: Force Update Local Storage immediately with the FORM DATA
      // We use formData.fullName because it is 100% accurate right now.
      localStorage.setItem('last_user_data', JSON.stringify({
        email: formData.email,
        name: formData.fullName.split(' ')[0] // Get first name "Dike" from "Dike Amaka"
      }));

      await sendEmailVerification(user);
      
      toast.success("Account created successfully!");
      navigate('/'); 
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <header className="auth-header">
           <Link to="/login" className="back-arrow">←</Link>
           <h1>Welcome!</h1>
           <p>Let's get you started</p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label>Legal Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="e.g. John Doe" 
              value={formData.fullName}
              onChange={handleChange}
              required 
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          {/* New Country Selector Logic */}
          <div className="input-group">
            <label>Phone Number</label>
            <div className="phone-input-wrapper">
              
              {/* The Country Dropdown */}
              <div className="country-select-container">
                <select 
                  name="countryCode" 
                  value={formData.countryCode} 
                  onChange={handleChange}
                  className="country-select"
                >
                  {countries.map((c, index) => (
                    <option key={index} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <CaretDown size={14} className="select-caret"/>
              </div>

              <input 
                type="tel" 
                name="phone"
                placeholder="812 345 6789" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Terms */}
          <div className="terms-container">
             <div 
               className={`checkbox ${agreed ? 'checked' : ''}`} 
               onClick={() => setAgreed(!agreed)}
             >
               {agreed && <Check size={14} color="white" weight="bold"/>}
             </div>
             <p>
               I agree to the <a href="#">Terms of Service</a> and <a href="#">Global Privacy Policy</a>.
             </p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <CircleNotch size={24} className="spinner-animate" /> : 'Create Account'}
          </button>
        </form>
        
        <div className="login-prompt">
            Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;