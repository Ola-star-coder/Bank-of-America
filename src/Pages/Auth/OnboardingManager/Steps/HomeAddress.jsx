import { useState, useEffect, useRef } from 'react';
import { NavigationArrow, MagnifyingGlass, MapPin, CaretDown, CircleNotch, CheckCircle } from 'phosphor-react';
import { toast } from 'react-toastify';
import { nigerianStates, nigerianStatesAndLGAs } from '../../../../Data/NigeriaData';
import '../Onboarding.css';


const LOCATION_IQ_KEY = 'pk.ef3e1243a7d4a750583a713d4a29843c '; 

const HomeAddress = ({ data, updateData, onNext }) => {
  const [viewMode, setViewMode] = useState('default'); 
  
  // Form State
  const [addressLine, setAddressLine] = useState(data.addressLine || '');
  const [aptNumber, setAptNumber] = useState(''); 
  const [stateRegion, setStateRegion] = useState(data.stateRegion || '');
  const [cityLGA, setCityLGA] = useState(data.city || '');
  const [zipCode, setZipCode] = useState(data.zipCode || '');
  
  // Search & Loading State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const wrapperRef = useRef(null);

  const availableLGAs = stateRegion ? nigerianStatesAndLGAs[stateRegion] || [] : [];
  const isNigeria = data.countryCode === 'NG';

  // --- HELPER: Clean OSM Data to match our Nigerian Array ---
  const cleanStateString = (osmState) => {
    if (!osmState) return '';
    let cleaned = osmState.replace(' State', '').trim();
    if (cleaned === 'Federal Capital Territory') return 'Abuja (FCT)';
    return cleaned;
  };

  // --- 1. THE GPS FLOW (Reverse Geocoding) ---
  const handleLocationClick = () => {
    setIsGpsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Location services are disabled on this device.");
      setIsGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${LOCATION_IQ_KEY}&lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
        const result = await response.json();
        
        if (result.address) {
          populateFormWithData(result.address);
        }
      } catch (error) {
        toast.error("Failed to pinpoint location. Please search manually.");
        setViewMode('manual');
      } finally {
        setIsGpsLoading(false);
      }
    }, () => {
      toast.error("Please allow location access, or search manually.");
      setIsGpsLoading(false);
    });
  };

  // --- 2. THE SEARCH FLOW (Autocomplete) ---
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const fetchPlaces = async () => {
      setIsSearchLoading(true);
      try {
        const countryLimit = data.countryCode ? data.countryCode.toLowerCase() : 'ng';
        const response = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${LOCATION_IQ_KEY}&q=${searchQuery}&limit=8&countrycodes=${countryLimit}&addressdetails=1`);
        
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchPlaces, 500); 
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, data.countryCode]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // --- 3. DATA POPULATION LOGIC ---
  const populateFormWithData = (addressObj) => {
    const foundState = cleanStateString(addressObj.state || addressObj.region || '');
    setStateRegion(foundState);

    const foundCity = addressObj.city || addressObj.town || addressObj.county || addressObj.suburb || '';
    setCityLGA(foundCity);

    let foundStreet = '';
    if (addressObj.road) {
      foundStreet = addressObj.house_number ? `${addressObj.house_number} ${addressObj.road}` : addressObj.road;
    } else if (addressObj.pedestrian || addressObj.neighbourhood) {
      foundStreet = addressObj.pedestrian || addressObj.neighbourhood;
    }
    setAddressLine(foundStreet);

    if (!isNigeria && addressObj.postcode) {
      setZipCode(addressObj.postcode);
    }

    setSearchQuery('');
    setSearchResults([]);
    setShowSuccessBanner(true);
    setViewMode('manual');
    
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  // --- SUBMIT ---
  const handleNextClick = () => {
    const finalAddress = aptNumber ? `${addressLine}, ${aptNumber}` : addressLine;
    updateData('addressLine', finalAddress.trim());
    updateData('stateRegion', stateRegion);
    updateData('city', cityLGA);
    if (!isNigeria) updateData('zipCode', zipCode);
    onNext();
  };

  const isFormValid = addressLine && stateRegion && cityLGA && (isNigeria || zipCode.length >= 3);
  const isDropdownOpen = searchResults.length > 0;

  return (
    <>
      <div className="onboarding-content">
        <h1 className="ob-title" style={{ lineHeight: '1.2' }}>Let's know you. <br/>Where do you live?</h1>
        <p className="ob-subtitle" style={{ marginBottom: '2.5rem', fontSize: '15px', lineHeight: '1.6' }}>
          We need your primary residence to secure your account. No P.O. Boxes, please.
        </p>

        {/* --- VIEW 1: THE "LAZY" FLOW --- */}
        {viewMode === 'default' && (
          <div className="address-quick-flow animate-fade-in">
            
            <button 
              onClick={handleLocationClick}
              disabled={isGpsLoading}
              style={{
                width: '100%', padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0',
                borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px',
                color: '#166534', fontWeight: '600', fontSize: '16px', cursor: 'pointer',
                marginBottom: '24px', transition: 'all 0.2s ease',
                opacity: isGpsLoading ? 0.7 : 1, transform: isGpsLoading ? 'scale(0.98)' : 'scale(1)'
              }}
            >
              <div style={{ background: '#DCFCE7', padding: '10px', borderRadius: '50%', display: 'flex' }}>
                {isGpsLoading ? <CircleNotch size={20} className="spin" /> : <NavigationArrow size={20} weight="fill" />}
              </div>
              {isGpsLoading ? 'Pinpointing location...' : 'Auto-locate my address'}
            </button>

            {/* FIX: zIndex increased to 999 to float over the bottom bar */}
            <div ref={wrapperRef} style={{ position: 'relative', zIndex: 999 }}>
              <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '24px', position: 'relative' }}>
                {isSearchLoading ? (
                  <CircleNotch size={20} className="spin" color="#0E648E" style={{ marginLeft: '1rem' }}/>
                ) : (
                  <MagnifyingGlass size={20} color="#9CA3AF" style={{ marginLeft: '1rem' }} />
                )}
                <input 
                  type="text" 
                  placeholder="Search for your street..." 
                  className="ob-input-field"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  style={{ fontSize: '16px' }}
                />
              </div>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%', 
                  background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', 
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', overflow: 'hidden',
                  maxHeight: '390px', 
                  overflowY: 'auto', overscrollBehavior: 'contain'
                }}>
                  {searchResults.map((place, i) => {
                    const parts = place.display_name.split(',');
                    const primaryText = parts[0];
                    const secondaryText = parts.slice(1).join(',').trim();

                    return (
                      <div 
                        key={i} 
                        onClick={() => populateFormWithData(place.address || {})}
                        style={{ 
                          padding: '16px', borderBottom: '1px solid #F3F4F6', 
                          cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px',
                          transition: 'background 0.2s ease', animation: `fadeIn 0.3s ease ${i * 0.05}s both`
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                      >
                        <div style={{ background: '#F3F4F6', padding: '8px', borderRadius: '50%', flexShrink: 0 }}>
                          <MapPin size={18} color="#6B7280" weight="fill" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden', paddingTop: '2px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>
                            {primaryText}
                          </span>
                          <span style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>
                            {secondaryText}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ padding: '14px', textAlign: 'center', background: '#F9FAFB', fontSize: '12px', color: '#9CA3AF', fontWeight: '700' }}>
                    Powered by LocationIQ
                  </div>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button 
                onClick={() => setViewMode('manual')}
                style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                Enter address manually instead
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 2: THE MANUAL / CONFIRMATION FALLBACK --- */}
        {viewMode === 'manual' && (
          <div className="address-manual-flow animate-fade-in">
            
            {showSuccessBanner && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ECFDF5', color: '#065F46', padding: '14px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '600', animation: 'fadeIn 0.3s ease' }}>
                <CheckCircle size={22} weight="fill" />
                Address found! Please confirm below.
              </div>
            )}

            <label className="ob-small-label" style={{ letterSpacing: '0.5px' }}>State / Region</label>
            <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1.25rem', paddingRight: '1rem' }}>
              {isNigeria ? (
                <select 
                  className="ob-input-field" 
                  style={{ appearance: 'none', cursor: 'pointer', paddingLeft: '1rem', fontSize: '16px' }}
                  value={stateRegion}
                  onChange={(e) => { setStateRegion(e.target.value); setCityLGA(''); }}
                >
                  <option value="" disabled>Select State</option>
                  {nigerianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              ) : (
                <input type="text" className="ob-input-field email-mode" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} placeholder="e.g. Ontario" style={{ fontSize: '16px' }} />
              )}
              <CaretDown size={16} color="#6B7280" />
            </div>

            <label className="ob-small-label" style={{ letterSpacing: '0.5px' }}>{isNigeria ? 'City / LGA' : 'City'}</label>
            <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1.25rem', paddingRight: '1rem' }}>
              {isNigeria ? (
                <select 
                  className="ob-input-field" 
                  style={{ appearance: 'none', cursor: 'pointer', paddingLeft: '1rem', fontSize: '16px' }}
                  value={cityLGA}
                  onChange={(e) => setCityLGA(e.target.value)}
                  disabled={!stateRegion}
                >
                  <option value="" disabled>Select LGA</option>
                  {availableLGAs.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                </select>
              ) : (
                <input type="text" className="ob-input-field email-mode" value={cityLGA} onChange={(e) => setCityLGA(e.target.value)} placeholder="e.g. Toronto" style={{ fontSize: '16px' }} />
              )}
              <CaretDown size={16} color={stateRegion || !isNigeria ? "#6B7280" : "#D1D5DB"} />
            </div>

            <label className="ob-small-label" style={{ letterSpacing: '0.5px' }}>Street Address</label>
            <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1.25rem' }}>
              <input 
                type="text" 
                placeholder="e.g. 14 Main Road" 
                className="ob-input-field email-mode"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                style={{ fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 2 }}>
                <label className="ob-small-label" style={{ letterSpacing: '0.5px' }}>Apt / Suite (Optional)</label>
                <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1rem', background: '#F9FAFB' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. Apt 4B" 
                    className="ob-input-field email-mode"
                    value={aptNumber}
                    onChange={(e) => setAptNumber(e.target.value)}
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
              
              {!isNigeria && (
                <div style={{ flex: 1 }}>
                  <label className="ob-small-label" style={{ letterSpacing: '0.5px' }}>ZIP / Postal</label>
                  <div className="ob-input-group" style={{ marginTop: '0', marginBottom: '1rem' }}>
                    <input 
                      type="text" 
                      placeholder="M5V 2H1" 
                      className="ob-input-field email-mode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button 
                onClick={() => setViewMode('default')}
                style={{ background: 'none', border: 'none', color: '#0E648E', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                ← Back to search
              </button>
            </div>
          </div>
        )}
      </div>

      <div 
        className="bottom-action-bar" 
        style={{ 
          opacity: isDropdownOpen ? 0.3 : 1, // FIX: Gently fade out the bottom bar when searching
          pointerEvents: isDropdownOpen ? 'none' : 'auto',
          transition: 'opacity 0.2s ease' 
        }}
      >
        <button 
          className="ob-next-btn" 
          onClick={handleNextClick} 
          disabled={viewMode === 'default' || !isFormValid}
        >
          {viewMode === 'default' ? 'Search Address Above' : 'Confirm Address'}
        </button>
      </div>
    </>
  );
};

export default HomeAddress;