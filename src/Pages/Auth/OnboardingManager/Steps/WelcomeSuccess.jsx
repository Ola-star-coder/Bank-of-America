import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CircleNotch, XCircle } from 'phosphor-react';
import { auth, db } from '../../../../Firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../Onboarding.css';

const WelcomeSuccess = ({ data }) => {
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Use a ref to ensure this only runs once (React Strict Mode double-fire protection)
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const createAccount = async () => {
      try {
        let user = auth.currentUser;

        if (!user) {
          // The new Deterministic Password logic
          const hiddenAuthPassword = `Bridge_Auth_2026_${data.phoneOrEmail}!`; 
          const cred = await createUserWithEmailAndPassword(auth, data.phoneOrEmail, hiddenAuthPassword);
          user = cred.user;
        }

        const fullName = `${data.legalFirstName} ${data.legalLastName}`;
        await updateProfile(user, { displayName: fullName });

        const accountNumber = '30' + Math.floor(10000000 + Math.random() * 90000000).toString();

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: data.phoneOrEmail,
          fullName: fullName,
          dob: data.dob,
          country: data.countryCode || 'US',
          currency: data.currency || 'USD',
          address: {
            line1: data.addressLine || '',
            city: data.city || '',
            state: data.stateRegion || '',
            zip: data.zipCode || ''
          },
          kycId: data.kycId,
          cashtag: data.cashtag,
          transactionPin: data.pin,
          hasLinkedCard: data.hasLinkedCard || false,
          wantsPhysicalCard: data.wantsPhysicalCard || false,
          contactsSynced: data.contactsSynced || false,
          accountNumber: accountNumber,
          balance: 50000.00, 
          isMainFrozen: false,
          isVerified: true,
          createdAt: new Date().toISOString(),
          transactions: [],
          cards: [] 
        });

        setIsDone(true);
        setTimeout(() => {
          localStorage.removeItem('ob_draft_data');
          localStorage.removeItem('ob_draft_step');
          localStorage.setItem('has_seen_onboarding', 'true');
          navigate('/'); 
        }, 1500);

      } catch (error) {
        console.error("Account Creation Error:", error);
        
        // FIX: Handle the error so it stops spinning!
        setIsError(true);
        if (error.code === 'auth/email-already-in-use') {
          setErrorMsg("This email is already registered.");
        } else {
          setErrorMsg(error.message);
        }
        toast.error("Failed to build account."); 
      }
    };

    createAccount();
  }, [data, navigate]); 

  // Reset function if they hit an error
  const handleStartOver = () => {
    localStorage.removeItem('ob_draft_data');
    localStorage.removeItem('ob_draft_step');
    navigate('/welcome');
  };

  return (
    <div className="onboarding-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', width: '100vw', padding: 0, margin: 0, overflow: 'hidden' }}>
      
      {/* Wrapper to perfectly center and prevent wobble */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-10vh)', width: '100%' }}>
        
        {isError ? (
          <XCircle size={80} weight="fill" color="#EF4444" className="animate-fade-in" style={{ marginBottom: '16px' }} />
        ) : isDone ? (
          <CheckCircle size={80} weight="fill" color="#10B981" className="animate-fade-in" style={{ marginBottom: '16px' }} />
        ) : (
          <CircleNotch size={64} color="#111827" className="spin" style={{ marginBottom: '16px' }} />
        )}
        
        <h1 className="ob-title" style={{ textAlign: 'center', fontSize: '24px', margin: 0, padding: '0 20px' }}>
          {isError ? 'Setup Failed' : isDone ? 'Welcome to Bridge!' : 'Building Bridge...'}
        </h1>

        {isError && (
          <>
            <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginTop: '8px', padding: '0 20px' }}>
              {errorMsg}
            </p>
            <button 
              className="ob-next-btn" 
              onClick={handleStartOver}
              style={{ marginTop: '24px', width: '200px', height: '48px' }}
            >
              Start Over
            </button>
          </>
        )}
      </div>

    </div>
  );
};

export default WelcomeSuccess;