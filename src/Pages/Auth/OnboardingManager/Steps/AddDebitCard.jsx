import { useState, useRef, useEffect } from 'react';
import { LockKey } from 'phosphor-react';
import '../Onboarding.css';

const AddDebitCard = ({ data, updateData, onNext }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState(data.zipCode || ''); 
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // 1. SMART FORMATTERS
  const formatCardNumber = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    val = val.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
    setCardNumber(val.slice(0, 19)); // 16 digits + 3 spaces
  };

  const formatExpDate = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
    setExpDate(val.slice(0, 5));
  };

  // 2. LUHN ALGORITHM (Rock Solid Version)
  const isLuhnValid = (num) => {
    let arr = (num + '').split('').reverse().map(x => parseInt(x, 10));
    let lastDigit = arr.shift(); // Remove and store the check digit
    let sum = arr.reduce((acc, val, i) => {
      if (i % 2 === 0) { // Every second digit (from the right)
         let doubled = val * 2;
         return acc + (doubled > 9 ? doubled - 9 : doubled);
      }
      return acc + val;
    }, 0);
    return (sum + lastDigit) % 10 === 0;
  };

  // 3. VALIDATION STATE (With built-in debugging)
  const isCardReady = () => {
    const rawCard = cardNumber.replace(/\D/g, '');
    
    const cardValid = rawCard.length >= 15 && isLuhnValid(rawCard);
    const expValid = expDate.length === 5;
    const cvvValid = cvv.length >= 3;
    const zipValid = zipCode.length >= 3;
    // console.log({ cardValid, expValid, cvvValid, zipValid });

    return cardValid && expValid && cvvValid && zipValid;
  };

  // 4. ACTION HANDLERS
  const handleLinkCard = () => {
    if (isCardReady()) {
      updateData('hasLinkedCard', true);
      onNext();
    }
  };

  const handleSkip = () => {
    updateData('hasLinkedCard', false);
    onNext();
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">Add a bank using your debit card</h1>
        <p className="ob-subtitle" style={{ marginBottom: '2rem' }}>
          Linking an external account allows you to move money in and out of your Bridge balance.
        </p>

        {/* 1. Card Number */}
        <label className="ob-small-label">Debit Card Number</label>
        <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1rem' }}>
          <input 
            ref={inputRef}
            type="tel" 
            placeholder="0000 0000 0000 0000" 
            className="ob-input-field email-mode"
            value={cardNumber}
            onChange={formatCardNumber}
          />
        </div>

        {/* 2. SIDE-BY-SIDE: Expiry & CVV */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
          {/* Using minWidth: 0 prevents flex blowouts on small screens */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <label className="ob-small-label">Expiry</label>
            <div className="ob-input-group" style={{ marginTop: '0' }}>
              <input 
                type="tel" 
                placeholder="MM/YY" 
                className="ob-input-field email-mode"
                value={expDate}
                onChange={formatExpDate}
                style={{ textAlign: 'left' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <label className="ob-small-label">CVV</label>
            <div className="ob-input-group" style={{ marginTop: '0' }}>
              <input 
                type="tel" 
                placeholder="3-digit CVV" 
                className="ob-input-field email-mode"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{ textAlign: 'left' }}
              />
            </div>
          </div>
        </div>

        {/* 3. ZIP Code */}
        <label className="ob-small-label">ZIP / Postal Code</label>
        <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="ZIP Code" 
            className="ob-input-field email-mode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.slice(0, 10))}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', fontSize: '0.875rem', fontWeight: '500' }}>
          <LockKey size={18} weight="fill" />
          <span>Secured with 256-bit encryption</span>
        </div>
      </div>

      {/* Stacked Bottom Actions (Kept from our viewport fix) */}
      <div className="bottom-action-bar stacked">
        <button className="ob-secondary-btn" onClick={handleSkip}>
          Skip
        </button>
        <button className="ob-next-btn" onClick={handleLinkCard} disabled={!isCardReady()}>
          Link Card
        </button>
      </div>
    </>
  );
};

export default AddDebitCard;