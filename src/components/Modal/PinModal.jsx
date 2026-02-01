import { useState } from 'react';
import { X, Backspace } from 'phosphor-react';
import './PinModal.css';

const PinModal = ({ isOpen, onClose, onConfirm, amount }) => {
  const [pin, setPin] = useState('');

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
    if (pin.length === 4) {
      onConfirm(); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="pin-modal-content">
        <div className="modal-header">
           <button onClick={onClose} className="close-btn"><X size={24}/></button>
           <h3>Enter PIN</h3>
        </div>

        <div className="pin-display-section">
           <p>Confirm transfer of</p>
           <h2>${amount}</h2>
           
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
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PinModal;