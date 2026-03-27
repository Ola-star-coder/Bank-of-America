import { PaintBrush, Lightning, Prohibit, ShieldCheck } from 'phosphor-react';
import '../Onboarding.css';

const MeetCard = ({ updateData, onNext }) => {

  const handleNext = (wantsCard) => {
    updateData('wantsPhysicalCard', wantsCard);
    onNext();
  };

  return (
    <>
      <div className="onboarding-content" style={{ paddingBottom: '12rem' }}>
        
        {/* CSS Mockup of the Green Card Graphic */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0 3rem 0' }}>
          <div style={{ 
            width: '160px', height: '100px', background: '#10B981', 
            borderRadius: '12px', transform: 'rotate(-10deg)', 
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)', position: 'relative' 
          }}>
            <div style={{ position: 'absolute', top: '10px', right: '15px', color: '#fff', fontWeight: 'bold', fontStyle: 'italic', fontSize: '14px' }}>VISA</div>
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '25px', height: '18px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}></div>
          </div>
        </div>

        <h1 className="ob-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Meet the Bridge Card</h1>

        {/* Feature List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="feature-item">
            <PaintBrush size={24} weight="regular" />
            <span>Customizable design</span>
          </div>
          <div className="feature-item">
            <Lightning size={24} weight="fill" />
            <span>Instant discounts</span>
          </div>
          <div className="feature-item">
            <Prohibit size={24} weight="regular" />
            <span>No hidden fees</span>
          </div>
          <div className="feature-item">
            <ShieldCheck size={24} weight="regular" />
            <span>Bank-level security*</span>
          </div>
        </div>

        {/* Fine Print */}
        <p style={{ fontSize: '10px', color: '#9CA3AF', lineHeight: '1.5', textAlign: 'justify' }}>
          *Bridge is a financial services platform, not a bank. Banking services are provided by our partner banks. The Bridge Card is issued pursuant to a license from Visa U.S.A. Inc. and may be used everywhere Visa debit cards are accepted.
        </p>
      </div>

      <div className="bottom-action-bar stacked">
        <button className="ob-secondary-btn" onClick={() => handleNext(false)}>
          Skip
        </button>
        <button className="ob-next-btn" onClick={() => handleNext(true)}>
          Next
        </button>
      </div>
    </>
  );
};

export default MeetCard;