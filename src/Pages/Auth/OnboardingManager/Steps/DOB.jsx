import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../Onboarding.css';

const DOB = ({ data, updateData, onNext }) => {
  const [dob, setDob] = useState(data.dob || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Automatically format MM / DD / YYYY as the user types
  const handleInputChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Strip non-numbers
    
    if (val.length >= 5) {
      val = `${val.slice(0, 2)} / ${val.slice(2, 4)} / ${val.slice(4, 8)}`;
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)} / ${val.slice(2, 4)}`;
    }
    
    setDob(val);
  };

  // The 18+ Math check
  const handleNextClick = () => {
    if (dob.length !== 14) return; // "MM / DD / YYYY" is exactly 14 chars

    const cleanDate = dob.replace(/\s/g, ''); // "MM/DD/YYYY"
    const birthDate = new Date(cleanDate);
    const today = new Date();
    
    // Check if date is actually valid (prevents 99/99/9999)
    if (birthDate.toString() === 'Invalid Date') {
      return toast.error("Please enter a valid date.");
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return toast.error("You must be 18 or older to open a Bridge account.");
    }

    updateData('dob', cleanDate);
    onNext();
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">What's your date of birth?</h1>
        <p className="ob-subtitle" style={{ marginBottom: '2rem' }}>
          Incorrect date of birth will impact access to most features on Bridge.
        </p>

        <div className="ob-input-group" style={{ marginTop: '0' }}>
          <input 
            ref={inputRef}
            type="tel" 
            placeholder="MM / DD / YYYY" 
            className="ob-input-field email-mode"
            value={dob}
            onChange={handleInputChange}
            maxLength={14}
          />
        </div>
      </div>

      <div className="bottom-action-bar">
        <button 
          className="ob-next-btn" 
          onClick={handleNextClick} 
          disabled={dob.length !== 14}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default DOB;