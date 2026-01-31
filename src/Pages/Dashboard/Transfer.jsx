import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/config';
import { 
  collection, query, where, getDocs, 
  runTransaction, doc, serverTimestamp, arrayUnion 
} from 'firebase/firestore'; 
import { ArrowLeft, CheckCircle, Warning, CircleNotch } from 'phosphor-react';
import { toast } from 'react-toastify';
import './Transfer.css';

const Transfer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [accountNum, setAccountNum] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  
  // Logic State
  const [recipient, setRecipient] = useState(null); // Stores found user data
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. SEARCH FOR RECIPIENT
  const handleSearch = async () => {
    if (accountNum.length < 10) return;
    
    setIsSearching(true);
    setRecipient(null);

    try {
      // Query Firestore: Find user where 'accountNumber' matches input
      const q = query(collection(db, "users"), where("accountNumber", "==", accountNum));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const foundUser = querySnapshot.docs[0].data();
        
        // Prevent sending to yourself
        if (foundUser.uid === user.uid) {
           toast.warning("You cannot send money to yourself!");
           setRecipient(null);
        } else {
           setRecipient(foundUser); // Save found user
        }
      } else {
        toast.error("Account not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error searching for user.");
    } finally {
      setIsSearching(false);
    }
  };

  // 2. EXECUTE TRANSFER (The "Atomic" Transaction)
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipient) return toast.error("Please verify recipient first.");
    
    const sendAmount = parseFloat(amount);
    if (isNaN(sendAmount) || sendAmount <= 0) return toast.error("Enter a valid amount.");

    setLoading(true);

    try {
      await runTransaction(db, async (transaction) => {
        // A. Get fresh data for SENDER (You)
        const senderRef = doc(db, "users", user.uid);
        const senderDoc = await transaction.get(senderRef);
        
        if (!senderDoc.exists()) throw "Sender does not exist!";
        
        const senderData = senderDoc.data();
        const newSenderBalance = senderData.balance - sendAmount;

        // B. Check Funds
        if (newSenderBalance < 0) {
          throw "Insufficient Funds"; // This cancels the whole transaction
        }

        // C. Get fresh data for RECIPIENT
        const recipientRef = doc(db, "users", recipient.uid);
        const recipientDoc = await transaction.get(recipientRef);
        if (!recipientDoc.exists()) throw "Recipient account deleted!";

        const recipientData = recipientDoc.data();
        const newRecipientBalance = recipientData.balance + sendAmount;

        // D. CREATE RECEIPT OBJECTS
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const debitRecord = {
          id: Math.random().toString(36).substr(2, 9),
          title: `Sent to ${recipient.fullName}`,
          date: date,
          amount: -sendAmount, // Negative for you
          type: 'debit',
          icon: 'P', // 'P' for PaperPlane
          timestamp: Date.now()
        };

        const creditRecord = {
          id: Math.random().toString(36).substr(2, 9),
          title: `Received from ${senderData.fullName}`,
          date: date,
          amount: sendAmount, // Positive for them
          type: 'credit',
          icon: 'W', // 'W' for Wallet
          timestamp: Date.now()
        };

        // E. WRITE TO DATABASE (Update Balances + Add History)
        transaction.update(senderRef, { 
            balance: newSenderBalance,
            transactions: arrayUnion(debitRecord) // Add to your history
        });

        transaction.update(recipientRef, { 
            balance: newRecipientBalance,
            transactions: arrayUnion(creditRecord) // Add to their history
        });
      });

      // F. Success!
      toast.success(`Successfully sent $${sendAmount} to ${recipient.fullName}`);
      navigate('/'); // Go back home
      
    } catch (error) {
      console.error("Transaction failed: ", error);
      if (error === "Insufficient Funds") {
        toast.error("Insufficient Funds for this transaction.");
      } else {
        toast.error("Transfer failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-container">
      <header className="transfer-header">
        <button onClick={() => navigate('/')} className="back-btn">
            <ArrowLeft size={24} />
        </button>
        <h2>Send Money</h2>
      </header>

      <div className="transfer-content">
        <form onSubmit={handleTransfer}>
            
            {/* 1. Account Number Input */}
            <div className="input-block">
                <label>Recipient Account</label>
                <div className="search-wrapper">
                    <input 
                        type="tel" 
                        placeholder="Enter 10-digit Account Number"
                        value={accountNum}
                        onChange={(e) => {
                            setAccountNum(e.target.value);
                            setRecipient(null); // Reset if they type new numbers
                        }}
                        maxLength={10}
                    />
                    {/* Auto-search button */}
                    {accountNum.length === 10 && !recipient && (
                        <button 
                            type="button" 
                            className="verify-btn" 
                            onClick={handleSearch}
                            disabled={isSearching}
                        >
                            {isSearching ? <CircleNotch className="spin" /> : 'Verify'}
                        </button>
                    )}
                </div>
            </div>

            {/* Recipient Found Card */}
            {recipient && (
                <div className="recipient-card">
                    <div className="r-avatar">
                        {recipient.fullName.charAt(0)}
                    </div>
                    <div className="r-info">
                        <h4>{recipient.fullName}</h4>
                        <span>Verified Recipient <CheckCircle size={14} weight="fill" color="#00D632"/></span>
                    </div>
                </div>
            )}

            {/* 2. Amount Input */}
            <div className="input-block">
                <label>Amount</label>
                <div className="amount-wrapper">
                    <span className="currency">$</span>
                    <input 
                        type="number" 
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </div>

            {/* 3. Note Input */}
            <div className="input-block">
                <label>What's this for? (Optional)</label>
                <input 
                    type="text" 
                    placeholder="Dinner, Rent, Gift..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="note-input"
                />
            </div>

            <button 
                type="submit" 
                className="send-btn" 
                disabled={loading || !recipient}
            >
                {loading ? <CircleNotch size={24} className="spin" /> : 'Send Money'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;