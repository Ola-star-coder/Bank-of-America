import { useState, useEffect } from 'react';
import { CircleNotch, MagnifyingGlass, CheckCircle, CaretRight, NotePencil } from 'phosphor-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../../../Firebase/config';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import { X } from 'phosphor-react'; 

const InputStep = ({ onNext, initialData }) => {
  const { user } = useAuth();
  
  const [accountNum, setAccountNum] = useState(initialData.accountNum || '');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [recipient, setRecipient] = useState(initialData.recipient || null);
  const [note, setNote] = useState(initialData.note || '');

  const [isSearching, setIsSearching] = useState(false);
  const [savedBeneficiaries, setSavedBeneficiaries] = useState([]);
  const [showAllModal, setShowAllModal] = useState(false);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists() && snapshot.data().beneficiaries) {
            setSavedBeneficiaries(snapshot.data().beneficiaries.reverse());
        }
    };
    fetchBeneficiaries();
  }, [user]);

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
        toast.success(`Found ${foundUser.fullName}`);
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

  const handleSelectBeneficiary = (ben) => {
      setRecipient(ben);
      setAccountNum(ben.accountNumber);
      setShowAllModal(false); 
  };

  const handleContinue = () => {
    if (!recipient || !amount) return toast.error("Please fill in all details.");
    onNext({ accountNum, amount, recipient, note });
  };

  return (
    <div className="step-content animate-slide-up">
      
      {/* 1. AMOUNT SECTION */}
      <div className="amount-section-clean">
          <label className="amount-label">Amount</label>
          <div className="amount-wrapper">
            <span className="currency-symbol">$</span>
            <input 
                type="number" 
                className="clean-amount-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
          </div>
      </div>

      {/* 2. RECIPIENT SEARCH */}
      <label className="amount-label">Recipient</label>
      <div className="input-group-card">
          <MagnifyingGlass size={20} className="input-icon"/>
          <input 
              type="tel" 
              placeholder="Enter Account Number"
              value={accountNum}
              onChange={(e) => {
                  setAccountNum(e.target.value);
                  setRecipient(null); 
              }}
              maxLength={10}
          />
          {accountNum.length === 10 && !recipient && (
               <button onClick={handleSearch} disabled={isSearching} className="verify-btn-mini">
                  {isSearching ? <CircleNotch className="spin" size={18}/> : <CaretRight weight="bold" size={18}/>}
               </button>
          )}
      </div>

      {/* Verified User Card */}
      {recipient && (
          <div className="user-found-card">
              <div className="avatar-circle">
                  {recipient.fullName.charAt(0)}
              </div>
              <div className="user-details">
                  <h4>{recipient.fullName}</h4>
                  <span>Verified • {recipient.bankName || 'Opay'}</span>
              </div>
              <button onClick={() => {setRecipient(null); setAccountNum('')}} style={{marginLeft:'auto', border:'none', background:'none', color:'#EF4444'}}>
                  <X size={16}/>
              </button>
          </div>
      )}

      {/* 3. NOTE INPUT (ADDED BACK) */}
      <label className="amount-label">Note (Optional)</label>
      <div className="input-group-card">
          <NotePencil size={20} className="input-icon"/>
          <input 
              type="text" 
              placeholder="What is this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
          />
      </div>

      {/* 4. BENEFICIARIES */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px', marginBottom:'12px'}}>
          <span className="ben-section-label" style={{margin:0}}>RECENT</span>
          {savedBeneficiaries.length > 4 && (
              <button 
                  onClick={() => setShowAllModal(true)} 
                  style={{border:'none', background:'none', color:'#0E648E', fontSize:'12px', fontWeight:'600', cursor:'pointer'}}
              >
                  See All
              </button>
          )}
      </div>

      <div className="ben-list-wrapper">
          {savedBeneficiaries.slice(0, 4).map((ben, index) => (
              <div key={index} className="ben-card" onClick={() => handleSelectBeneficiary(ben)}>
                  <div className="ben-avatar">{ben.fullName.charAt(0)}</div>
                  <span className="ben-name">{ben.fullName.split(' ')[0]}</span>
              </div>
          ))}

          {savedBeneficiaries.length === 0 && (
              <div style={{width:'100%', textAlign:'center', padding:'20px', color:'#9CA3AF', fontSize:'13px', background:'#fff', borderRadius:'16px', border:'1px dashed #E5E5EA'}}>
                  No recent transfers
              </div>
          )}
      </div>

      <button className="main-btn" onClick={handleContinue}>
        Continue
      </button>

      {/* MODAL for All Beneficiaries */}
      {showAllModal && (
          <div className="modal-overlay" style={{alignItems:'flex-end'}}>
              <div className="pin-modal-content" style={{height:'70vh'}}>
                  <div className="modal-header">
                      <button onClick={() => setShowAllModal(false)} className="close-btn"><X size={24}/></button>
                      <h3>All Beneficiaries</h3>
                  </div>
                  <div style={{overflowY:'auto', height:'calc(100% - 60px)'}}>
                      {savedBeneficiaries.map((ben, i) => (
                          <div key={i} onClick={() => handleSelectBeneficiary(ben)} style={{
                              display:'flex', alignItems:'center', gap:'12px', padding:'12px', 
                              borderBottom:'1px solid #F3F4F6', cursor:'pointer'
                          }}>
                              <div className="ben-avatar" style={{width:'40px', height:'40px', fontSize:'14px'}}>
                                  {ben.fullName.charAt(0)}
                              </div>
                              <div style={{display:'flex', flexDirection:'column'}}>
                                  <span style={{fontWeight:'600', fontSize:'14px', color:'#1F2937'}}>{ben.fullName}</span>
                                  <span style={{fontSize:'12px', color:'#6B7280'}}>{ben.bankName || 'Bank'} • {ben.accountNumber}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default InputStep;