import { useState, useEffect } from 'react';
import { X, Backspace, LockKey } from 'phosphor-react';
import { toast } from 'react-toastify';
import './PinModal.css';

const PinModal = ({ isOpen, onClose, onSuccess, amount, mode = 'verify', expectedPin }) => {
  const [pin, setPin] = useState('');
  
  // SETUP MODE STATE:
  // step 1 = "Create PIN", step 2 = "Confirm PIN"
  const [setupStep, setSetupStep] = useState(1);
  const [firstPin, setFirstPin] = useState(''); 

  // Reset state whenever modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setSetupStep(1);
      setFirstPin('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNumClick = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    // --- MODE 1: VERIFY (Normal) ---
    if (mode === 'verify') {
      if (pin === expectedPin) {
        onSuccess(); // PIN Matched!
      } else {
        toast.error("Incorrect PIN");
        setPin(''); // Clear for retry
      }
    } 
    
    // --- MODE 2: SETUP (First Time) ---
    else if (mode === 'setup') {
      if (setupStep === 1) {
        // Finished first entry, move to confirmation
        setFirstPin(pin);
        setPin('');
        setSetupStep(2);
      } else {
        // Finished second entry, compare them
        if (pin === firstPin) {
          onSuccess(pin); // Pass the new PIN back to parent to save
        } else {
          toast.error("PINs do not match. Try again.");
          setPin('');
          setFirstPin('');
          setSetupStep(1); // Restart setup
        }
      }
    }
  };

  // Dynamic Text Helpers
  const getTitle = () => {
    if (mode === 'verify') return "Enter PIN";
    return setupStep === 1 ? "Create Transaction PIN" : "Confirm Your PIN";
  };

  const getSubtitle = () => {
    if (mode === 'verify') return `Confirm transfer of`;
    return setupStep === 1 ? "Secure your account" : "Re-enter to confirm";
  };

  return (
    <div className="modal-overlay">
      <div className="pin-modal-content">
        <div className="modal-header">
           <button onClick={onClose} className="close-btn"><X size={24}/></button>
           <h3>{getTitle()}</h3>
        </div>

        <div className="pin-display-section">
           <p>{getSubtitle()}</p>
           
           {/* Show Amount ONLY in Verify Mode */}
           {mode === 'verify' ? (
             <h2>${amount}</h2>
           ) : (
             <div style={{marginBottom: '24px'}}>
               <LockKey size={32} color="#111827" weight="fill"/>
             </div>
           )}
           
           <div className="dots-container">
             {[...Array(4)].map((_, i) => (
               <div key={i} className={`dot ${i < pin.length ? 'filled' : ''}`}></div>
             ))}
           </div>
        </div>

        <div className="numpad">
           {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
             <button key={num} onClick={() => handleNumClick(num)}>{num}</button>
           ))}
           <div className="empty-slot"></div>
           <button onClick={() => handleNumClick(0)}>0</button>
           <button onClick={handleDelete} className="del-btn"><Backspace size={24}/></button>
        </div>

        <button 
          className={`confirm-pin-btn ${pin.length === 4 ? 'active' : ''}`}
          onClick={handleSubmit}
          disabled={pin.length !== 4}
        >
          {mode === 'setup' && setupStep === 1 ? 'Next' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default PinModal;