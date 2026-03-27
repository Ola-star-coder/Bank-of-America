import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft } from 'phosphor-react';
import './Onboarding.css';

// Import all steps
import PhoneOrEmail from './Steps/PhoneOrEmail';
import VerifyOtp from './Steps/VerifyOtp';
import LegalName from './Steps/LegalName';
import DOB from './Steps/DOB';
import HomeAddress from './Steps/HomeAddress';
import DynamicKYC from './Steps/DynamicKYC';
import AddDebitCard from './Steps/AddDebitCard';
import Linking from './Steps/Linking';
import Cashtag from './Steps/CashTag';
import PinSetup from './Steps/PinSetup';
import MeetCard from './Steps/MeetCard';
import SyncContacts from './Steps/SyncContact';
import WelcomeSuccess from './Steps/WelcomeSuccess';


const OnboardingManager = () => {
  const navigate = useNavigate();

  // 1. Load Step from Session Storage
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem('ob_step');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  // 2. Load Data from Session Storage
  const [onboardingData, setOnboardingData] = useState(() => {
    const savedData = sessionStorage.getItem('ob_data');
    return savedData ? JSON.parse(savedData) : {
      phoneOrEmail: '',
      confirmationResult: null,
      expectedOtp: null,
      countryCode: 'US',
      currency: 'USD',
      legalFirstName: '',
      legalLastName: '',
      dob: '',
      zipCode: '',
      city: '',
      stateRegion: '',
      addressLine: '',
      kycId: '',
      hasLinkedCard: false,
      cashtag: '',
      pin: '',
      cardColor: 'silver',
    };
  });

  // 3. Auto-save everything on change
  useEffect(() => {
    sessionStorage.setItem('ob_step', currentStep.toString());
    sessionStorage.setItem('ob_data', JSON.stringify(onboardingData));
  }, [currentStep, onboardingData]);

  const updateData = (field, value) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      sessionStorage.removeItem('ob_data');
      sessionStorage.removeItem('ob_step');
      navigate('/welcome'); 
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };


  const renderStep = () => {
    if (currentStep === 1) return <PhoneOrEmail data={onboardingData} updateData={updateData} onNext={handleNext} />;
    if (currentStep === 2) return <VerifyOtp data={onboardingData} onNext={handleNext} />;
    if (currentStep === 3) return <LegalName data={onboardingData} updateData={updateData} onNext={handleNext} />;
    if (currentStep === 4) return <DOB data={onboardingData} updateData={updateData} onNext={handleNext} />;
    if (currentStep === 5) return <HomeAddress data={onboardingData} updateData={updateData} onNext={handleNext} />;
    if (currentStep === 6) return <DynamicKYC data={onboardingData} updateData={updateData} onNext={handleNext} />;
    if (currentStep === 7) return <AddDebitCard data={onboardingData} updateData={updateData} onNext={handleNext} />;
    if (currentStep === 8) return <Linking onNext={handleNext} />;
    if (currentStep === 9) return <Cashtag data={onboardingData} updateData={updateData} onNext={handleNext} />;
   if (currentStep === 10) return <PinSetup data={onboardingData} updateData={updateData} onNext={handleNext} />;
   if (currentStep === 11) return <MeetCard updateData={updateData} onNext={handleNext} />;
    if (currentStep === 12) return <SyncContacts updateData={updateData} onNext={handleNext} />;
    if (currentStep === 13) return <WelcomeSuccess data={onboardingData} />;
    
    return <div className="onboarding-content">Unknown Step</div>;
  };

  return (
    <div className="onboarding-wrapper">
      <header className="onboarding-top-nav">
        <button onClick={handleBack} className="ob-back-btn">
          <CaretLeft size={24} weight="bold" />
        </button>
        <button className="ob-help-btn">?</button>
      </header>
      {renderStep()}
    </div>
  );
};

export default OnboardingManager;