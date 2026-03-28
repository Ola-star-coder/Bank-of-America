import { useEffect, useRef } from 'react';
import { CircleNotch } from 'phosphor-react';
import '../Onboarding.css';

const Linking = ({ data, onNext }) => {
  // Gatekeeper to prevent React Strict Mode from double-firing the skip!
  const hasFired = useRef(false);

  useEffect(() => {
    // If it already ran once, stop it from running again
    if (hasFired.current) return;

    // If they skipped linking their card, instantly jump to next screen!
    if (!data?.hasLinkedCard) {
      hasFired.current = true;
      onNext();
      return;
    }

    // Simulate a secure network connection delay
    const timer = setTimeout(() => {
      hasFired.current = true;
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [data, onNext]);

  // Prevent UI flash if they skipped
  if (!data?.hasLinkedCard) return null;

  return (
    <div className="onboarding-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '30vh' }}>
      <CircleNotch size={48} color="#111827" className="spin" style={{ marginBottom: '1rem' }} />
      <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>Linking securely...</p>
    </div>
  );
};

export default Linking;