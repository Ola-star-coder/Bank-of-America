import { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete, isAppLoading }) => {
  const [phase, setPhase] = useState('drop');
  const [minTimeMet, setMinTimeMet] = useState(false);

  // 1. The 5-Second Cinematic Timeline
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('connect'), 800);    // Wait, then Connect
    const t2 = setTimeout(() => setPhase('text'), 2000);      // Show Text
    const t3 = setTimeout(() => {
      setMinTimeMet(true);
      setPhase('shimmer'); // Switch to loading shimmer if we need to wait
    }, 4000); // 4 seconds of guaranteed animation

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // 2. The Handoff (Only when 5 seconds have passed AND Firebase is ready)
  useEffect(() => {
    if (minTimeMet && !isAppLoading) {
      setPhase('reveal'); // Trigger the smooth exit animation
      const t4 = setTimeout(() => onComplete(), 800); // Wait for fade-out to finish
      return () => clearTimeout(t4);
    }
  }, [minTimeMet, isAppLoading, onComplete]);

  return (
    <div className={`splash-container ${phase === 'reveal' ? 'smooth-exit' : ''}`}>
      <div className={`logo-container phase-${phase}`}>
        
        {/* The Split "B" SVG */}
        <svg viewBox="0 0 60 60" className="bridge-logo" xmlns="http://www.w3.org/2000/svg">
          {/* The Vertical Pillar */}
          <rect className="logo-pillar" x="12" y="10" width="10" height="40" rx="4" fill="#FFFFFF" />
          
          {/* The Flowing Double-Curve */}
          <path className="logo-curve" d="M26 10 h10 c8.8 0 14 5.2 14 10 c0 4.2 -2.5 7.5 -6 9 c4 1 8 4.5 8 10 c0 6 -6 11 -14 11 h-12 v-8 h10 c4 0 6 -2 6 -5 c0 -3.5 -2.5 -5 -6 -5 h-6 v-8 h8 c3.5 0 5 -1.5 5 -4 c0 -3 -2 -4 -5 -4 h-8 v-8 z" fill="#FFFFFF" />
          
          {/* The Volt Green Ping */}
          <circle className="logo-dot" cx="48" cy="12" r="4" fill="#10B981" />
        </svg>

        {/* The Text Reveal */}
        <h1 className="bridge-text">Bridge</h1>
      </div>
    </div>
  );
};

export default SplashScreen;