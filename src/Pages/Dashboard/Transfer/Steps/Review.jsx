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
      if (isNaN(sendAmount)) { toast.error("Invalid Amount"); return; }

      await runTransaction(db, async (transaction) => {
        const senderRef = doc(db, "users", user.uid);
        const senderDoc = await transaction.get(senderRef);
        if (!senderDoc.exists()) throw "Sender error";
        
        const currentSenderBalance = parseFloat(senderDoc.data().balance);
        const newSenderBalance = currentSenderBalance - sendAmount;
        if (newSenderBalance < 0) throw "Insufficient Funds";

        // 2. Prepare Debit Record (For You)
        const debitRecord = {
            id: 'tx_' + Date.now(),
            type: 'debit',
            amount: sendAmount,
            title: data.recipient.isExternal 
                   ? `Transfer to ${data.recipient.bankName}` 
                   : `Transfer to ${data.recipient.fullName}`,
            recipientName: data.recipient.fullName,
            timestamp: Date.now(),
            status: 'success'
        };

        const senderUpdates = {
            balance: newSenderBalance,
            transactions: arrayUnion(debitRecord)
        };

        // 3. Handle External vs Internal
        if (data.recipient.isExternal) {  
            transaction.update(senderRef, senderUpdates);
            
        } else {
            // --- INTERNAL TRANSFER (APP USER) ---
            const recipientRef = doc(db, "users", data.recipient.uid);
            const recipientDoc = await transaction.get(recipientRef);
            if (!recipientDoc.exists()) throw "Recipient error";

            const currentRecipientBalance = parseFloat(recipientDoc.data().balance);
            const newRecipientBalance = currentRecipientBalance + sendAmount;

            const creditRecord = {
                id: 'tx_' + Date.now() + '_r',
                type: 'credit',
                amount: sendAmount,
                title: `Received from ${user.displayName || 'User'}`,
                senderName: user.displayName || 'User',
                timestamp: Date.now(),
                status: 'success'
            };

            // Update Sender
            // (Beneficiary logic goes here if you kept it)
            transaction.update(senderRef, senderUpdates);
            transaction.update(recipientRef, { 
                balance: newRecipientBalance,
                transactions: arrayUnion(creditRecord) 
            });
        }
      });

      onSuccess(); 

    } catch (error) {
      console.error(error);
      toast.error("Transfer Failed: " + error);
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