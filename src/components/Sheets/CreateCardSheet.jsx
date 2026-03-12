import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [cardType, setCardType] = useState('Visa');
  const [cardSkin, setCardSkin] = useState('silver-card');

  // Defined Skins
  const skins = [
      { id: 'centurion-card', class: 'centurion' },
      { id: 'silver-card', class: 'silver' },
      { id: 'black-card', class: 'black' },
      { id: 'gold-card', class: 'gold' },
      { id: 'blue-card', class: 'blue' },
      { id: 'green-card', class: 'green' },
      { id: 'purple-card', class: 'purple' },
      { id: 'red-card', class: 'red' }
  ];

  // Prevent background scrolling when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Helper: Text Color Logic
  const isDarkSkin = (skin) => {
      return ['black-card', 'blue-card', 'green-card', 'purple-card', 'red-card', 'centurion-card'].includes(skin);
  };

  // Helper: Generate Mathematically Unique Card Details
  const generateCardDetails = (network) => {
      const prefix = network === 'Visa' ? '4' : '5';
      let pan = prefix;
      for(let i = 0; i < 15; i++) {
          pan += Math.floor(Math.random() * 10).toString();
      }
      const formattedPan = pan.match(/.{1,4}/g).join(' ');
      const cvv = Math.floor(100 + Math.random() * 900).toString();
      const date = new Date();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear() + 4).slice(-2);
      const expiry = `${month}/${year}`;

      return { fullPan: formattedPan, last4: pan.slice(-4), cvv, expiry };
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
      setLoading(true);

      const { fullPan, last4, cvv, expiry } = generateCardDetails(cardType);
      
      const newCard = {
          id: Date.now().toString(),
          type: cardType,
          style: cardSkin, 
          label: cardSkin === 'centurion-card' ? 'TITANIUM' : (cardType === 'Visa' ? 'Debit' : 'World Elite'),
          logo: cardType === 'Visa' ? 'VISA' : 'mastercard',
          holder: user?.displayName || 'Card Holder',
          cardNumber: fullPan,
          last4: last4,
          cvv: cvv,
          expiry: expiry,
          frozen: false
      };

      try {
          const userRef = doc(db, "users", user.uid);
          
          await updateDoc(userRef, {
              cards: arrayUnion(newCard)
          });

          toast.success("New card issued successfully!");
          onClose();
          setCardSkin('silver-card');
      } catch (err) {
          console.error(err);
          toast.error("Failed to issue virtual card");
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
  
  // Preview Expiry Date
  const previewDate = new Date();
  const previewMonth = String(previewDate.getMonth() + 1).padStart(2, '0');
  const previewYear = String(previewDate.getFullYear() + 4).slice(-2);

  // Render via Portal to overlay above Navbar
  return createPortal(
    <div className="modal-overlay" style={{alignItems: 'flex-end', zIndex: 9999}} onClick={onClose}>
       <div 
         className="sheet-content slide-up-animation" 
         onClick={(e) => e.stopPropagation()} 
         style={{
             background: '#F9FAFB', 
             height: '85vh',          
             display: 'flex',         
             flexDirection: 'column', 
             padding: '24px 0 0 0',
             zIndex: 10000
         }}
       >
          
          {/* --- PINNED HEADER --- */}
          <div style={{
              display:'flex', 
              justifyContent:'space-between', 
              alignItems:'center', 
              marginBottom:'16px', 
              padding: '0 24px',
              flexShrink: 0 
          }}>
             <h3 style={{margin:0, fontSize:'18px'}}>Add New Card</h3>
             <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}>
                <X size={24} color="#374151"/>
             </button>
          </div>

          {/* --- INDEPENDENT SCROLL AREA --- */}
          <div style={{ 
              overflowY: 'auto', 
              flex: 1, 
              padding: '0 24px 40px 24px',
              overscrollBehavior: 'contain' 
          }}>
              
              {/* LIVE PREVIEW WRAPPER */}
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px', padding: '10px 0'}}>
                 <div className={cardSkin} style={{transform: 'scale(0.95)', transformOrigin: 'center center', maxWidth:'340px'}}>
                    
                    <div className="card-top-row">
                        <span className={`bank-logo-text ${isDark ? 'text-white' : 'text-dark'}`}>Vault</span>
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
                        •••• •••• •••• {cardType === 'Visa' ? '4024' : '5012'}
                    </div>

                    <div className="card-bottom-row">
                        <div className="meta-col">
                            <label className={isDark ? 'op-70' : ''}>Holder</label>
                            <span className={isDark ? 'text-white' : 'text-dark'} style={{textTransform: 'uppercase'}}>
                                {user?.displayName || 'YOUR NAME'}
                            </span>
                        </div>
                        <div className="meta-col">
                            <label className={isDark ? 'op-70' : ''}>Expires</label>
                            <span className={isDark ? 'text-white' : 'text-dark'}>{previewMonth}/{previewYear}</span>
                        </div>
                        {cardType === 'Mastercard' 
                            ? <MastercardLogo/> 
                            : <div className={`visa-logo ${isDark ? 'text-white' : 'text-dark'}`}>VISA</div>
                        }
                    </div>
                 </div>
              </div>

              {/* FORM SECTION */}
              <div className="create-card-form">
                  <label className="field-label">Choose Design</label>
                  <div className="skin-scroll-wrapper">
                      {skins.map(skin => (
                          <button 
                            key={skin.id}
                            className={`skin-btn ${skin.class} ${cardSkin === skin.id ? 'selected' : ''}`}
                            onClick={() => setCardSkin(skin.id)}
                          ></button>
                      ))}
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

                  <button className="save-card-btn" onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Processing...' : 'Issue Virtual Card'}
                  </button>
              </div>

          </div>
       </div>
    </div>,
    document.body
  );
};

export default CreateCardSheet;