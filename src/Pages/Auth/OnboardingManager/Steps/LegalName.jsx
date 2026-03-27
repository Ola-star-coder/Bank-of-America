import { useState, useEffect, useRef } from 'react';
import '../Onboarding.css';

const LegalName = ({ data, updateData, onNext }) => {
  const [firstName, setFirstName] = useState(data.legalFirstName || '');
  const [lastName, setLastName] = useState(data.legalLastName || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;

  const handleNextClick = () => {
    if (!isValid) return;
    updateData('legalFirstName', firstName.trim());
    updateData('legalLastName', lastName.trim());
    onNext();
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">What's your legal name?</h1>
        <p className="ob-subtitle" style={{ marginBottom: '1.5rem' }}>
          This should match the name on your government ID.
        </p>

        <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1rem' }}>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Legal first name" 
            className="ob-input-field email-mode"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="ob-input-group" style={{ marginTop: '0' }}>
          <input 
            type="text" 
            placeholder="Legal last name" 
            className="ob-input-field email-mode"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '1rem', lineHeight: '1.5' }}>
          You can edit how this shows on your public profile if you go by another name.
        </p>
      </div>

      <div className="bottom-action-bar">
        <button 
          className="ob-next-btn" 
          onClick={handleNextClick} 
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default LegalName;