import { useState } from 'react';
import { useAuth } from '../../../../Context/AuthContext'; // Note the path depth!
import { db } from '../../../../Firebase/config';
import { doc, runTransaction, arrayUnion } from 'firebase/firestore'; 
import { toast } from 'react-toastify';
import { CircleNotch, CaretRight, ShieldCheck } from 'phosphor-react';
import PinModal from '../../../../components/Modal/PinModal'; // Import your Modal

const ReviewStep = ({ data, onBack, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);

  // The Big Logic: Moving the Money (Atomic Transaction)
  const executeTransfer = async () => {
    setIsPinOpen(false); // Close modal
    setIsLoading(true);  // Start spinner

    try {
      const sendAmount = parseFloat(data.amount);

      await runTransaction(db, async (transaction) => {
        // 1. Get Sender (You)
        const senderRef = doc(db, "users", user.uid);
        const senderDoc = await transaction.get(senderRef);
        if (!senderDoc.exists()) throw "Sender error";
        
        const newSenderBalance = senderDoc.data().balance - sendAmount;
        if (newSenderBalance < 0) throw "Insufficient Funds";

        // 2. Get Recipient
        const recipientRef = doc(db, "users", data.recipient.uid);
        const recipientDoc = await transaction.get(recipientRef);
        if (!recipientDoc.exists()) throw "Recipient error";

        const newRecipientBalance = recipientDoc.data().balance + sendAmount;

        // 3. Create Receipts
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

        // 4. Update Database
        transaction.update(senderRef, { 
            balance: newSenderBalance,
            transactions: arrayUnion(debitRecord) 
        });
        transaction.update(recipientRef, { 
            balance: newRecipientBalance,
            transactions: arrayUnion(creditRecord) 
        });
      });

      // Success!
      onSuccess(); // Go to Step 3 (Receipt)

    } catch (error) {
      console.error(error);
      toast.error(error === "Insufficient Funds" ? "Insufficient Funds" : "Transfer Failed");
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
            <span>{data.recipient.bankName || 'Opay'}</span>
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
        onClick={() => setIsPinOpen(true)} // Open PIN Modal
        disabled={isLoading}
      >
        {isLoading ? <CircleNotch className="spin" size={24}/> : 'Confirm & Send'}
      </button>

      {/* The PIN Modal Lives Here */}
      <PinModal 
        isOpen={isPinOpen} 
        onClose={() => setIsPinOpen(false)}
        onConfirm={executeTransfer} // If PIN is correct, run this
        amount={data.amount}
      />
    </div>
  );
};

export default ReviewStep;