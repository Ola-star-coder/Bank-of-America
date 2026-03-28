import { useState, useRef, useEffect } from 'react';
import { CircleNotch, CheckCircle, XCircle, Info } from 'phosphor-react';
import { db } from '../../../../Firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../Onboarding.css';

const Cashtag = ({ data, updateData, onNext }) => {
  const [cashtag, setCashtag] = useState(data.cashtag || '');
  const [status, setStatus] = useState('idle'); // 'idle', 'typing', 'checking', 'available', 'taken', 'short', 'error'
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // REAL DATABASE QUERY
  useEffect(() => {
    if (cashtag.length === 0) {
      setStatus('idle');
      return;
    }

    if (cashtag.length > 0 && cashtag.length < 3) {
      setStatus('short');
      return;
    }

    setStatus('checking');

    // Wait 600ms after they stop typing before hitting Firebase to save reads
    const checkAvailability = setTimeout(async () => {
      try {
        const q = query(collection(db, "users"), where("cashtag", "==", cashtag));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setStatus('taken');
        } else {
          setStatus('available');
        }
      } catch (error) {
        console.error("Error checking cashtag:", error);
        setStatus('error');
      }
    }, 600); 

    return () => clearTimeout(checkAvailability);
  }, [cashtag]);

  const handleInputChange = (e) => {
    setStatus('typing');
    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 20);
    setCashtag(val);
  };

  const handleNextClick = () => {
    if (status === 'available') {
      updateData('cashtag', cashtag);
      onNext();
    }
  };

  const renderFeedback = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="feedback-message" style={{ color: '#6B7280' }}>
            <CircleNotch size={16} className="spin" />
            <span>Checking availability...</span>
          </div>
        );
      case 'available':
        return (
          <div className="feedback-message" style={{ color: '#10B981' }}>
            <CheckCircle size={16} weight="fill" />
            <span>Looks great! <b>${cashtag}</b> is yours.</span>
          </div>
        );
      case 'taken':
        return (
          <div className="feedback-message" style={{ color: '#EF4444' }}>
            <XCircle size={16} weight="fill" />
            <span>Bummer. <b>${cashtag}</b> is already taken.</span>
          </div>
        );
      case 'short':
        return (
          <div className="feedback-message" style={{ color: '#F59E0B' }}>
            <Info size={16} weight="fill" />
            <span>Cashtags must be at least 3 characters.</span>
          </div>
        );
      case 'error':
        return (
          <div className="feedback-message" style={{ color: '#EF4444' }}>
            <XCircle size={16} weight="fill" />
            <span>Network error. Please try again.</span>
          </div>
        );
      default:
        return <div className="feedback-message" style={{ opacity: 0 }}>Placeholder</div>;
    }
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">Choose a $Cashtag</h1>
        <p className="ob-subtitle" style={{ marginBottom: '2rem' }}>
          You will be able to change this later in settings.
        </p>

        <div 
          className="ob-input-group" 
          style={{ 
            marginTop: '0', 
            marginBottom: '0.75rem',
            display: 'flex', 
            alignItems: 'center',
            borderColor: status === 'available' ? '#10B981' : status === 'taken' ? '#EF4444' : '#E5E7EB',
            transition: 'border-color 0.3s ease'
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: status === 'available' ? '#10B981' : '#111827', paddingLeft: '1rem', transition: 'color 0.3s ease' }}>$</span>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Cashtag" 
            className="ob-input-field email-mode"
            value={cashtag}
            onChange={handleInputChange}
            style={{ paddingLeft: '0.25rem', fontWeight: '600' }}
            spellCheck="false"
            autoCapitalize="none"
          />
        </div>

        {renderFeedback()}
      </div>

      <div className="bottom-action-bar">
        <button 
          className="ob-next-btn" 
          onClick={handleNextClick} 
          disabled={status !== 'available'}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Cashtag;