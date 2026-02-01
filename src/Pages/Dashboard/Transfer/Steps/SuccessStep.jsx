import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'phosphor-react';

const SuccessStep = ({ amount, recipient }) => {
  const navigate = useNavigate();

  return (
    <div className="step-content success-container animate-fade-in">
      <div className="success-icon-wrapper">
        <CheckCircle size={80} weight="fill" color="#10B981" />
      </div>

      <h2>Transfer Successful!</h2>
      <p>You successfully sent <strong>${amount}</strong> to <strong>{recipient.fullName}</strong>.</p>

      <div className="receipt-actions">
        <button className="main-btn" onClick={() => navigate('/')}>
          Return to Dashboard
        </button>
        <button className="secondary-btn" onClick={() => navigate('/')}>
          Share Receipt
        </button>
      </div>
    </div>
  );
};

export default SuccessStep;