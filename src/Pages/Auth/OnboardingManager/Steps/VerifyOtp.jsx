import { useState, useRef, useEffect } from 'react';
import { CircleNotch } from 'phosphor-react';
import { toast } from 'react-toastify';
import '../Onboarding.css';

const VerifyOTP = ({ data, onNext }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length > 6) val = val.slice(0, 6); 
    setCode(val);
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setIsLoading(true);

    // --- 1. EMAILJS OTP VERIFICATION ---
    if (data.expectedOtp) {
      setTimeout(() => { // Artificial delay to feel secure
        setIsLoading(false);
        if (code === data.expectedOtp.toString()) {
            onNext();
        } else {
            toast.error("Incorrect code. Please try again.");
            setCode('');
        }
      }, 1000);
      return; // Exit early so it doesn't run Firebase
    }

    // --- 2. FIREBASE SMS VERIFICATION (For the future) ---
    if (data.confirmationResult) {
      try {
        const result = await data.confirmationResult.confirm(code);
        setIsLoading(false);
        onNext();
      } catch (error) {
        console.error("OTP Error:", error);
        toast.error("Incorrect code. Please try again.");
        setIsLoading(false);
        setCode(''); 
      }
    } else {
      setIsLoading(false);
      toast.error("Verification session expired. Please go back.");
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code]);

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-titlel">Please enter the code sent to {data.phoneOrEmail}</h1>
        
        <div className="ob-input-group" style={{ marginTop: '2rem' }}>
          <input 
            ref={inputRef}
            type="tel" 
            placeholder="- - - - - -" 
            className="ob-input-field email-mode" 
            value={code}
            onChange={handleInputChange}
            style={{ 
                letterSpacing: code.length > 0 ? '1rem' : '0.5rem', 
                fontSize: '1.5rem', 
                fontWeight: '700',
                textAlign: 'center',
                backgroundColor: 'transparent'
            }}
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