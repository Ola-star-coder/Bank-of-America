import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

import img1 from '../../assets/images/onboarding_1.webp';
import img2 from '../../assets/images/onboarding_2.webp';
import img3 from '../../assets/images/onboarding_3.webp';
import img4 from '../../assets/images/onboarding_4.webp';
import img5 from '../../assets/images/onboarding_5.webp';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0); 
  const [isPaused, setIsPaused] = useState(false); 
  
  const timerRef = useRef(null); 

  const slides = [
    { id: 0, title: "Welcome to the future.", subtitle: "Your new, smarter financial hub is ready. Setup takes just 4 steps.", image: img1, color: "#2563EB" },
    { id: 1, title: "One account. No borders.", subtitle: "Hold, exchange, and spend over 40 currencies instantly with real-time rates.", image: img2, color: "#10B981" },
    { id: 2, title: "Seamless, Lightning", subtitle: "Transfer money instantly across borders with no hidden fees.", image: img3, color: "#8B5CF6" },
    { id: 3, title: "Design your first card.", subtitle: "Claim a unique tag and pick your favorite metal card color.", image: img4, color: "#F59E0B" },
    { id: 4, title: "Let's build your vault.", subtitle: "Fund your wallet and explore the apps tailored to your goals.", image: img5, color: "#EC4899" }
  ];

  const durationPerSlide = 5000;

  // --- HAPTIC FEEDBACK ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
  };

  // --- AUTO-ADVANCE TIMER ---
  useEffect(() => {
    if (isPaused) return; // Freezes the progress bar completely when held

    const tickTime = 50; 
    const progressPerTick = (tickTime / durationPerSlide) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleAutoNext();
          return 0; 
        }
        return prev + progressPerTick; // Resumes exactly from where it left off
      });
    }, tickTime);

    return () => clearInterval(timerRef.current);
  }, [currentSlide, isPaused]);

  const handleAutoNext = () => {
    triggerHaptic();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      finishOnboarding();
    }
  };

  // --- MANUAL NAVIGATION ---
  const goToNextSlide = () => {
    triggerHaptic();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      finishOnboarding();
    }
  };

  const goToPrevSlide = () => {
    triggerHaptic();
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    navigate('/onboarding');
  };

  // --- INTERACTION HANDLERS ---
  const handleScreenTap = (e) => {
    const clickX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    if (clickX < window.innerWidth * 0.3) {
      goToPrevSlide();
    } else {
      goToNextSlide();
    }
  };

  const handleHoldStart = () => setIsPaused(true);
  const handleHoldEnd = () => setIsPaused(false);

  return (
    <div className="welcome-story-container">
      
      {/* STORY PROGRESS BARS */}
      <div className="story-progress-container">
        {slides.map((slide, index) => (
          <div key={index} className="story-track">
            <div 
              className={`story-fill ${index < currentSlide ? 'completed' : ''}`}
              style={{
                width: index === currentSlide ? `${progress}%` : (index < currentSlide ? '100%' : '0%'),
                backgroundColor: index <= currentSlide ? slide.color : '#FFFFFF'
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* TOP SKIP BUTTON */}
      <div className="slider-top-bar">
         <button className="skip-text-btn" onClick={(e) => { e.stopPropagation(); finishOnboarding(); }}>
           Skip
         </button>
      </div>

      {/* THE SLIDING TRACK (NO DRAG PHYSICS, JUST TAP/HOLD) */}
      <div 
        className={`slider-track ${isPaused ? 'paused-filter' : ''}`}
        onPointerDown={handleHoldStart}
        onPointerUp={handleHoldEnd}
        onPointerLeave={handleHoldEnd}
        onPointerCancel={handleHoldEnd}
        onClick={handleScreenTap}
        style={{ 
          transform: `translateX(-${currentSlide * 100}vw)` 
        }}
      >
        {slides.map((slide, index) => (
          <div className="slide-item" key={slide.id}>
            
            <div className="slide-graphic-area">
              <div 
                className="parallax-bg"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                  transform: `translateX(${(index - currentSlide) * 40}vw)` 
                }}
              />
              <div className="img-overlay-blend"></div>
            </div>

            <div className="slide-bottom-card">
               <div className="slide-text-content">
                  <h2 className={currentSlide === index ? 'fade-up-anim' : ''}>{slide.title}</h2>
                  <p className={currentSlide === index ? 'fade-up-delayed-anim' : ''}>{slide.subtitle}</p>
               </div>
            </div>

          </div>
        ))}
      </div>

      {/* FIXED BOTTOM CONTROLS */}
      <div className="slider-fixed-controls">
         <button 
           className="slider-primary-btn" 
           onClick={(e) => { e.stopPropagation(); goToNextSlide(); }}
           style={{ backgroundColor: slides[currentSlide].color }}
         >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
         </button>
      </div>

    </div>
  );
};

export default Welcome;