import { useState } from 'react';
import { X } from 'phosphor-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { db } from '../../Firebase/config';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import '../../Pages/Dashboard/History/History.css'; 
import '../../components/Cards/Cards.css'; 

const CreateCardSheet = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('Visa');
  const [cardSkin, setCardSkin] = useState('silver-card');

  // Defined Skins
  const skins = [
      { id: 'centurion-card', class: 'centurion' }, // TITANIUM
      { id: 'silver-card', class: 'silver' },
      { id: 'black-card', class: 'black' },
      { id: 'gold-card', class: 'gold' },
      { id: 'blue-card', class: 'blue' },
      { id: 'green-card', class: 'green' },
      { id: 'purple-card', class: 'purple' },
      { id: 'red-card', class: 'red' }
  ];

  // Helper: Text Color Logic
  const isDarkSkin = (skin) => {
      return ['black-card', 'blue-card', 'green-card', 'purple-card', 'red-card', 'centurion-card'].includes(skin);
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
      if(!cardName) return toast.warn("Please enter a name");
      setLoading(true);

      // Generate random last 4 digits
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      
      const newCard = {
          id: Date.now(),
          type: cardType,
          style: cardSkin, 
          label: cardSkin === 'centurion-card' ? 'TITANIUM' : (cardType === 'Visa' ? 'Debit' : 'World Elite'),
          logo: cardType === 'Visa' ? 'VISA' : 'mastercard',
          holder: cardName,
          last4: randomSuffix.toString(),
          frozen: false,
          expiry: '08/30'
      };

      try {
          const userRef = doc(db, "users", user.uid);
          
          // Save to Firestore array
          await updateDoc(userRef, {
              cards: arrayUnion(newCard)
          });

          toast.success("New card created!");
          onClose(); // Close sheet
          
          // Reset form
          setCardName('');
          setCardSkin('silver-card');
      } catch (err) {
          console.error(err);
          toast.error("Failed to create card");
      } finally {
          setLoading(false);
      }
  };

  const MastercardLogo = () => (
      <div className="mc-logo-circles">
          <div className="circle red"></div>
          <div className="circle orange"></div>
      </div>
  );

  const isDark = isDarkSkin(cardSkin);

  return (
    <div className="modal-overlay" style={{alignItems: 'flex-end'}} onClick={onClose}>
       <div className="sheet-content slide-up-animation" onClick={(e) => e.stopPropagation()} style={{background:'#F9FAFB'}}>
          
          {/* Header */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
             <h3 style={{margin:0, fontSize:'18px'}}>Add New Card</h3>
             <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}>
                <X size={24} color="#374151"/>
             </button>
          </div>

          {/* --- LIVE PREVIEW WRAPPER (Centered) --- */}
          <div style={{
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '20px',
              padding: '10px 0'
          }}>
             <div className={cardSkin} style={{transform: 'scale(0.95)', transformOrigin: 'center center', maxWidth:'340px'}}>
                
                <div className="card-top-row">
                    <span className={`bank-logo-text ${isDark ? 'text-white' : 'text-dark'}`}>Income</span>
                    <span className={`card-tag ${isDark ? 'tag-white' : 'tag-dark'}`}>
                        {cardSkin === 'centurion-card' ? 'TITANIUM' : cardType}
                    </span>
                </div>

                <div className="chip-row">
                    <div className="emv-chip">
                        <div className="chip-line vertical"></div>
                        <div className="chip-line horizontal"></div>
                        <div className="chip-curve"></div>
                    </div>
                    <span className={`contactless-icon ${isDark ? 'icon-white' : 'icon-dark'}`}>
                         <div className="wifi-symbol">
                            <div className="wifi-circle first"></div>
                            <div className="wifi-circle second"></div>
                            <div className="wifi-circle third"></div>
                        </div>
                    </span>
                </div>

                <div className={`card-number-large ${isDark ? 'text-white' : 'text-dark'}`}>
                    •••• •••• •••• 4242
                </div>

                <div className="card-bottom-row">
                    <div className="meta-col">
                        <label className={isDark ? 'op-70' : ''}>Holder</label>
                        <span className={isDark ? 'text-white' : 'text-dark'}>{cardName || 'YOUR NAME'}</span>
                    </div>
                    <div className="meta-col">
                        <label className={isDark ? 'op-70' : ''}>Expires</label>
                        <span className={isDark ? 'text-white' : 'text-dark'}>08/30</span>
                    </div>
                    {cardType === 'Mastercard' 
                        ? <MastercardLogo/> 
                        : <div className={`visa-logo ${isDark ? 'text-white' : 'text-dark'}`}>VISA</div>
                    }
                </div>
             </div>
          </div>

          {/* --- FORM SECTION --- */}
          <div className="create-card-form">
              
              <label className="field-label">Choose Design</label>
              
              {/* Scrollable Skin Selector */}
              <div className="skin-scroll-wrapper">
                  {skins.map(skin => (
                      <button 
                        key={skin.id}
                        className={`skin-btn ${skin.class} ${cardSkin === skin.id ? 'selected' : ''}`}
                        onClick={() => setCardSkin(skin.id)}
                      ></button>
                  ))}
              </div>

              <label className="field-label">Card Holder Name</label>
              <div className="input-wrapper-simple">
                 <input 
                    type="text" 
                    placeholder="e.g. AMIR RASHID"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                 />
              </div>

              <label className="field-label">Payment Network</label>
              <div className="network-selector">
                  <button 
                    className={`net-btn ${cardType === 'Visa' ? 'active' : ''}`}
                    onClick={() => setCardType('Visa')}
                  >
                     Visa
                  </button>
                  <button 
                    className={`net-btn ${cardType === 'Mastercard' ? 'active' : ''}`}
                    onClick={() => setCardType('Mastercard')}
                  >
                     Mastercard
                  </button>
              </div>

              <button 
                className="save-card-btn" 
                onClick={handleSubmit}
                disabled={loading}
              >
                  {loading ? 'Processing...' : 'Issue Virtual Card'}
              </button>

          </div>
       </div>
    </div>
  );
};

export default CreateCardSheet;