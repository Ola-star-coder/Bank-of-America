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
  
  // Swipe Physics State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  
  const timerRef = useRef(null); 

  // Added dynamic 'color' for the progress bars
  const slides = [
    { id: 0, title: "Welcome to the future.", subtitle: "Your new, smarter financial hub is ready. Setup takes just 4 steps.", image: img1, color: "#3B82F6" }, // Blue
    { id: 1, title: "One account. No borders.", subtitle: "Hold, exchange, and spend over 40 currencies instantly with real-time rates.", image: img2, color: "#10B981" }, // Green
    { id: 2, title: "Seamless, Lightning", subtitle: "Transfer money instantly across borders with no hidden fees.", image: img3, color: "#8B5CF6" }, // Purple
    { id: 3, title: "Design your first card.", subtitle: "Claim a unique tag and pick your favorite metal card color.", image: img4, color: "#F59E0B" }, // Orange
    { id: 4, title: "Let's build your vault.", subtitle: "Fund your wallet and explore the apps tailored to your goals.", image: img5, color: "#EC4899" }  // Pink
  ];

  const durationPerSlide = 5000;

  // --- HAPTIC FEEDBACK HELPER ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40); // Short, premium tick
    }
  };

  // --- AUTO-ADVANCE TIMER ---
  useEffect(() => {
    if (isDragging) return; // Pause timer when finger is on screen

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
  }, [currentSlide, isDragging]);

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
    navigate('/register');
  };

  // --- SWIPE PHYSICS & TOUCH HANDLERS ---
  const handlePointerDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = window.innerWidth * 0.15; // Must swipe 15% of screen to change

    if (dragOffset < -swipeThreshold) {
      goToNextSlide(); // Swiped left
    } else if (dragOffset > swipeThreshold) {
      goToPrevSlide(); // Swiped right
    } else if (Math.abs(dragOffset) < 10) {
      // It was a tap, not a drag! Calculate tap zones.
      const clickX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
      if (clickX < window.innerWidth * 0.3) {
        goToPrevSlide();
      } else {
        goToNextSlide();
      }
    }
    
    setDragOffset(0); // Snap back
  };

  return (
    <div className="welcome-story-container">
      
      {/* STORY PROGRESS BARS (Dynamic Colors) */}
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

      {/* THE SLIDING TRACK (WITH 1:1 DRAG PHYSICS) */}
      <div 
        className={`slider-track ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        // Native mobile touch events for better support
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ 
          transform: `translateX(calc(-${currentSlide * 100}vw + ${dragOffset}px))` 
        }}
      >
        {slides.map((slide, index) => (
          <div className="slide-item" key={slide.id}>
            
            {/* Top 70% - Graphic Area with PARALLAX */}
            <div className="slide-graphic-area">
              <div 
                className="parallax-bg"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                  // Parallax math: Moves the image slightly in the opposite direction
                  transform: `translateX(${(index - currentSlide) * 30}vw)` 
                }}
              />
              <div className="img-overlay-blend"></div>
            </div>

            {/* Bottom 30% - Text Card */}
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
         <button className="slider-primary-btn" onClick={(e) => { e.stopPropagation(); goToNextSlide(); }}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
         </button>
      </div>

    </div>
  );
};

export default Welcome;