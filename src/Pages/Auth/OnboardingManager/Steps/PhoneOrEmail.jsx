import { useState, useEffect } from 'react';
import { CaretDown, CircleNotch } from 'phosphor-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'; 
import { auth } from '../../../../Firebase/config'; 
import emailjs from '@emailjs/browser'; 
import { toast } from 'react-toastify';
import '../Onboarding.css';

const PhoneOrEmail = ({ data, updateData, onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState('phone'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const countries = [
    { code: '+1', flag: '🇺🇸', name: 'USA', max: 10, iso: 'US', curr: 'USD' },
    { code: '+44', flag: '🇬🇧', name: 'UK', max: 10, iso: 'GB', curr: 'GBP' },
    { code: '+1', flag: '🇨🇦', name: 'CAN', max: 10, iso: 'CA', curr: 'CAD' },
    { code: '+49', flag: '🇩🇪', name: 'GER', max: 11, iso: 'DE', curr: 'EUR' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria', max: 10, iso: 'NG', curr: 'NGN' } 
  ];
  
  const initialCountry = countries.find(c => c.iso === data.countryCode) || countries[0];
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [inputValue, setInputValue] = useState(data.phoneOrEmail || '');

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
  }, []);

  const isValid = inputType === 'phone' 
    ? inputValue.length === selectedCountry.max 
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

  const handleInputChange = (e) => {
    let val = e.target.value;
    if (inputType === 'phone') {
      val = val.replace(/\D/g, ''); 
      if (val.length > selectedCountry.max) val = val.slice(0, selectedCountry.max); 
    }
    setInputValue(val);
  };

  const handleCountrySelect = (c) => {
    setSelectedCountry(c);
    setIsDropdownOpen(false);
    if (inputType === 'phone') setInputValue(''); // Only clear input if phone length rules changed
    updateData('countryCode', c.iso);
    updateData('currency', c.curr);
  };

  const handleNextClick = async () => {
    if (!isValid) return;
    setIsLoading(true);
    
    if (inputType === 'phone') {
      toast.warn("SMS Verification is undergoing maintenance. Please use Email.", { autoClose: 4000 });
      setIsLoading(false);
      setInputType('email');
      setInputValue('');
      return; 
    } else {
      updateData('phoneOrEmail', inputValue);
      
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      updateData('expectedOtp', otpCode);

      const expiryDate = new Date(new Date().getTime() + 15 * 60000);
      const timeString = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      try {
        await emailjs.send(
          'service_lsaa5zn', 
          'template_57qj5en', 
          {
            to_email: inputValue,
            passcode: otpCode,
            time: timeString,
          }, 
          'OMSN3FksAD0oEh-JW'
        );
        toast.success("Verification code sent to your email!");
        setIsLoading(false);
        onNext();
      } catch (error) {
        console.error("EmailJS Error:", error);
        toast.error("Failed to send email. Check console.");
        setIsLoading(false);
      }
    }
  };

  const toggleInputType = () => {
    setInputType(inputType === 'phone' ? 'email' : 'phone');
    setInputValue('');
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">Enter your {inputType === 'phone' ? 'phone' : 'email'}</h1>
        
        <div id="recaptcha-container"></div>

        {/* --- GLOBAL DROPDOWN MENU (Used by both Phone and Email views) --- */}
        {isDropdownOpen && (
          <>
            <div className="dropdown-overlay" onClick={() => setIsDropdownOpen(false)}></div>
            <div className="dropdown-menu animate-fade-in" style={{ top: inputType === 'email' ? '140px' : 'auto' }}>
              {countries.map((c, i) => (
                <button key={i} className="dropdown-item" onClick={() => handleCountrySelect(c)}>
                  <span className="flag-emoji">{c.flag}</span>
                  <span className="code-text">{c.code}</span>
                  <span className="country-name">{c.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {inputType === 'phone' ? (
          <div className="ob-input-group custom-dropdown-container">
            <button className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span className="flag-emoji">{selectedCountry.flag}</span>
              <span className="code-text">{selectedCountry.code}</span>
              <CaretDown size={14} weight="bold" color="#6B7280" style={{ marginLeft: 'auto' }} />
            </button>
            <div className="input-divider"></div>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="ob-input-field"
              value={inputValue}
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        ) : (
          /* --- THE NEW EMAIL VIEW WITH RESIDENCE SELECTOR --- */
          <div className="email-input-container">
            <label className="ob-small-label">Country of Residence</label>
            <button className="email-country-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span className="flag-emoji">{selectedCountry.flag}</span>
              <span className="country-name-text">{selectedCountry.name}</span>
              <CaretDown size={14} weight="bold" color="#6B7280" style={{ marginLeft: 'auto' }} />
            </button>

            <div className="ob-input-group" style={{ marginTop: '1rem' }}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="ob-input-field email-mode"
                value={inputValue}
                onChange={handleInputChange}
                maxLength={254}
                autoFocus
              />
            </div>
          </div>
        )}

        <button className="ob-help-link">Need help logging in?</button>
      </div>

      <div className="bottom-action-bar">
        <button className="ob-secondary-btn" onClick={toggleInputType}>
          Use {inputType === 'phone' ? 'Email' : 'Phone'}
        </button>
        <button className="ob-next-btn" onClick={handleNextClick} disabled={!isValid || isLoading}>
          {isLoading ? <CircleNotch size={24} className="spin" /> : 'Next'}
        </button>
      </div>
    </>
  );
};

export default PhoneOrEmail;