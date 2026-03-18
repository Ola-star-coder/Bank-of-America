import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css'; 

// Import our new phases
import Phase1_Identity from './RegistrationSteps/Phase1_identity';
import Phase2_KYC from './RegistrationSteps/Phase2_KYC';
// import Phase3_Vault from './RegistrationSteps/Phase3_Vault';
// import Phase4_Security from './RegistrationSteps/Phase4_Security';

const Register = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  
  // The Master State Object - Holds everything until Step 4
  const [formData, setFormData] = useState({
    // Phase 1
    firstName: '', lastName: '', dob: '', countryCode: '+1', phone: '', email: '', password: '',
    // Phase 2 (USA)
    ssn: '', address: '', city: '', state: '', zip: '', occupation: '', purpose: '', sourceOfFunds: '',
    // Phase 2 (Intl)
    idNumber: '',
    // Phase 3 & 4
    cashtag: '', cardSkin: 'silver-card', transactionPin: ''
  });

  const nextPhase = () => setCurrentPhase(prev => prev + 1);
  const prevPhase = () => setCurrentPhase(prev => prev - 1);

  // The Top Progress Bar
  const renderProgressBar = () => (
    <div className="story-progress-container" style={{ position: 'relative', top: 0, left: 0, right: 0, marginBottom: '2rem' }}>
      {[1, 2, 3, 4].map(step => (
        <div key={step} className="story-track" style={{ background: '#E5E7EB' }}>
          <div 
            className="story-fill" 
            style={{ 
              width: currentPhase >= step ? '100%' : '0%', 
              backgroundColor: '#0E648E' 
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="auth-container page-fade">
      <div className="auth-content" style={{ maxWidth: '540px' }}>
        
        <header className="auth-header" style={{ marginBottom: '1.5rem' }}>
           {currentPhase === 1 ? (
             <Link to="/login" className="back-arrow">←</Link>
           ) : (
             <button onClick={prevPhase} className="back-arrow" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
           )}
           {renderProgressBar()}
        </header>

        {/* Phase Routing */}
        {currentPhase === 1 && <Phase1_Identity formData={formData} setFormData={setFormData} nextPhase={nextPhase} />}
        {currentPhase === 2 && <Phase2_KYC formData={formData} setFormData={setFormData} nextPhase={nextPhase} />}
        
        {/* We will build these next! */}
        {currentPhase === 3 && <div>Phase 3: Vault Setup (Coming Next) <button onClick={nextPhase}>Skip for now</button></div>}
        {currentPhase === 4 && <div>Phase 4: Security PIN (Coming Soon)</div>}

        {currentPhase === 1 && (
          <div className="login-prompt">
             Already have an account? <Link to="/login">Log in</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;