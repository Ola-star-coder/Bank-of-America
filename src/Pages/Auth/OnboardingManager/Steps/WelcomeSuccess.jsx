import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CircleNotch } from 'phosphor-react';
import { auth, db } from '../../../../Firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../Onboarding.css';

const WelcomeSuccess = ({ data }) => {
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const createAccount = async () => {
      try {
        let user = auth.currentUser;

        if (!user) {
          const securePassword = `${data.pin}Bridge!`; 
          
          // FIX: If they used a phone number, make it look like an email so Firebase accepts it
          let authEmail = data.phoneOrEmail;
          if (!authEmail.includes('@')) {
            authEmail = `${authEmail.replace(/[^0-9]/g, '')}@bridge.temp`;
          }

          const cred = await createUserWithEmailAndPassword(auth, authEmail, securePassword);
          user = cred.user;
        }

        const fullName = `${data.legalFirstName} ${data.legalLastName}`;
        await updateProfile(user, { displayName: fullName });

        const accountNumber = '30' + Math.floor(10000000 + Math.random() * 90000000).toString();

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          emailOrPhone: data.phoneOrEmail,
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
          sessionStorage.removeItem('ob_data');
          sessionStorage.removeItem('ob_step');
          localStorage.setItem('has_seen_onboarding', 'true');
          navigate('/'); 
        }, 1500);

      } catch (error) {
        console.error("Account Creation Error:", error);
        // FIX: Now it will tell you EXACTLY what failed in the red toast
        toast.error(`Failed: ${error.message}`); 
      }
    };

    createAccount();
  }, []); 

  return (
    <div className="onboarding-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', paddingBottom: 0 }}>
      {isDone ? (
        <CheckCircle size={80} weight="fill" color="#10B981" className="animate-fade-in" style={{ marginBottom: '1rem' }} />
      ) : (
        <CircleNotch size={64} color="#111827" className="spin" style={{ marginBottom: '1rem' }} />
      )}
      <h1 className="ob-title" style={{ textAlign: 'center', fontSize: '24px' }}>
        {isDone ? 'Welcome to Bridge!' : 'Building your vault...'}
      </h1>
    </div>
  );
};

export default WelcomeSuccess;