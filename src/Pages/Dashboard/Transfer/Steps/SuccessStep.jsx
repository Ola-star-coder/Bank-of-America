import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShareNetwork, House } from 'phosphor-react';
import { useRef } from 'react';

const SuccessStep = ({ amount, recipient }) => {
  const navigate = useNavigate();
  
  // Generate a realistic-looking Reference ID for display
  const refNumber = useRef(`#${Math.floor(100000000 + Math.random() * 900000000)}`);
  const dateStr = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const handleShare = () => {
    // Simple native share trigger (works on mobile)
    if (navigator.share) {
      navigator.share({
        title: 'Transfer Receipt',
        text: `I sent $${amount} to ${recipient.fullName}. Ref: ${refNumber.current}`,
      }).catch(console.error);
    } else {
      alert("Screenshot this page to share!");
    }
  };

  return (
    <div className="step-content success-container animate-fade-in">
      
      {/* 1. THE RECEIPT CARD */}
      <div className="receipt-card">
        {/* Success Icon */}
        <div className="success-header">
           <div className="success-icon-wrapper">
             <CheckCircle size={64} weight="fill" color="#10B981" />
           </div>
           <h2>Transfer Successful</h2>
           <p>Your payment has been processed.</p>
        </div>

        <div className="receipt-divider"></div>

        {/* Details Grid */}
        <div className="receipt-details">
          
          <div className="r-row">
             <span>Reference No</span>
             <span className="r-val">{refNumber.current}</span>
          </div>
          
          <div className="r-row">
             <span>Date</span>
             <span className="r-val">{dateStr}</span>
          </div>

          <div className="r-row">
             <span>Recipient</span>
             <span className="r-val">{recipient.fullName}</span>
          </div>

           <div className="r-row">
             <span>Bank</span>
             <span className="r-val" style={{textTransform:'capitalize'}}>{recipient.bankName || 'Citibank'}</span>
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="r-row total">
             <span>Total Sent</span>
             <span className="r-total-val">${parseFloat(amount).toLocaleString()}</span>
          </div>

        </div>
      </div>

      {/* 2. ACTIONS */}
      <div className="receipt-actions">
        <button className="receipt-btn share" onClick={handleShare}>
          <ShareNetwork size={20} weight="bold"/>
          Share Receipt
        </button>
        
        <button className="receipt-btn home" onClick={() => navigate('/')}>
          <House size={20} weight="bold"/>
          Done
        </button>
      </div>

    </div>
  );
};

export default SuccessStep;