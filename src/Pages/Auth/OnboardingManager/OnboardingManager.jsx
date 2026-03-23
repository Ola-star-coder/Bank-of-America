import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft } from 'phosphor-react';
import './Onboarding.css';

import PhoneOrEmail from './Steps/PhoneOrEmail';

const OnboardingManager = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // THE MASTER STATE: This holds EVERYTHING until the final database write
  const [onboardingData, setOnboardingData] = useState({
    phoneOrEmail: '',
    legalFirstName: '',
    legalLastName: '',
    dob: '',
    zipCode: '',
    kycId: '', // SSN or NIN
    cashtag: '',
    pin: '',
    cardColor: 'silver',
  });

  // Helper to update state from child components
  const updateData = (field, value) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

  // Navigates to the next screen
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Navigates to the previous screen or exits onboarding
  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/welcome'); // Back to the intro carousel
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // The Switcher: Renders the correct component based on the step integer
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PhoneOrEmail 
            data={onboardingData} 
            updateData={updateData} 
            onNext={handleNext} 
          />
        );
      case 2:
        return (
          <div className="onboarding-content">
            <h1 className="ob-title">What's your legal name?</h1>
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem' }}>
               [ Step 2: Legal Name Component Will Go Here ]
            </div>
          </div>
        );
      // We will add case 3, 4, 5... here as we build them
      default:
        return <div className="onboarding-content">Unknown Step</div>;
    }
  };

  return (
    <div className="onboarding-wrapper">
      
      {/* Universal Top Nav - Frozen in place */}
      <header className="onboarding-top-nav">
        <button onClick={handleBack} className="ob-back-btn">
          <CaretLeft size={24} weight="bold" />
        </button>
        <button className="ob-help-btn">?</button>
      </header>

      {/* The Dynamic Content Area */}
      {/* NOTE: The bottom buttons are now rendered INSIDE renderStep() */}
      {renderStep()}

    </div>
  );
};

export default OnboardingManager;