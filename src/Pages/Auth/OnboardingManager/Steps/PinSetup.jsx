import { useState } from 'react';
import { Backspace } from 'phosphor-react';
import { toast } from 'react-toastify';
import '../Onboarding.css';

const PinSetup = ({ data, updateData, onNext }) => {
  const [step, setStep] = useState(1); 
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isError, setIsError] = useState(false);

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
    ? "Create a Cash PIN to help secure your personal account" 
    : "Please confirm your Cash PIN";

  return (
    <div style={{ height: 'calc(100vh - 120px)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ height: '160px', width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
        <h1 className="pin-title" style={{ fontSize: '20px', marginBottom: '24px', textAlign: 'center' }}>{title}</h1>
        
        <div className={`pin-dots-container ${isError ? 'shake-animation' : ''}`} style={{ display: 'flex', gap: '20px', height: '24px', alignItems: 'center' }}>
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`pin-dot ${i < currentInput.length ? 'filled' : ''}`}
            ></div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '40px', width: '100%' }}>
        <div className="ob-numpad-grid" style={{ maxWidth: '280px', margin: '0 auto', gap: '16px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} className="numpad-btn" onClick={() => handleNumClick(num.toString())}>
              {num}
            </button>
          ))}
          <div className="numpad-empty"></div>
          <button className="numpad-btn" onClick={() => handleNumClick('0')}>0</button>
          <button className="numpad-btn delete-btn" onClick={handleDelete}>
            <Backspace size={32} weight="fill" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default PinSetup;