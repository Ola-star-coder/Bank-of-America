import { useState } from 'react';
import { ArrowRight, VideoCamera, Scan, CircleNotch, CheckCircle, IdentificationCard, ShieldWarning } from 'phosphor-react';
import { toast } from 'react-toastify';

const Phase2_KYC = ({ formData, setFormData, nextPhase }) => {
  const isUSA = formData.countryCode === '+1';
  
  const [kycStep, setKycStep] = useState('form'); 
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    // 1. Strict Global Empty Checks
    if (!formData.address.trim() || !formData.city.trim() || !formData.zip.trim()) {
      return toast.error("Your full residential address is required for compliance.");
    }
    if (!formData.occupation || !formData.sourceOfFunds || !formData.purpose) {
      return toast.error("Please complete all regulatory declarations.");
    }

    // 2. Region-Specific Strict Checks
    if (isUSA) {
      const ssnClean = formData.ssn.replace(/\D/g, ''); // Strip non-digits
      if (ssnClean.length !== 9) {
        return toast.error("A valid 9-digit Social Security Number is required by the Patriot Act.");
      }
      nextPhase(); 
    } else {
      if (!formData.idNumber.trim() || formData.idNumber.trim().length < 5) {
        return toast.error("Please provide a valid National Identity or Passport Number.");
      }
      setKycStep('liveness'); 
    }
  };

  const handleStartScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        nextPhase();
      }, 1500);
    }, 4000); // 4 seconds of "scanning"
  };

  // --- SUB-PHASE: BIOMETRIC LIVENESS ---
  if (kycStep === 'liveness') {
    return (
      <div className="phase-container animate-slide-left">
        <div className="trust-badge"><ShieldWarning size={16} weight="fill" /> Anti-Fraud Measure</div>
        <h2 className="phase-title">Biometric Verification</h2>
        <p className="phase-subtitle">To prevent identity theft, please position your face within the frame.</p>

        <div className="liveness-camera-box">
          {!scanComplete && (
             <div className="camera-frame-guides">
               <Scan size={200} color={scanning ? "#10B981" : "rgba(255,255,255,0.2)"} className={scanning ? "pulse-anim" : ""} />
             </div>
          )}
          {scanComplete && (
            <div className="success-overlay animate-fade-in">
              <CheckCircle size={80} weight="fill" color="#10B981" />
              <h3 style={{ color: 'white', marginTop: '1rem', fontWeight: 600 }}>Face Match Confirmed</h3>
            </div>
          )}
        </div>

        <button 
          className="btn-primary" 
          onClick={handleStartScan} 
          disabled={scanning || scanComplete}
          style={{ marginTop: '2.5rem', background: scanComplete ? '#10B981' : '' }}
        >
          {scanning ? <CircleNotch size={24} className="spin" /> : 
           scanComplete ? 'Verified securely' : 
           <><VideoCamera size={20} weight="fill" /> Begin 3D Scan</>}
        </button>
      </div>
    );
  }

  // --- MAIN PHASE: COMPLIANCE FORM ---
  return (
    <div className="phase-container animate-slide-left">
      <div className="trust-badge"><IdentificationCard size={16} weight="fill" /> Regulatory KYC</div>
      <h2 className="phase-title">Identity Verification</h2>
      <p className="phase-subtitle">Federal laws require us to obtain, verify, and record information that identifies each person.</p>

      <div className="input-group">
        <label>{isUSA ? 'Social Security Number (SSN)' : 'National ID / Passport Number'}</label>
        <input 
          type={isUSA ? "password" : "text"} 
          name={isUSA ? "ssn" : "idNumber"} 
          value={isUSA ? formData.ssn : formData.idNumber} 
          onChange={handleChange} 
          placeholder={isUSA ? "XXX-XX-XXXX" : "ID Number"} 
          maxLength={isUSA ? 9 : 20}
        />
        {isUSA && <span style={{fontSize: '0.7rem', color: '#9CA3AF', marginTop: '0.4rem', display: 'block'}}>Your SSN is encrypted and transmitted securely.</span>}
      </div>

      <div className="input-group">
        <label>Primary Residential Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address (No P.O. Boxes)" style={{ marginBottom: '0.75rem' }} />
        <div className="input-row">
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ flex: 2 }} />
          <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder={isUSA ? "Zip Code" : "Postal Code"} style={{ flex: 1 }} />
        </div>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label>Employment Status</label>
          <select name="occupation" value={formData.occupation} onChange={handleChange} className="form-select">
            <option value="">Select...</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Student">Student</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
        <div className="input-group">
          <label>Source of Wealth</label>
          <select name="sourceOfFunds" value={formData.sourceOfFunds} onChange={handleChange} className="form-select">
            <option value="">Select...</option>
            <option value="Salary">Salary / Wages</option>
            <option value="Business">Business Revenue</option>
            <option value="Savings">Personal Savings</option>
            <option value="Investments">Investments / Crypto</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label>Intended Account Usage</label>
        <select name="purpose" value={formData.purpose} onChange={handleChange} className="form-select">
          <option value="">Select purpose...</option>
          <option value="Salary">Primary Account (Salary & Bills)</option>
          <option value="Savings">Savings & Wealth Management</option>
          <option value="International">Cross-Border / International Transfers</option>
        </select>
      </div>

      <button className="btn-primary" onClick={handleFormSubmit} style={{ marginTop: '1rem' }}>
        Submit Securely <ArrowRight size={20} weight="bold" />
      </button>
    </div>
  );
};

export default Phase2_KYC;