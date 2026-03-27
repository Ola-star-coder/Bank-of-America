import { useState, useEffect, useRef } from 'react';
import { CircleNotch, MapPin, CheckCircle, CaretDown } from 'phosphor-react';
import { toast } from 'react-toastify';
import '../Onboarding.css';

// Quick list of major Nigerian states for the MVP
const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", 
  "Enugu", "Delta", "Kaduna", "Edo", "Ogun"
];

const HomeAddress = ({ data, updateData, onNext }) => {
  const [addressLine, setAddressLine] = useState(data.addressLine || '');
  const [zipCode, setZipCode] = useState(data.zipCode || '');
  const [city, setCity] = useState(data.city || '');
  const [stateRegion, setStateRegion] = useState(data.stateRegion || '');
  
  const [isLocating, setIsLocating] = useState(false);
  const [zipValid, setZipValid] = useState(false);
  const inputRef = useRef(null);

  const isNigeria = data.countryCode === 'NG';

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // --- ZIPPOPOTAM.US API LOGIC (For US/EU) ---
  useEffect(() => {
    if (isNigeria) return; // Skip API for Nigeria

    const fetchLocation = async () => {
      // US Zip codes are 5 digits. Germany is 5. UK/CA vary, but let's trigger at 5 for this MVP.
      if (zipCode.length >= 5) {
        setIsLocating(true);
        try {
          // Defaulting to US for the API if it's a 5 digit code, 
          // You can make the 'us' dynamic based on data.countryCode if you want EU support!
          const country = data.countryCode === 'DE' ? 'de' : 'us'; 
          
          const response = await fetch(`https://api.zippopotam.us/${country}/${zipCode}`);
          if (response.ok) {
            const locData = await response.json();
            const place = locData.places[0];
            setCity(place['place name']);
            setStateRegion(place['state abbreviation'] || place['state']);
            setZipValid(true);
          } else {
            setCity('');
            setStateRegion('');
            setZipValid(false);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLocating(false);
        }
      } else {
        setZipValid(false);
        setCity('');
        setStateRegion('');
      }
    };

    const timeoutId = setTimeout(fetchLocation, 500); // Debounce typing
    return () => clearTimeout(timeoutId);
  }, [zipCode, isNigeria, data.countryCode]);

  // --- VALIDATION ---
  const isValid = () => {
    if (addressLine.trim().length < 4) return false;
    if (isNigeria) {
      return city.trim().length > 2 && stateRegion !== '';
    } else {
      return zipValid; // Must have successfully pulled city/state from ZIP
    }
  };

  const handleNextClick = () => {
    if (!isValid()) return;
    
    updateData('addressLine', addressLine.trim());
    updateData('city', city.trim());
    updateData('stateRegion', stateRegion);
    if (!isNigeria) updateData('zipCode', zipCode.trim());
    
    onNext();
  };

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title">What's your home address?</h1>
        <p className="ob-subtitle" style={{ marginBottom: '1.5rem' }}>
          We need this to verify your identity.
        </p>

        {/* Address Line 1 (Universal) */}
        <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1rem' }}>
          <MapPin size={20} color="#9CA3AF" style={{ marginLeft: '1rem' }} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Street address" 
            className="ob-input-field"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
          />
        </div>

        {/* DYNAMIC RENDER BASED ON COUNTRY */}
        {isNigeria ? (
          /* NIGERIA UI: State Dropdown & City Input */
          <>
            <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1rem', paddingRight: '1rem' }}>
              <select 
                className="ob-input-field" 
                style={{ appearance: 'none', cursor: 'pointer', paddingLeft: '1rem' }}
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
              >
                <option value="" disabled>Select State</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <CaretDown size={16} color="#6B7280" />
            </div>

            <div className="ob-input-group" style={{ marginTop: '0' }}>
              <input 
                type="text" 
                placeholder="City / Town" 
                className="ob-input-field email-mode"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </>
        ) : (
          /* US/EU UI: ZIP Code with Auto-fill */
          <>
            <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder="ZIP Code" 
                className="ob-input-field email-mode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              />
              <div style={{ paddingRight: '1rem' }}>
                {isLocating && <CircleNotch size={20} color="#6B7280" className="spin" />}
                {zipValid && !isLocating && <CheckCircle size={20} color="#10B981" weight="fill" />}
              </div>
            </div>

            {/* Read-only City/State visual feedback */}
            {zipValid && (
              <div style={{ display: 'flex', gap: '0.5rem', animation: 'fadeIn 0.3s ease' }}>
                <div className="ob-input-group" style={{ marginTop: '0', flex: 2, background: '#F9FAFB' }}>
                  <input type="text" className="ob-input-field email-mode" value={city} disabled style={{ color: '#6B7280' }}/>
                </div>
                <div className="ob-input-group" style={{ marginTop: '0', flex: 1, background: '#F9FAFB' }}>
                  <input type="text" className="ob-input-field email-mode" value={stateRegion} disabled style={{ color: '#6B7280', textAlign: 'center' }}/>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bottom-action-bar">
        <button 
          className="ob-next-btn" 
          onClick={handleNextClick} 
          disabled={!isValid()}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default HomeAddress;