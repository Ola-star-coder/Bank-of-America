import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { CircleNotch, UserCircle, X } from 'phosphor-react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import './Auth.css'; 

const Login = () => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [returningUser, setReturningUser] = useState(null); 
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem('last_user_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setReturningUser(parsed);
      setEmail(parsed.email); 
    }
  }, []);

  // Focus OTP input when step changes
  useEffect(() => {
    if (step === 2 && inputRef.current) inputRef.current.focus();
  }, [step]);

  // Step 1: Send OTP via EmailJS
  const handleSendCode = async (e) => {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(generatedCode);

    try {
      await emailjs.send(
        'service_lsaa5zn', 
        'template_57qj5en', 
        {
          to_email: email,
          passcode: generatedCode,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }, 
        'OMSN3FksAD0oEh-JW'
      );
      toast.success("Verification code sent!");
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Login
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);

    if (otp === expectedOtp) {
      try {
        // Reconstruct the hidden password!
        const hiddenAuthPassword = `Bridge_Auth_2026_${email}!`; 
        
        const userCredential = await login(email, hiddenAuthPassword);
        const user = userCredential.user;

        const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
        localStorage.setItem('last_user_data', JSON.stringify({ email: user.email, name: firstName }));

        toast.success("Welcome back!");
        navigate('/'); 
      } catch (err) {
        console.error(err);
        toast.error('Account not found. Please create an account.');
        setStep(1);
        setOtp('');
      }
    } else {
      toast.error("Incorrect code.");
      setOtp('');
    }
    setLoading(false);
  };

  // Auto-verify when 6 digits are typed
  useEffect(() => {
    if (otp.length === 6) handleVerifyOtp();
  }, [otp]);

  const handleSwitchAccount = () => {
    localStorage.removeItem('last_user_data');
    setReturningUser(null);
    setEmail('');
    setStep(1);
    setOtp('');
  };

  return (
    <div className="auth-container page-fade">
      <div className="auth-content">
        
        <header className="auth-header">
           {returningUser && step === 1 ? (
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
             <>
               {step === 1 ? (
                 <Link to="/" className="back-arrow">←</Link>
               ) : (
                 <button onClick={() => setStep(1)} className="back-arrow" style={{background:'none', border:'none', cursor:'pointer'}}>←</button>
               )}
               <h1>{step === 1 ? 'Log in' : 'Enter code'}</h1>
               <p>{step === 1 ? 'Securely access your global account.' : `Sent to ${email}`}</p>
             </>
           )}
        </header>

        {step === 1 ? (
          <form onSubmit={handleSendCode}>
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
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <CircleNotch size={24} className="spinner-animate" /> : 'Send Code'}
            </button>
          </form>
        ) : (
          <div>
             <div className="input-group" style={{ textAlign: 'center' }}>
                <input 
                  ref={inputRef}
                  type="tel" 
                  placeholder="- - - - - -" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ letterSpacing: otp.length > 0 ? '1rem' : '0.5rem', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center' }}
                />
              </div>
              <button onClick={handleVerifyOtp} className="btn-primary" disabled={loading || otp.length !== 6}>
                {loading ? <CircleNotch size={24} className="spinner-animate" /> : 'Verify'}
              </button>
          </div>
        )}

        {step === 1 && !returningUser && (
          <div className="login-prompt">
              Don't have an account? <Link to="/register">Create one</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;