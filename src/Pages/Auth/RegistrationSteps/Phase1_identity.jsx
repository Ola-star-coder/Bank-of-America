import { useState } from 'react';
import { CaretDown, Check, Eye, EyeSlash, ArrowRight, LockKey, ShieldCheck } from 'phosphor-react';
import { toast } from 'react-toastify';

const Phase1_Identity = ({ formData, setFormData, nextPhase }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // Target Demographics
  const regions = [
    { code: '+1', flag: '🇺🇸', label: 'US/CAN' },
    { code: '+44', flag: '🇬🇧', label: 'UK' },
    { code: '+49', flag: '🇩🇪', label: 'EU' },
    { code: '+61', flag: '🇦🇺', label: 'AUS' },
    { code: '+65', flag: '🇸🇬', label: 'ASIA' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Live Password Validation
  const hasLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  // Helper: Mask email for OTP screen (e.g., joh****@gmail.com)
  const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return `${name.substring(0, 3)}****@${domain}`;
  };

  const handleContinue = () => {
    // 1. Strict Empty Check
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.dob) {
      return toast.error("Please provide all required legal information.");
    }

    // 2. Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return toast.error("Please enter a valid email address.");
    }

    // 3. Exact 18+ Age Gate (Calculated against current date)
    const calculateAge = (dobString) => {
      const today = new Date();
      const birthDate = new Date(dobString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
    };

    if (calculateAge(formData.dob) < 18) {
      return toast.error("Regulatory requirements mandate users must be 18 or older to open an account.");
    }

    // 4. Password Security Gate
    if (!hasLength || !hasNumber || !hasSpecial) {
      return toast.error("Your password does not meet the minimum security requirements.");
    }

    // Trigger OTP Phase
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpStep(true);
      toast.info("Secure verification code sent.");
    }, 1200);
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) return toast.error("Enter the full 6-digit authorization code.");
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Identity verified securely.");
      nextPhase(); 
    }, 1500);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  if (showOtpStep) {
    return (
      <div className="phase-container animate-slide-left">
        <div className="trust-badge"><ShieldCheck size={16} weight="fill" /> 256-bit Encryption Active</div>
        <h2 className="phase-title">Verify your identity</h2>
        <p className="phase-subtitle">To secure your account, we sent a 6-digit code to <strong>{maskEmail(formData.email)}</strong></p>

        <div className="otp-container">
          {otp.map((data, index) => (
            <input
              className="otp-box"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={e => handleOtpChange(e.target, index)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>

        <button className="btn-primary" onClick={handleVerifyOtp} disabled={isLoading} style={{ marginTop: '2.5rem' }}>
          {isLoading ? 'Verifying...' : 'Authorize Device'} <LockKey size={20} weight="fill" />
        </button>
      </div>
    );
  }

  return (
    <div className="phase-container animate-slide-left">
      <div className="trust-badge"><LockKey size={16} weight="fill" /> Bank-Grade Security</div>
      <h2 className="phase-title">Legal Identity</h2>
      <p className="phase-subtitle">This information must match your government-issued ID.</p>

      <div className="input-row">
        <div className="input-group">
          <label>Legal First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="As shown on ID" />
        </div>
        <div className="input-group">
          <label>Legal Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="As shown on ID" />
        </div>
      </div>

      <div className="input-group">
        <label>Date of Birth (MM/DD/YYYY)</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label>Mobile Number</label>
        <div className="phone-input-wrapper">
          <div className="country-select-container">
            <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="country-select">
              {regions.map((r, idx) => (
                <option key={idx} value={r.code}>{r.flag} {r.code}</option>
              ))}
            </select>
            <CaretDown size={14} className="select-caret" />
          </div>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" maxLength={15} />
        </div>
      </div>

      <div className="input-group">
        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Account recovery email" />
      </div>

      <div className="input-group">
        <label>Master Password</label>
        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Create a strong password" 
          />
          <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="password-checklist">
          <span className={hasLength ? 'valid' : ''}><Check size={14} weight="bold" /> 8+ Chars</span>
          <span className={hasNumber ? 'valid' : ''}><Check size={14} weight="bold" /> 1 Number</span>
          <span className={hasSpecial ? 'valid' : ''}><Check size={14} weight="bold" /> 1 Special</span>
        </div>
      </div>

      <button className="btn-primary" onClick={handleContinue} style={{ marginTop: '1.5rem' }}>
        Continue <ArrowRight size={20} weight="bold" />
      </button>
    </div>
  );
};

export default Phase1_Identity;