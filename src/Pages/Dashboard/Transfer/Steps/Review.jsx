import { useState } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import { db } from '../../../../Firebase/config';
import { doc, runTransaction, arrayUnion, getDoc, updateDoc } from 'firebase/firestore'; 
import { toast } from 'react-toastify';
import { CircleNotch, ShieldCheck } from 'phosphor-react';
import PinModal from '../../../../components/Modal/PinModal'; 

const ReviewStep = ({ data, onBack, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  
  // NEW: User Decision State
  const [saveToBen, setSaveToBen] = useState(true); // Default to true, let them uncheck
  
  const [pinMode, setPinMode] = useState('verify'); 
  const [storedPin, setStoredPin] = useState(''); 

  // ... (handleReviewClick & handlePinSuccess remain the same) ...
  const handleReviewClick = async () => {
    setIsLoading(true);
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.transactionPin) {
                setPinMode('verify');
                setStoredPin(userData.transactionPin);
                setIsLoading(false);
                setIsPinOpen(true);
            } else {
                setPinMode('setup');
                setIsLoading(false);
                setIsPinOpen(true);
                toast.info("Please set a transaction PIN first.");
            }
        }
    } catch (error) {
        console.error(error);
        setIsLoading(false);
    }
  };

  const handlePinSuccess = async (newPin = null) => {
    setIsPinOpen(false); 
    setIsLoading(true); 

    if (pinMode === 'setup' && newPin) {
        try {
            await updateDoc(doc(db, "users", user.uid), { transactionPin: newPin });
        } catch (err) {
            toast.error("Failed to save PIN");
            setIsLoading(false);
            return;
        }
    }
    executeTransfer();
  };

  const executeTransfer = async () => {
    try {
      const sendAmount = parseFloat(data.amount);

      await runTransaction(db, async (transaction) => {
        const senderRef = doc(db, "users", user.uid);
        const senderDoc = await transaction.get(senderRef);
        if (!senderDoc.exists()) throw "Sender error";
        
        const newSenderBalance = senderDoc.data().balance - sendAmount;
        if (newSenderBalance < 0) throw "Insufficient Funds";

        const recipientRef = doc(db, "users", data.recipient.uid);
        const recipientDoc = await transaction.get(recipientRef);
        if (!recipientDoc.exists()) throw "Recipient error";

        const newRecipientBalance = recipientDoc.data().balance + sendAmount;

        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const debitRecord = {
          id: Math.random().toString(36).substr(2, 9),
          title: `Sent to ${data.recipient.fullName}`,
          date: date,
          amount: -sendAmount,
          type: 'debit',
          icon: 'P',
          timestamp: Date.now()
        };

        const creditRecord = {
          id: Math.random().toString(36).substr(2, 9),
          title: `Received from ${senderDoc.data().fullName}`,
          date: date,
          amount: sendAmount,
          type: 'credit',
          icon: 'W',
          timestamp: Date.now()
        };

        // 1. Update Balances & History (ALWAYS HAPPENS)
        transaction.update(senderRef, { 
            balance: newSenderBalance,
            transactions: arrayUnion(debitRecord) 
        });
        transaction.update(recipientRef, { 
            balance: newRecipientBalance,
            transactions: arrayUnion(creditRecord) 
        });

        // 2. Save Beneficiary (CONDITIONAL - THE POWER MOVE)
        if (saveToBen) {
            const beneficiaryData = {
                uid: data.recipient.uid,
                fullName: data.recipient.fullName,
                accountNumber: data.recipient.accountNumber,
                bankName: data.recipient.bankName || 'Opay', 
                lastSent: Date.now()
            };
            // We update the sender's doc to add this person
            transaction.update(senderRef, {
                beneficiaries: arrayUnion(beneficiaryData)
            });
        }
      });

      onSuccess(); 

    } catch (error) {
      console.error(error);
      toast.error("Transfer Failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="step-content animate-slide-up">
      <div className="review-card">
        <span className="review-label">Total Amount</span>
        <h1 className="review-amount">${parseFloat(data.amount).toLocaleString()}</h1>
        <div className="review-badge">No Fee</div>
      </div>

      <div className="review-details">
        <div className="detail-row">
            <span>To</span>
            <div className="recipient-mini">
                <div className="mini-avatar">{data.recipient.fullName.charAt(0)}</div>
                <span>{data.recipient.fullName}</span>
            </div>
        </div>
        <div className="detail-row">
            <span>Bank</span>
            <span style={{textTransform:'capitalize'}}>{data.recipient.bankName || 'Citibank'}</span>
        </div>
        
        {/* --- THE TOGGLE SWITCH --- */}
        <div className="detail-row">
            <span>Save Beneficiary</span>
            <label className="toggle-switch">
                <input 
                    type="checkbox" 
                    checked={saveToBen} 
                    onChange={(e) => setSaveToBen(e.target.checked)}
                />
                <span className="slider round"></span>
            </label>
        </div>

        <div className="detail-row">
            <span>Note</span>
            <span>{data.note || 'Transfer'}</span>
        </div>
      </div>

      <div className="security-note">
        <ShieldCheck size={18} weight="fill" color="#10B981" />
        <span>Secure Transfer via Dwolla Protocol</span>
      </div>

      <button 
        className="main-btn confirm-btn" 
        onClick={handleReviewClick} 
        disabled={isLoading}
      >
        {isLoading ? <CircleNotch className="spin" size={24}/> : 'Confirm & Send'}
      </button>

      <PinModal 
        isOpen={isPinOpen} 
        onClose={() => {
            setIsPinOpen(false);
            setIsLoading(false);
        }}
        onSuccess={handlePinSuccess} 
        amount={data.amount}
        mode={pinMode}         
        expectedPin={storedPin} 
      />
    </div>
  );
};

export default ReviewStep;