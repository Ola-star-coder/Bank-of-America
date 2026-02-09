import { useState } from 'react';
import { CircleNotch, CheckCircle, User, ArrowsLeftRight, ClipboardText } from 'phosphor-react';
import { toast } from 'react-toastify';

const BankInputStep = ({ bank, onNext }) => {
  const [formValues, setFormValues] = useState({});
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  
  const [verifying, setVerifying] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 1. Exchange Rate Helper (Fake logic for demo)
  const getExchangeRate = () => {
      const rates = { EUR: 0.92, GBP: 0.79, SGD: 1.34, JPY: 150.5, USD: 1 };
      return rates[bank.currency] || 1;
  };

  // 2. Clipboard Paste Handler
  const handlePaste = async (fieldName) => {
      try {
          const text = await navigator.clipboard.readText();
          if (text) {
              setFormValues(prev => ({ ...prev, [fieldName]: text }));
              toast.success("Pasted from clipboard");
          }
      } catch (err) {
          toast.error("Clipboard permission denied");
      }
  };

  const handleInputChange = (field, value) => {
      setFormValues(prev => ({ ...prev, [field]: value }));
      setIsValid(false); 
  };

  const handleVerify = () => {
    // Basic Checks
    if (!amount || parseFloat(amount) <= 0) return toast.error("Enter a valid amount");
    if (!recipientName || recipientName.length < 3) return toast.error("Recipient name required");

    // Regex Checks from Global.js
    for (let field of bank.fields) {
        const value = formValues[field.name] || '';
        if (!field.regex.test(value)) {
            return toast.error(field.error); 
        }
    }
    
    // Simulate Network API Call
    setVerifying(true);
    setTimeout(() => {
        setVerifying(false);
        setIsValid(true);
        toast.success("Account Verified");
    }, 1500);
  };

  const handleContinue = () => {
      if (!isValid) return;
      
      const displayAccountNum = bank.fields.map(f => formValues[f.name]).join(' / ');

      onNext({
          amount: amount,
          recipient: {
              fullName: recipientName,
              bankName: bank.name,
              accountNumber: displayAccountNum, 
              uid: 'bank_transfer_external', 
              isExternal: true
          }
      });
  };

  return (
    <div className="step-content animate-slide-up">
        
        {/* Selected Bank Header */}
        <div className="selected-bank-badge">
            <div className="bank-logo-small" style={{backgroundColor: bank.logoColor}}>
                {bank.logoInitial}
            </div>
            <span>{bank.name} ({bank.currency})</span>
            <span style={{marginLeft:'auto', fontSize:'18px'}}>{bank.flag}</span>
        </div>

        {/* Amount Input */}
        <label className="input-label">Amount (USD)</label>
        <div className="vivid-input-group">
            <span className="currency-prefix">$</span>
            <input 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="amount-input-field"
            />
        </div>

        {/* Exchange Rate Widget (Only if not USD) */}
        {bank.currency !== 'USD' && (
            <div className="fx-rate-widget">
                <div className="fx-icon"><ArrowsLeftRight size={14} weight="bold"/></div>
                <span>1 USD ≈ {getExchangeRate()} {bank.currency}</span>
            </div>
        )}

        <div style={{marginBottom:'24px'}}></div>

        {/* Recipient Name */}
        <label className="input-label">Recipient Name</label>
        <div className="vivid-input-group">
            <User size={20} color="#9CA3AF" />
            <input 
                type="text" 
                placeholder="Full Legal Name" 
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
            />
        </div>

        {/* Dynamic Bank Fields */}
        {bank.fields.map(field => (
            <div key={field.name} style={{marginTop:'16px'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <label className="input-label">{field.label}</label>
                    {/* Tiny Paste Button */}
                    {!formValues[field.name] && (
                        <button className="paste-text-btn" onClick={() => handlePaste(field.name)}>
                            <ClipboardText size={14}/> Paste
                        </button>
                    )}
                </div>
                <div className="vivid-input-group">
                    <input 
                        type="text" 
                        placeholder={field.placeholder}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                </div>
            </div>
        ))}

        {/* Verify / Continue Button */}
        <div style={{marginTop:'32px'}}>
            {!isValid ? (
                <button 
                    className="main-btn" 
                    onClick={handleVerify} 
                    disabled={verifying}
                    style={{background: verifying ? '#E5E7EB' : '#1C1C1E', color: verifying ? '#9CA3AF' : 'white'}}
                >
                    {verifying ? <CircleNotch className="spin" size={20}/> : 'Verify Details'}
                </button>
            ) : (
                <button className="main-btn" onClick={handleContinue} style={{background:'#10B981'}}>
                    <CheckCircle size={20} weight="bold" style={{marginRight:8}}/>
                    Confirm & Continue
                </button>
            )}
        </div>

    </div>
  );
};

export default BankInputStep;