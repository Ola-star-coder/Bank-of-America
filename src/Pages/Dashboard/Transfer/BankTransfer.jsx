import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import './Transfer.css';

// Import New Bank Steps
import BankSelectionStep from './Steps/BankSelectionStep';
import BankInputStep from './Steps/BankInputStep';
import ReviewStep from './Steps/Review'; // We reuse Review
import SuccessStep from './Steps/SuccessStep'; // We reuse Success

const BankTransfer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Data State
  const [selectedBank, setSelectedBank] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    recipient: null,
    note: ''
  });

  // Navigation Logic
  const goNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    
    if (currentStep === 0) {
        setSelectedBank(data); 
        setCurrentStep(1); // Go to Input Details
    } else if (currentStep === 1) {
        setCurrentStep(2); // Go to Review
    }
  };

  const handleBack = () => {
      if (currentStep === 0) navigate('/');
      else setCurrentStep(prev => prev - 1);
  };

  const handleSuccess = () => {
      setCurrentStep(3); // Go to Success
  };

  // Dynamic Titles for Bank Flow
  const getTitle = () => {
      if (currentStep === 0) return 'Select Bank';
      if (currentStep === 1) return 'Enter Details';
      return 'Review Transfer';
  };

  return (
    <div className="transfer-container page-slide">
      
      {/* Header */}
      {currentStep !== 3 && (
        <header className="transfer-header">
            <button onClick={handleBack} className="back-btn">
                <ArrowLeft size={24} />
            </button>
            <h2>{getTitle()}</h2>
        </header>
      )}

      <div className="transfer-content">
          {/* Step 0: List */}
          {currentStep === 0 && <BankSelectionStep onSelect={goNext} />}
          
          {/* Step 1: Input */}
          {currentStep === 1 && <BankInputStep bank={selectedBank} onNext={goNext} />}
          
          {/* Step 2: Review */}
          {currentStep === 2 && <ReviewStep data={formData} onBack={handleBack} onSuccess={handleSuccess} />}
          
          {/* Step 3: Success */}
          {currentStep === 3 && <SuccessStep amount={formData.amount} recipient={formData.recipient} />}
      </div>
    </div>
  );
};

export default BankTransfer;