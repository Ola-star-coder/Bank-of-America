import { useState, useEffect } from 'react';
import { CaretDown, CircleNotch } from 'phosphor-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'; 
import { auth } from '../../../../Firebase/config'; // Ensure this path is correct!
import { toast } from 'react-toastify';
import '../Onboarding.css';

const PhoneOrEmail = ({ data, updateData, onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState('phone'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Exact max lengths for strict input blocking + Flags
  const countries = [
    { code: '+1', flag: '🇺🇸', name: 'USA', max: 10 },
    { code: '+44', flag: '🇬🇧', name: 'UK', max: 10 },
    { code: '+61', flag: '🇦🇺', name: 'AUS', max: 9 },
    { code: '+1', flag: '🇨🇦', name: 'CAN', max: 10 },
    { code: '+49', flag: '🇩🇪', name: 'GER', max: 11 },
    { code: '+234', flag: '🇳🇬', name: 'NGA', max: 10 } // Standard Nigerian mobile is 10 digits after +234
  ];
  
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [inputValue, setInputValue] = useState('');

  // 1. Initialize Firebase Invisible reCAPTCHA
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved automatically
        }
      });
    }
  }, []);

  // 2. Strict Validation Check
  const isValid = inputType === 'phone' 
    ? inputValue.length === selectedCountry.max 
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

  // 3. The Bouncer: Forces numbers only & strict length limits
  const handleInputChange = (e) => {
    let val = e.target.value;
    
    if (inputType === 'phone') {
      val = val.replace(/\D/g, ''); // Instantly delete any non-number
      if (val.length > selectedCountry.max) {
        val = val.slice(0, selectedCountry.max); // Block typing past max limit
      }
    }
    
    setInputValue(val);
  };

  // 4. Handle Submit & Firebase SMS
  const handleNextClick = async () => {
    if (!isValid) return;
    setIsLoading(true);
    
    const finalValue = inputType === 'phone' 
      ? `${selectedCountry.code}${inputValue}`
      : inputValue;

    updateData('phoneOrEmail', finalValue);

    if (inputType === 'phone') {
      try {
        const appVerifier = window.recaptchaVerifier;
        // Trigger Firebase SMS
        const confirmationResult = await signInWithPhoneNumber(auth, finalValue, appVerifier);
        
        // Save the confirmation object to our master state
        updateData('confirmationResult', confirmationResult);
        
        setIsLoading(false);
        onNext(); // Slide to Step 2
      } catch (error) {
        console.error("SMS Error:", error);
        toast.error("Failed to send code. Check number or try again later.");
        setIsLoading(false);
        // Reset recaptcha if it fails so they can try again safely
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then(id => grecaptcha.reset(id));
        }
      }
    } else {
      // Mock flow for Email (since Firebase Email OTP requires custom backend/extensions usually)
      setTimeout(() => {
        setIsLoading(false);
        onNext();
      }, 1000);
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
        
        {/* Invisible reCAPTCHA container for Firebase */}
        <div id="recaptcha-container"></div>

        <div className="ob-input-group">
          {inputType === 'phone' ? (
            <>
              {/* Custom Premium Dropdown */}
              <div className="custom-dropdown-container">
                <button 
                  className="dropdown-trigger" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="flag-emoji">{selectedCountry.flag}</span>
                  <span className="code-text">{selectedCountry.code}</span>
                  <CaretDown size={14} weight="bold" color="#6B7280" style={{ marginLeft: 'auto' }} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="dropdown-overlay" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="dropdown-menu animate-fade-in">
                      {countries.map((c, i) => (
                        <button 
                          key={i} 
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsDropdownOpen(false);
                            setInputValue(''); // Clear input if country changes
                          }}
                        >
                          <span className="flag-emoji">{c.flag}</span>
                          <span className="code-text">{c.code}</span>
                          <span className="country-name">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="input-divider"></div>

              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="ob-input-field"
                value={inputValue}
                onChange={handleInputChange}
                autoFocus
              />
            </>
          ) : (
            <input 
              type="email" 
              placeholder="Email Address" 
              className="ob-input-field email-mode"
              value={inputValue}
              onChange={handleInputChange}
              maxLength={254}
              autoFocus
            />
          )}
        </div>

        <button className="ob-help-link">Need help logging in?</button>
      </div>

      {/* Bottom Action Bar */}
      <div className="bottom-action-bar">
        <button className="ob-secondary-btn" onClick={toggleInputType}>
          Use {inputType === 'phone' ? 'Email' : 'Phone'}
        </button>
        
        <button 
          className="ob-next-btn" 
          onClick={handleNextClick} 
          disabled={!isValid || isLoading}
        >
          {isLoading ? <CircleNotch size={24} className="spin" /> : 'Next'}
        </button>
      </div>
    </>
  );
};

export default PhoneOrEmail;