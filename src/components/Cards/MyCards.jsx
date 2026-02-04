import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CaretLeft, Plus, Snowflake, 
  SlidersHorizontal, Eye, EyeSlash, ShieldWarning, 
  LockKey, MapPin, ArrowsLeftRight, Lock
} from 'phosphor-react';
import { useAuth } from '../../Context/AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; 
import { db } from '../../Firebase/config';
import CreateCardSheet from '../Sheets/CreateCardSheet'; // Import the Sheet
import './Cards.css';

const MyCards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Sheet State
  
  // Data State
  const [realData, setRealData] = useState(null);
  const [myCards, setMyCards] = useState([]);

  // 1. LISTEN TO REAL DATA (Real-time updates)
  useEffect(() => {
    if(!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if(docSnap.exists()) {
            const data = docSnap.data();
            setRealData(data);
            
            // CONSTRUCT CARD LIST
            // Card 0: The Default "Main Account" Card
            const defaultCard = {
                id: 'default-main',
                type: 'Visa',
                style: 'silver-card',
                label: 'Debit',
                logo: 'VISA',
                holder: data.fullName || 'User',
                last4: data.accountNumber ? data.accountNumber.slice(-4) : '0000',
                frozen: data.isMainFrozen || false // Store main freeze state in user doc
            };

            // Combine with Created Cards (from Firestore array)
            const createdCards = data.cards || [];
            setMyCards([defaultCard, ...createdCards]);
        }
    });
    return () => unsub();
  }, [user]);

  // 2. HANDLE SCROLL (Update Dots)
  const handleScroll = (e) => {
      const container = e.target;
      const scrollPosition = container.scrollLeft;
      const cardWidth = container.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeCardIndex && newIndex >= 0 && newIndex < myCards.length) {
          setActiveCardIndex(newIndex);
      }
  };

  // 3. FREEZE LOGIC (Saves to Database)
  const toggleFreeze = async () => {
      const currentCard = myCards[activeCardIndex];
      const newFreezeStatus = !currentCard.frozen;
      const userRef = doc(db, "users", user.uid);

      if (activeCardIndex === 0) {
          // Freeze Main Card
          await updateDoc(userRef, { isMainFrozen: newFreezeStatus });
      } else {
          // Freeze Created Card (Find it in array and update)
          const updatedCards = realData.cards.map(c => 
              c.id === currentCard.id ? { ...c, frozen: newFreezeStatus } : c
          );
          await updateDoc(userRef, { cards: updatedCards });
      }
  };

  // Helper Helpers
  const formatCardNumber = (card) => {
      if (!card) return "•••• •••• •••• ••••";
      
      // Use stored last4 or fallback
      const last4 = card.last4 || "0000";
      const prefix = card.style === 'gold-card' ? "4000 1234 5678" : "4570 2796 5324";
      
      if (!showDetails) return `•••• •••• •••• ${last4}`;
      return `${prefix} ${last4}`;
  };

  const MastercardLogo = () => (
      <div className="mc-logo-circles">
          <div className="circle red"></div>
          <div className="circle orange"></div>
      </div>
  );

  // If loading...
  if (!realData) return <div className="cards-page-container"></div>;

  const currentCard = myCards[activeCardIndex] || {};

  return (
    <div className="cards-page-container page-slide">
      
      <div className="cards-header">
        <button onClick={() => navigate(-1)} className="back-btn-glass">
             <CaretLeft size={24} color="#1F2937"/>
        </button>
        <h2>My Cards</h2>
        <div style={{width: 40}}></div> 
      </div>

      {/* DYNAMIC CAROUSEL */}
      <div className="cards-carousel-container" onScroll={handleScroll}>
        {myCards.map((card, index) => (
            <div 
                key={card.id || index} 
                className="card-slide"
                onClick={() => setActiveCardIndex(index)}
            >
                 <div className={card.style || 'silver-card'}>
                    
                    {/* FROZEN OVERLAY */}
                    {card.frozen && (
                        <div className="frost-overlay animate-fade">
                            <div className="frost-lock-icon">
                                <Lock size={32} weight="fill" color="#1F2937" />
                            </div>
                            <span className="frost-text">FROZEN</span>
                        </div>
                    )}

                    <div className="card-top-row">
                        <span className={`bank-logo-text ${card.style === 'black-card' ? 'text-white' : 'text-dark'}`}>Income</span>
                        <span className={`card-tag ${card.style === 'black-card' ? 'tag-white' : 'tag-dark'}`}>{card.label}</span>
                    </div>

                    <div className="chip-row">
                        <div className="emv-chip">
                            <div className="chip-line vertical"></div>
                            <div className="chip-line horizontal"></div>
                            <div className="chip-curve"></div>
                        </div>
                        <span className={`contactless-icon ${card.style === 'black-card' ? 'icon-white' : 'icon-dark'}`}>
                            <div className="wifi-symbol">
                                <div className="wifi-circle first"></div>
                                <div className="wifi-circle second"></div>
                                <div className="wifi-circle third"></div>
                            </div>
                        </span>
                    </div>

                    <div className={`card-number-large ${card.style === 'black-card' ? 'text-white' : 'text-dark'}`}>
                        {formatCardNumber(card)}
                    </div>

                    <div className="card-bottom-row">
                        <div className="meta-col">
                            <label className={card.style === 'black-card' ? 'op-70' : ''}>Holder</label>
                            <span className={card.style === 'black-card' ? 'text-white' : 'text-dark'}>
                                {card.holder || realData.fullName}
                            </span>
                        </div>
                        <div className="meta-col">
                            <label className={card.style === 'black-card' ? 'op-70' : ''}>Expires</label>
                            <span className={card.style === 'black-card' ? 'text-white' : 'text-dark'}>
                                {card.expiry || '09/29'}
                            </span>
                        </div>
                        {card.logo === 'mastercard' ? <MastercardLogo/> : <div className={`visa-logo ${card.style === 'black-card' ? 'text-white' : 'text-dark'}`}>VISA</div>}
                    </div>
                 </div>
            </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="carousel-dots spacer-bottom">
          {myCards.map((_, i) => (
              <div key={i} className={`dot ${i === activeCardIndex ? 'active' : ''}`}></div>
          ))}
      </div>

      {/* ACTIONS */}
      <div className="card-actions-grid">
         <button className="c-action-btn" onClick={() => setShowDetails(!showDetails)}>
            <div className={`c-icon-box ${showDetails ? 'active-dark' : ''}`}>
                {showDetails ? <EyeSlash size={22}/> : <Eye size={22}/>}
            </div>
            <span>Details</span>
         </button>

         <button className="c-action-btn" onClick={toggleFreeze}>
            <div className={`c-icon-box ${currentCard.frozen ? 'active-freeze' : ''}`}>
                <Snowflake size={22} weight={currentCard.frozen ? 'fill' : 'regular'}/>
            </div>
            <span>{currentCard.frozen ? 'Unfreeze' : 'Freeze'}</span>
         </button>

         <button className="c-action-btn">
            <div className="c-icon-box"><SlidersHorizontal size={22}/></div>
            <span>Limits</span>
         </button>
         <button className="c-action-btn">
            <div className="c-icon-box"><ArrowsLeftRight size={22}/></div>
            <span>Replace</span>
         </button>
      </div>

      {/* CREATE NEW BUTTON */}
      <div style={{padding: '0 24px', marginBottom: '32px'}}>
          <button className="create-new-btn" onClick={() => setIsCreateOpen(true)}>
              <Plus size={20} weight="bold" />
              <span>Create New Card</span>
          </button>
      </div>

      {/* SETTINGS LIST */}
      <div className="long-settings-list">
          <h3 className="list-title">Card Settings</h3>
          <div className="long-btn">
              <div className="lb-icon purple"><LockKey size={22} weight="fill"/></div>
              <div className="lb-content"><h4>Change PIN</h4><p>Update your 4-digit security pin</p></div>
              <ArrowsLeftRight size={18} color="#9CA3AF"/>
          </div>
           <div className="long-btn">
              <div className="lb-icon grey"><MapPin size={22} weight="fill"/></div>
              <div className="lb-content"><h4>Billing Address</h4><p>Edit registered billing info</p></div>
              <ArrowsLeftRight size={18} color="#9CA3AF"/>
          </div>
           <div className="long-btn" style={{borderBottom:'none'}}>
              <div className="lb-icon red"><ShieldWarning size={22} weight="fill"/></div>
              <div className="lb-content"><h4>Report Stolen</h4><p>Block card and request replacement</p></div>
              <ArrowsLeftRight size={18} color="#9CA3AF"/>
          </div>
      </div>

      {/* THE SHEET COMPONENT */}
      <CreateCardSheet 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

    </div>
  );
};

export default MyCards;