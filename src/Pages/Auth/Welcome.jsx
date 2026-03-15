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
    { id: 0, title: "Welcome to the future.", subtitle: "Your new, smarter financial hub is ready. Setup takes just 4 steps.", image: img1 },
    { id: 1, title: "One account. No borders.", subtitle: "Hold, exchange, and spend over 40 currencies instantly with real-time rates.", image: img2 },
    { id: 2, title: "Seamless, Lightning", subtitle: "Transfer money instantly across borders with no hidden fees.", image: img3 },
    { id: 3, title: "Design your first card.", subtitle: "Claim a unique tag and pick your favorite metal card color.", image: img4 },
    { id: 4, title: "Let's build your vault.", subtitle: "Fund your wallet and explore the apps tailored to your goals.", image: img5 }
  ];

  const durationPerSlide = 5000; // 5 seconds per slide

  // --- 1. AUTO-ADVANCE TIMER ---
  useEffect(() => {
    // Freeze the timer if the user is holding the screen
    if (isPaused) return;

    const tickTime = 50; 
    const progressPerTick = (tickTime / durationPerSlide) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleAutoNext();
          return 0; 
        }
        return prev + progressPerTick;
      });
    }, tickTime);

    return () => clearInterval(timerRef.current);
  }, [currentSlide, isPaused]);

  const handleAutoNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      finishOnboarding();
    }
  };

  // --- 2. MANUAL NAVIGATION LOGIC ---
  const goToNextSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      finishOnboarding();
    }
  };

  const goToPrevSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    navigate('/register');
  };

  // --- 3. INTERACTION HANDLERS ---
  const handleScreenTap = (e) => {
    const clickX = e.clientX;
    if (clickX < window.innerWidth * 0.3) {
      goToPrevSlide();
    } else {
      goToNextSlide();
    }
  };

  const handlePrimaryButton = (e) => {
    e.stopPropagation(); 
    goToNextSlide();
  };

  const handleSkipButton = (e) => {
    e.stopPropagation(); 
    finishOnboarding();
  };

  const handleHoldStart = () => setIsPaused(true);
  const handleHoldEnd = () => setIsPaused(false);

  return (
    <div className="welcome-story-container">
      {/* STORY PROGRESS BARS */}
      <div className="story-progress-container">
        {slides.map((_, index) => (
          <div key={index} className="story-track">
            <div 
              className={`story-fill ${index < currentSlide ? 'completed' : ''}`}
              style={index === currentSlide ? { width: `${progress}%` } : {}}
            ></div>
          </div>
        ))}
      </div>

      {/* TOP SKIP BUTTON */}
      <div className="slider-top-bar">
         <button className="skip-text-btn" onClick={handleSkipButton}>Skip</button>
      </div>

      {/* THE SLIDING TRACK */}
      <div 
        className={`slider-track ${isPaused ? 'paused-filter' : ''}`}
        onPointerDown={handleHoldStart}
        onPointerUp={handleHoldEnd}
        onPointerLeave={handleHoldEnd}
        onPointerCancel={handleHoldEnd}
        onClick={handleScreenTap}
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        {slides.map((slide, index) => (
          <div className="slide-item" key={slide.id}>
            <div className="slide-graphic-area" style={{ backgroundImage: `url(${slide.image})` }}>
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
         <button className="slider-primary-btn" onClick={handlePrimaryButton}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
         </button>
      </div>
    </div>
  );
};

export default Welcome;