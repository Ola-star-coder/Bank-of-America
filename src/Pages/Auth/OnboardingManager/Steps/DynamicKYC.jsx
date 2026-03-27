import { useState, useRef, useEffect } from 'react';
import { LockKey } from 'phosphor-react';
import '../Onboarding.css';

const DynamicKYC = ({ data, updateData, onNext }) => {
  const [kycValue, setKycValue] = useState(data.kycId || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // 1. DYNAMIC CONFIGURATION
  const getKycConfig = () => {
    switch (data.countryCode) {
      case 'US': return { name: 'Social Security Number', placeholder: 'XXX-XX-XXXX', reqLength: 11 };
      case 'NG': return { name: 'Bank Verification Number', placeholder: '11-digit BVN', reqLength: 11 };
      case 'GB': return { name: 'National Insurance Number', placeholder: 'AB123456C', reqLength: 9 };
      case 'CA': return { name: 'Social Insurance Number', placeholder: 'XXX-XXX-XXX', reqLength: 11 };
      default: return { name: 'National ID Number', placeholder: 'Enter ID Number', reqLength: 6 };
    }
  };

  const config = getKycConfig();

  // 2. CLEAN AUTO-FORMATTER
  const handleInputChange = (e) => {
    let val = e.target.value.toUpperCase(); // Force uppercase for UK NINOs

    if (data.countryCode === 'US') {
      val = val.replace(/\D/g, ''); // Numbers only
      if (val.length >= 6) val = `${val.slice(0, 3)}-${val.slice(3, 5)}-${val.slice(5, 9)}`;
      else if (val.length >= 4) val = `${val.slice(0, 3)}-${val.slice(3, 5)}`;
    } else if (data.countryCode === 'CA') {
      val = val.replace(/\D/g, '');
      if (val.length >= 7) val = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6, 9)}`;
      else if (val.length >= 4) val = `${val.slice(0, 3)}-${val.slice(3, 6)}`;
    } else if (data.countryCode === 'NG') {
      val = val.replace(/\D/g, '').slice(0, 11);
    } else if (data.countryCode === 'GB') {
      val = val.replace(/[^A-Z0-9]/g, '').slice(0, 9);
    }

    setKycValue(val);
  };

  // 3. SAFE SUBMIT LOGIC (No unreachable code)
  const isReady = kycValue.length >= config.reqLength;

  const handleNextClick = () => {
    if (isReady) {
      updateData('kycId', kycValue);
      onNext();
    }
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">What's your {config.name}?</h1>
        <p className="ob-subtitle" style={{ marginBottom: '1.5rem' }}>
          This information is used to verify your identity. It is securely encrypted and never shared.
        </p>

        <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1.5rem' }}>
          <input 
            ref={inputRef}
            type="text" 
            placeholder={config.placeholder} 
            className="ob-input-field email-mode"
            value={kycValue}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '0.875rem', fontWeight: '500' }}>
          <LockKey size={18} weight="bold" />
          <span>Secured with 256-bit encryption</span>
        </div>
      </div>

      <div className="bottom-action-bar">
        <button 
          className="ob-next-btn" 
          onClick={handleNextClick} 
          disabled={!isReady}
        >
          Verify Identity
        </button>
      </div>
    </>
  );
};

export default DynamicKYC;