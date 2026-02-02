import { useNavigate } from 'react-router-dom';
import { 
  PaperPlaneTilt, Bank, QrCode, 
  Users, GlobeHemisphereWest, CaretRight 
} from 'phosphor-react';
import BottomSheet from '../BottomSheet/BottomSheet';
import './TransferSheet.css'; // We will add specific styling for the grid below

const TransferSheet = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose(); // Close sheet first
    setTimeout(() => navigate(path), 300); // Wait for animation then go
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <h3 className="sheet-title">Transfer Hub</h3>
      
      <div className="transfer-grid">
        
        {/* OPTION 1: Internal Transfer (Existing) */}
        <button className="t-option-card" onClick={() => handleNavigate('/transfer')}>
            <div className="t-icon-circle purple">
                <PaperPlaneTilt size={28} weight="fill" />
            </div>
            <div className="t-text">
                <span className="t-label">Send to App User</span>
                <span className="t-sub">Instant • Free</span>
            </div>
            <CaretRight size={20} color="#D1D5DB" />
        </button>

        {/* OPTION 2: Bank Transfer (Future) */}
        <button className="t-option-card" onClick={() => alert("Bank Transfer Coming Soon!")}>
            <div className="t-icon-circle green">
                <Bank size={28} weight="fill" />
            </div>
            <div className="t-text">
                <span className="t-label">Bank Transfer</span>
                <span className="t-sub">Chase, Paypal, Venmo</span>
            </div>
            <CaretRight size={20} color="#D1D5DB" />
        </button>

        {/* OPTION 3: International */}
        <button className="t-option-card" onClick={() => alert("Coming Soon!")}>
            <div className="t-icon-circle blue">
                <GlobeHemisphereWest size={28} weight="fill" />
            </div>
            <div className="t-text">
                <span className="t-label">Cross Border</span>
                <span className="t-sub">Send to UK/France</span>
            </div>
            <CaretRight size={20} color="#D1D5DB" />
        </button>

        {/* OPTION 4: QR Code */}
        <button className="t-option-card" onClick={() => alert("Coming Soon!")}>
            <div className="t-icon-circle black">
                <QrCode size={28} weight="fill" />
            </div>
            <div className="t-text">
                <span className="t-label">Scan QR</span>
                <span className="t-sub">Pay Merchants</span>
            </div>
            <CaretRight size={20} color="#D1D5DB" />
        </button>

      </div>
    </BottomSheet>
  );
};

export default TransferSheet;