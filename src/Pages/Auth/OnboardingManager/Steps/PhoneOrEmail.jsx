import { useState } from 'react';
import { CaretDown, CircleNotch } from 'phosphor-react';
import '../Onboarding.css';

const PhoneOrEmail = ({ data, updateData, onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState('phone'); // 'phone' or 'email'
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Added exact max lengths for strict input blocking
  const countries = [
    { code: '+1', flag: '🇺🇸', name: 'USA', max: 10 },
    { code: '+44', flag: '🇬🇧', name: 'UK', max: 10 },
    { code: '+61', flag: '🇦🇺', name: 'AUS', max: 9 },
    { code: '+1', flag: '🇨🇦', name: 'CAN', max: 10 },
    { code: '+49', flag: '🇩🇪', name: 'GER', max: 11 },
    { code: '+234', flag: '🇳🇬', name: 'NGA', max: 11 }
  ];
  
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [inputValue, setInputValue] = useState('');

  // Validation
  const isValid = inputType === 'phone' 
    ? inputValue.length === selectedCountry.max // Must be EXACTLY the right length
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

  // The Bouncer: Forces numbers only & strict length limits
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

  const handleNextClick = async () => {
    if (!isValid) return;
    setIsLoading(true);
    
    const finalValue = inputType === 'phone' 
      ? `${selectedCountry.code}${inputValue}`
      : inputValue;

    updateData('phoneOrEmail', finalValue);

    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 1000);
  };

  const toggleInputType = () => {
    setInputType(inputType === 'phone' ? 'email' : 'phone');
    setInputValue('');
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">Enter your {inputType === 'phone' ? 'phone' : 'email'}</h1>
        
        <div className="ob-input-group">
          {inputType === 'phone' ? (
            <>
              <div className="custom-dropdown-container">
                <button 
                  className="dropdown-trigger" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="flag-emoji">{selectedCountry.flag}</span>
                  <span className="code-text">{selectedCountry.code}</span>
                  {/* Caret is pushed to the right to keep widths consistent */}
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
              maxLength={254} /* Standard email max length */
              autoFocus
            />
          )}
        </div>

        <button className="ob-help-link">Need help logging in?</button>
      </div>

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