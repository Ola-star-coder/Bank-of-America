import { useState } from 'react';
import { Backspace } from 'phosphor-react';
import { toast } from 'react-toastify';
import '../Onboarding.css'; // Assuming this imports the styles

const PinSetup = ({ data, updateData, onNext }) => {
  const [step, setStep] = useState(1); 
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isError, setIsError] = useState(false);

  // Core Haptics and Security Checks (Keep Existing Logic)
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]); 
    }
  };

  const checkWeakPin = (testPin) => {
    if (/^(\d)\1{3}$/.test(testPin)) return "PIN cannot be repeating numbers.";
    const seqForward = "0123456789";
    const seqBackward = "9876543210";
    if (seqForward.includes(testPin) || seqBackward.includes(testPin)) {
      return "PIN cannot be sequential.";
    }
    if (data?.dob) {
      const birthYear = data.dob.slice(-4); 
      if (testPin === birthYear) return "PIN cannot be your birth year.";
    }
    return null; 
  };

  const handleNumClick = (num) => {
    if (isError) return;
    if (step === 1) {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPin(newPin);
        if (newPin.length === 4) {
          const weakError = checkWeakPin(newPin);
          if (weakError) {
            setIsError(true);
            toast.error(weakError);
            triggerHaptic();
            setTimeout(() => {
              setPin('');
              setIsError(false);
            }, 800);
          } else {
            setTimeout(() => setStep(2), 300);
          }
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const newConfirm = confirmPin + num;
        setConfirmPin(newConfirm);
        if (newConfirm.length === 4) {
          verifyPin(newConfirm);
        }
      }
    }
  };

  const handleDelete = () => {
    if (isError) return;
    if (step === 1) {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const verifyPin = (finalConfirm) => {
    if (pin === finalConfirm) {
      updateData('pin', pin);
      setTimeout(() => onNext(), 300); 
    } else {
      setIsError(true);
      toast.error("PINs do not match. Try again.");
      triggerHaptic();
      setTimeout(() => {
        setPin('');
        setConfirmPin('');
        setStep(1);
        setIsError(false);
      }, 800);
    }
  };

  const currentInput = step === 1 ? pin : confirmPin;
  const title = step === 1 
    ? "Create a Cash PIN to secure your global account" 
    : "Please confirm your Cash PIN";

  // FIX: The new JSX structures for the four input boxes and the clean keypad
  return (
    <div className="onboarding-content ob-pin-screen-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', width: '100vw', padding: 0, margin: 0, overflow: 'hidden', background: '#FFFFFF' }}>
      
      {/* Wrapper to align title and boxes, but stop them before the keyboard */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '340px', padding: '0 20px', transform: 'translateY(-5vh)' }}>
        
        <h1 className="pin-title pin-setup-title" style={{ fontSize: '20px', marginBottom: '32px', textAlign: 'center' }}>{title}</h1>
        
        {/* FIX: New four square input boxes */}
        <div className={`new-pin-input-container ${isError ? 'shake-animation' : ''}`}>
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`new-pin-box ${i < currentInput.length ? 'filled' : ''}`}
            >
              {/* Show an asterisk only for filled boxes */}
              {i < currentInput.length ? '*' : ''}
            </div>
          ))}
        </div>
      </div>

      {/* FIX: Overhauled numeric keypad, centered and text-based */}
      <div style={{ marginTop: '20px', width: '100%', maxWidth: '300px' }}>
        <div className="ob-numpad-grid new-numpad-style" style={{ gap: '1rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} className="numpad-btn clean-btn" onClick={() => handleNumClick(num.toString())}>
              {num}
            </button>
          ))}
          {/* Bottom row constraints: Excluded biometrics, centered 0, kept backspace */}
          <div className="numpad-empty"></div> {/* Space where biometric icon would be */}
          <button className="numpad-btn clean-btn" onClick={() => handleNumClick('0')}>0</button>
          <button className="numpad-btn clean-btn delete-btn" onClick={handleDelete}>
            <Backspace size={32} weight="fill" color="#111827" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default PinSetup;