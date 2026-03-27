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

        // 1. CREATE AUTH USER (If they used EmailJS, they don't have an auth profile yet!)
        if (!user) {
          // Firebase requires 6 chars for a password. We use their PIN + a secret salt
          const securePassword = `${data.pin}Bridge!`; 
          const cred = await createUserWithEmailAndPassword(auth, data.phoneOrEmail, securePassword);
          user = cred.user;
        }

        // 2. UPDATE PROFILE NAME
        const fullName = `${data.legalFirstName} ${data.legalLastName}`;
        await updateProfile(user, { displayName: fullName });

        // 3. GENERATE BANK DETAILS
        const accountNumber = '30' + Math.floor(10000000 + Math.random() * 90000000).toString();

        // 4. WRITE THE MASSIVE PAYLOAD TO FIRESTORE
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          emailOrPhone: data.phoneOrEmail,
          fullName: fullName,
          dob: data.dob,
          country: data.countryCode,
          currency: data.currency,
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
          balance: 50000.00, // Dummy seed money!
          isMainFrozen: false,
          isVerified: true,
          createdAt: new Date().toISOString(),
          transactions: [],
          cards: [] // They can generate virtual cards in the dashboard
        });

        // 5. CLEANUP & ROUTE
        setIsDone(true);
        setTimeout(() => {
          sessionStorage.removeItem('ob_data');
          sessionStorage.removeItem('ob_step');
          localStorage.setItem('has_seen_onboarding', 'true');
          navigate('/'); // Boom. Welcome to the Dashboard.
        }, 1500);

      } catch (error) {
        console.error("Account Creation Error:", error);
        toast.error("Failed to finalize account. Please try again.");
      }
    };

    createAccount();
  }, []); // Run exactly once on mount

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