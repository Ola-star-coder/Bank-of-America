import { useState } from 'react';
import { CircleNotch, MagnifyingGlass, CheckCircle, User } from 'phosphor-react';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { db } from '../../../../Firebase/config';
import { toast } from 'react-toastify';

const InputStep = ({ onNext, initialData }) => {
  const [accountNum, setAccountNum] = useState(initialData.accountNum || '');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [recipient, setRecipient] = useState(initialData.recipient || null);
  const [isSearching, setIsSearching] = useState(false);
  const [note, setNote] = useState(initialData.note || '');

  // 1. Search Logic (Same as before, but cleaner)
  const handleSearch = async () => {
    if (accountNum.length < 10) return;
    setIsSearching(true);
    setRecipient(null);

    try {
      const q = query(collection(db, "users"), where("accountNumber", "==", accountNum));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const foundUser = querySnapshot.docs[0].data();
        setRecipient(foundUser);
        toast.success("User Verified!");
      } else {
        toast.error("Account not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Validate and go to Next Step (Review)
  const handleContinue = (e) => {
    e.preventDefault();
    if (!recipient || !amount) {
      return toast.error("Please fill in all details.");
    }
    // Pass data up to the parent
    onNext({ accountNum, amount, recipient, note });
  };

  return (
    <div className="step-content animate-slide-up">
      
      {/* Search Input */}
      <div className="input-group">
        <label>Recipient</label>
        <div className="search-box">
            <input 
                type="tel" 
                placeholder="Account Number"
                value={accountNum}
                onChange={(e) => {
                    setAccountNum(e.target.value);
                    setRecipient(null);
                }}
                maxLength={10}
            />
            {accountNum.length === 10 && !recipient && (
                <button onClick={handleSearch} disabled={isSearching} className="verify-btn-mini">
                    {isSearching ? <CircleNotch className="spin"/> : <MagnifyingGlass weight="bold"/>}
                </button>
            )}
        </div>
      </div>

      {/* Verified User Card */}
      {recipient && (
        <div className="user-found-card">
            <div className="avatar-circle">
                {recipient.fullName.charAt(0)}
            </div>
            <div className="user-details">
                <h4>{recipient.fullName}</h4>
                <span>Verified <CheckCircle size={12} weight="fill" color="#10B981"/></span>
            </div>
        </div>
      )}

      {/* Amount Input (Big & Bold) */}
      <div className="input-group mt-4">
        <label>Amount</label>
        <div className="amount-box">
            <span>$</span>
            <input 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
        </div>
      </div>

      {/* Note Input */}
      <div className="input-group mt-4">
        <label>Note (Optional)</label>
        <input 
            type="text" 
            placeholder="What is this for?"
            className="standard-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Fake Beneficiaries List (Pro Visual) */}
      <div className="beneficiaries-section">
        <label>Recent</label>
        <div className="b-row">
            <div className="b-item add-new">
                <span>+</span>
            </div>
            {/* Mock Data for visuals */}
            <div className="b-item"><div className="b-avatar">J</div><span>John</span></div>
            <div className="b-item"><div className="b-avatar">S</div><span>Sarah</span></div>
            <div className="b-item"><div className="b-avatar">M</div><span>Mike</span></div>
        </div>
      </div>

      <button className="main-btn" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default InputStep;