import { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, WarningCircle, XCircle } from 'phosphor-react';

const Phase3_Vault = ({ formData, setFormData, nextPhase }) => {
  const [tag, setTag] = useState(formData.cashtag || '');
  const [status, setStatus] = useState('idle'); // 'idle', 'checking', 'available', 'invalid', 'taken'
  const [message, setMessage] = useState('Choose a unique tag for receiving money.');
  
  const debounceTimer = useRef(null);

  // The "Goofy" Name Generator
  const randomTags = [
    'FutureBillionaire', 'GucciFlipFlops', 'CheddarCheese', 
    'BrokeButCute', 'FundingSecured', 'OldMoney', 
    'MainCharacter', 'PizzaFund', 'CryptoKing', 'QuietLuxury'
  ];

  const handleGenerateVibe = () => {
    const random = randomTags[Math.floor(Math.random() * randomTags.length)];
    // Add a random 2 digit number sometimes to make it look realistic
    const suffix = Math.random() > 0.5 ? Math.floor(Math.random() * 99) : '';
    const newTag = `${random}${suffix}`;
    
    setTag(newTag);
    validateTag(newTag);
  };

  const handleTagChange = (e) => {
    // Strip out spaces and special characters instantly
    const cleanValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setTag(cleanValue);
    validateTag(cleanValue);
  };

  const validateTag = (value) => {
    // Clear previous timers
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (value.length === 0) {
      setStatus('idle');
      setMessage('Choose a unique tag for receiving money.');
      return;
    }

    if (value.length < 3) {
      setStatus('invalid');
      setMessage('Too short! Make it legendary (3+ chars).');
      return;
    }

    if (value.length > 15) {
      setStatus('invalid');
      setMessage('Whoa, too long! Keep it under 15 chars.');
      return;
    }

    // Set to checking state
    setStatus('checking');
    setMessage('Checking availability...');

    // Simulate Backend Network Request (Debounce)
    debounceTimer.current = setTimeout(() => {
      // Fake a "Taken" scenario if they type "admin" or "support"
      if (value.toLowerCase() === 'admin' || value.toLowerCase() === 'support') {
        setStatus('taken');
        setMessage('💀 Oof, that tag is reserved or taken.');
      } else {
        setStatus('available');
        setMessage('🔥 Available! That is a solid tag.');
      }
    }, 600); // 600ms network delay
  };

  const handleLockIn = () => {
    if (status !== 'available') return;
    
    // Save to Master State and move on
    setFormData({ ...formData, cashtag: tag });
    nextPhase();
  };

  // Dynamic UI colors based on state
  const getStatusColor = () => {
    if (status === 'available') return '#10B981'; // Green
    if (status === 'invalid' || status === 'taken') return '#EF4444'; // Red
    if (status === 'checking') return '#F59E0B'; // Orange
    return '#1F2937'; // Default Dark
  };

  const getStatusIcon = () => {
    if (status === 'available') return <CheckCircle size={20} weight="fill" color="#10B981" />;
    if (status === 'invalid' || status === 'taken') return <XCircle size={20} weight="fill" color="#EF4444" />;
    if (status === 'checking') return <WarningCircle size={20} weight="fill" color="#F59E0B" className="pulse-anim" />;
    return null;
  };

  return (
    <div className="phase-container animate-slide-left cashtag-phase-wrapper">
      
      <div className="cashtag-header">
        <h2 className="phase-title" style={{ textAlign: 'center', fontSize: '2rem' }}>Claim your tag</h2>
        <p className="phase-subtitle" style={{ textAlign: 'center' }}>How friends will find and pay you.</p>
      </div>

      {/* The Giant Input Area */}
      <div className="cashtag-input-area">
        <div className="cashtag-input-wrapper" style={{ color: getStatusColor() }}>
          <span className="cashtag-prefix">@</span>
          <input 
            type="text" 
            className="cashtag-giant-input"
            value={tag}
            onChange={handleTagChange}
            placeholder="cashtag"
            autoFocus
            maxLength={16}
          />
        </div>

        {/* Live Feedback Message */}
        <div className={`cashtag-feedback ${status}`}>
          {getStatusIcon()}
          <span style={{ color: getStatusColor() }}>{message}</span>
        </div>
      </div>

      {/* The Goofy Action Button */}
      <button className="vibe-generator-btn" onClick={handleGenerateVibe}>
        🎲 Generate a Vibe
      </button>

      {/* Push the button to the bottom using margin-top auto */}
      <div style={{ marginTop: 'auto', width: '100%', paddingTop: '3rem' }}>
        <button 
          className="btn-primary" 
          onClick={handleLockIn} 
          disabled={status !== 'available'}
          style={{ height: '3.5rem', fontSize: '1.125rem' }}
        >
          Lock in my Vault <ArrowRight size={24} weight="bold" />
        </button>
      </div>

    </div>
  );
};

export default Phase3_Vault;