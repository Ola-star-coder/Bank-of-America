import { useNavigate } from 'react-router-dom';
import { PaperPlaneTilt, Bank, CaretRight } from 'phosphor-react';
import BottomSheet from '../BottomSheet/BottomSheet';
import './TransferSheet.css';

const TransferSheet = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose();
    setTimeout(() => navigate(path), 300);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <h3 className="sheet-title">Transfer Hub</h3>
      
      <div className="transfer-grid">
        
        {/* OPTION 1: Internal Transfer */}
        <button className="t-option-card" onClick={() => handleNavigate('/transfer')}>
            <div className="t-icon-circle purple">
                <PaperPlaneTilt size={28} weight="fill" />
            </div>
            <div className="t-text">
                <span className="t-label">Send to App User</span>
                <span className="t-sub">Instant • Free • internal</span>
            </div>
            <CaretRight size={20} color="#D1D5DB" />
        </button>

        {/* OPTION 2: Global Bank Transfer */}
        <button className="t-option-card" onClick={() => handleNavigate('/bank-transfer')}>
            <div className="t-icon-circle green">
                <Bank size={28} weight="fill" />
            </div>
            <div className="t-text">
                <span className="t-label">Bank / Wire Transfer</span>
                <span className="t-sub">Local & International (ACH, IBAN)</span>
            </div>
            <CaretRight size={20} color="#D1D5DB" />
        </button>

      </div>
    </BottomSheet>
  );
};

export default TransferSheet;