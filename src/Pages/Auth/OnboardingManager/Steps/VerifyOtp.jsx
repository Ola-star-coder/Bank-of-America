import { useState, useRef, useEffect } from 'react';
import { CircleNotch } from 'phosphor-react';
import { toast } from 'react-toastify';
import '../Onboarding.css';

const VerifyOTP = ({ data, onNext }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus the input on load
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Numbers only
    if (val.length > 6) val = val.slice(0, 6); // Max 6 digits
    setCode(val);
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setIsLoading(true);

    if (data.confirmationResult) {
      // --- REAL FIREBASE VERIFICATION ---
      try {
        const result = await data.confirmationResult.confirm(code);
        // If we get here, the code was correct! 
        // Note: Firebase just authenticated the user in the background.
        setIsLoading(false);
        onNext();
      } catch (error) {
        console.error("OTP Error:", error);
        toast.error("Incorrect code. Please try again.");
        setIsLoading(false);
        setCode(''); // Clear so they can try again
      }
    } else {
      // Fallback for Email mock
      setTimeout(() => {
        setIsLoading(false);
        if (code === '123456') { // Mock correct code
            onNext();
        } else {
            toast.error("Incorrect code (Hint: use 123456)");
            setCode('');
        }
      }, 1000);
    }
  };

  // Auto-submit when 6 digits are entered (Cash App does this!)
  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code]);

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">Please enter the code sent to {data.phoneOrEmail}</h1>
        
        <div className="ob-input-group" style={{ marginTop: '2rem' }}>
          <input 
            ref={inputRef}
            type="tel" 
            placeholder="Confirmation Code" 
            className="ob-input-field email-mode" /* Reuse padding style */
            value={code}
            onChange={handleInputChange}
            style={{ letterSpacing: '8px', fontSize: '1.25rem', textAlign: 'center' }}
          />
        </div>

        <button className="ob-help-link">Need help logging in?</button>
      </div>

      <div className="bottom-action-bar">
        <button 
          className="ob-next-btn" 
          onClick={handleVerify} 
          disabled={code.length !== 6 || isLoading}
        >
          {isLoading ? <CircleNotch size={24} className="spin" /> : 'Next'}
        </button>
      </div>
    </>
  );
};

export default VerifyOTP;