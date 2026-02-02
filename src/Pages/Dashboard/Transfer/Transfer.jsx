import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import './Transfer.css';

// Import all steps
import InputStep from './Steps/InputStep';
import ReviewStep from './Steps/Review'; // New
import SuccessStep from './Steps/SuccessStep'; // New

const Transfer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Holds the transaction details across steps
  const [formData, setFormData] = useState({
    accountNum: '',
    amount: '',
    recipient: null,
    note: ''
  });

  // Navigation Handlers
  const goNext = (data) => {
    setFormData(data); // Save input data
    setCurrentStep(1); // Go to Review
  };

  const handleSuccess = () => {
    setCurrentStep(2); // Go to Success
  };

  return (
    <div className="transfer-container page-slide">
      {/* Header (Hidden on Success Step for cleaner look) */}
      {currentStep !== 2 && (
        <header className="transfer-header">
            <button onClick={() => {
                if (currentStep === 0) navigate('/');
                else setCurrentStep(prev => prev - 1);
            }} className="back-btn">
                <ArrowLeft size={24} />
            </button>
            <h2>
                {currentStep === 0 ? 'Send Money' : 'Review Payment'}
            </h2>
        </header>
      )}

      <div className="transfer-content">
        {/* Step 1: Input */}
        {currentStep === 0 && (
            <InputStep onNext={goNext} initialData={formData} />
        )}

        {/* Step 2: Review (Connects to PIN Modal) */}
        {currentStep === 1 && (
            <ReviewStep 
                data={formData} 
                onBack={() => setCurrentStep(0)}
                onSuccess={handleSuccess}
            />
        )}

        {/* Step 3: Success Receipt */}
        {currentStep === 2 && (
            <SuccessStep 
                amount={formData.amount} 
                recipient={formData.recipient} 
            />
        )}
      </div>
    </div>
  );
};

export default Transfer;