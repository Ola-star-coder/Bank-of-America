import { useState } from 'react';
import { ArrowRight, AppleLogo, WifiHigh } from 'phosphor-react';

const Phase3b_CardDesign = ({ formData, setFormData, nextPhase }) => {
  const [selectedSkin, setSelectedSkin] = useState('apple-mesh');

  // The premium skins inspired by your screenshots
  const cardSkins = [
    { id: 'apple-mesh', name: 'Titanium Aura', type: 'mesh' },
    { id: 'zing-stealth', name: 'Stealth Black', type: 'dark' },
    { id: 'vivid-violet', name: 'Neon Violet', type: 'gradient' },
    { id: 'wise-emerald', name: 'Eco Texture', type: 'abstract' }
  ];

  const handleLockInCard = () => {
    setFormData({ ...formData, cardSkin: selectedSkin });
    nextPhase(); // Move to Phase 4: Master PIN
  };

  return (
    <div className="phase-container animate-slide-left card-designer-wrapper">
      
      <div className="designer-header">
        <h2 className="phase-title">Design your card</h2>
        <p className="phase-subtitle">Choose a style for your digital and physical Vault card.</p>
      </div>

      {/* THE 3D FLOATING CARD SHOWCASE */}
      <div className="card-showcase-area">
        <div className={`premium-vault-card ${selectedSkin}`}>
          
          {/* Card Top: Logos & Contactless */}
          <div className="p-card-top">
            <AppleLogo size={24} weight="fill" className="p-bank-logo" />
            <WifiHigh size={24} weight="bold" style={{ transform: 'rotate(90deg)' }} />
          </div>

          {/* EMV Chip */}
          <div className="p-emv-chip">
            <div className="p-chip-line vertical"></div>
            <div className="p-chip-line horizontal"></div>
            <div className="p-chip-curve"></div>
          </div>

          {/* Card Bottom: Cashtag & Network */}
          <div className="p-card-bottom">
            <span className="p-cashtag">{formData.cashtag ? `@${formData.cashtag}` : '@YourTag'}</span>
            <div className="p-network-logo">
               <div className="p-circle p-red"></div>
               <div className="p-circle p-orange"></div>
            </div>
          </div>

        </div>
      </div>

      {/* THE SWATCH SELECTOR */}
      <div className="skin-selector-area">
        <div className="skin-name-display">
          {cardSkins.find(s => s.id === selectedSkin)?.name}
        </div>
        
        <div className="swatch-scroll-row">
          {cardSkins.map(skin => (
            <button 
              key={skin.id}
              className={`swatch-btn ${skin.id} ${selectedSkin === skin.id ? 'active' : ''}`}
              onClick={() => setSelectedSkin(skin.id)}
            >
              {selectedSkin === skin.id && <div className="swatch-ring"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Apple Wallet Style Upsell */}
      <div className="wallet-upsell-box">
        <div className="wallet-icon">💳</div>
        <div className="wallet-text">
          <h4>Apple Pay Ready</h4>
          <p>Instantly available in your digital wallet after setup.</p>
        </div>
      </div>

      <button className="btn-primary" onClick={handleLockInCard} style={{ marginTop: 'auto' }}>
        Confirm Design <ArrowRight size={20} weight="bold" />
      </button>

    </div>
  );
};

export default Phase3b_CardDesign;