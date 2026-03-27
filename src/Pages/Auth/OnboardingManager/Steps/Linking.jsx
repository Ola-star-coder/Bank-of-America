import { useEffect } from 'react';
import { CircleNotch } from 'phosphor-react';
import '../Onboarding.css';

const Linking = ({ onNext }) => {

  useEffect(() => {
    // Simulate a secure network connection delay (2.5 seconds)
    const timer = setTimeout(() => {
      onNext();
    }, 6500);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="onboarding-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '30vh' }}>
      <CircleNotch size={48} color="#111827" className="spin" style={{ marginBottom: '1rem' }} />
      <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>Linking...</p>
    </div>
  );
};

export default Linking;