import { useState } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import { db } from '../../../../Firebase/config';
import { doc, runTransaction, arrayUnion, getDoc } from 'firebase/firestore'; 
import { toast } from 'react-toastify';
import { CircleNotch, ShieldCheck } from 'phosphor-react';
import PinModal from '../../../../components/Modal/PinModal'; 

const ReviewStep = ({ data, onBack, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [saveToBen, setSaveToBen] = useState(true);
  const [storedPin, setStoredPin] = useState(''); 

  const handleReviewClick = async () => {
    setIsLoading(true);
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            // Since they did onboarding, they definitely have a PIN. 
            if (userData.transactionPin) {
                setStoredPin(userData.transactionPin);
                setIsLoading(false);
                setIsPinOpen(true); // Pop open the verify modal
            } else {
                toast.error("Account error: No PIN found. Please contact support.");
                setIsLoading(false);
            }
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to verify account.");
        setIsLoading(false);
    }
  };

  const handlePinSuccess = async () => {
    setIsPinOpen(false); 
    setIsLoading(true); 
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

        if (data.recipient.isExternal) {  
            transaction.update(senderRef, senderUpdates);
        } else {
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
            <span style={{textTransform:'capitalize'}}>{data.recipient.bankName || 'Bridge Vault'}</span>
        </div>
        
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
        mode="verify"        
        expectedPin={storedPin} 
      />
    </div>
  );
};

export default ReviewStep;