import { useState } from 'react';
import { CaretDown, Check, Eye, EyeSlash, ArrowRight } from 'phosphor-react';
import { toast } from 'react-toastify';

const Phase1_Identity = ({ formData, setFormData, nextPhase }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Target Demographics: USA, EU, ASIA, AUSTRALIA
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

  // Password Validation Checkers
  const hasLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  const handleContinue = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.dob || !formData.phone) {
      return toast.error("Please fill in all fields.");
    }
    if (!hasLength || !hasNumber || !hasSpecial) {
      return toast.error("Please meet all password requirements.");
    }

    // Instead of going to Phase 2 immediately, we trigger the OTP screen
    setShowOtpStep(true);
    toast.info(`Verification code sent to ${formData.email}`);
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) return toast.error("Enter the full 6-digit code.");
    
    // Simulate successful OTP verification
    toast.success("Email verified!");
    nextPhase(); // Move to Phase 2: KYC
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    // Auto-focus next input
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  if (showOtpStep) {
    return (
      <div className="phase-container animate-slide-left">
        <h2 className="phase-title">Verify your email</h2>
        <p className="phase-subtitle">We sent a 6-digit code to <strong>{formData.email}</strong></p>

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

        <button className="btn-primary" onClick={handleVerifyOtp} style={{ marginTop: '2rem' }}>
          Verify & Continue <ArrowRight size={20} weight="bold" />
        </button>
      </div>
    );
  }

  return (
    <div className="phase-container animate-slide-left">
      <h2 className="phase-title">Tell us about yourself</h2>
      <p className="phase-subtitle">This information must match your government ID.</p>

      <div className="input-row">
        <div className="input-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Legal First Name" />
        </div>
        <div className="input-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Legal Last Name" />
        </div>
      </div>

      <div className="input-group">
        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label>Phone Number</label>
        <div className="phone-input-wrapper">
          <div className="country-select-container">
            <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="country-select">
              {regions.map((r, idx) => (
                <option key={idx} value={r.code}>{r.flag} {r.code}</option>
              ))}
            </select>
            <CaretDown size={14} className="select-caret" />
          </div>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" />
        </div>
      </div>

      <div className="input-group">
        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />
      </div>

      <div className="input-group">
        <label>Secure Password</label>
        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Create a password" 
          />
          <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Dynamic Password Checklist */}
        <div className="password-checklist">
          <span className={hasLength ? 'valid' : ''}>
            <Check size={12} weight="bold" /> 8+ Characters
          </span>
          <span className={hasNumber ? 'valid' : ''}>
            <Check size={12} weight="bold" /> 1 Number
          </span>
          <span className={hasSpecial ? 'valid' : ''}>
            <Check size={12} weight="bold" /> 1 Special (!@#$)
          </span>
        </div>
      </div>

      <button className="btn-primary" onClick={handleContinue} style={{ marginTop: '1.5rem' }}>
        Send Verification Code
      </button>
    </div>
  );
};

export default Phase1_Identity;