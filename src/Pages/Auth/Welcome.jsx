import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0, title: "Your Journey, Perfectly Planned", subtitle: "Effortlessly create and organize your dream financial goals.", bgColor: "#E8DFF5", emoji: "🗺️"
    },
    {
      id: 1, title: "Discover Friends Nearby", subtitle: "See where your friends are spending and split bills instantly.", bgColor: "#FCE8E8", emoji: "👋"
    },
    {
      id: 2, title: "Stay Updated with Top Places", subtitle: "Find trending destinations tailored to your budget.", bgColor: "#E2F0CB", emoji: "🌴"
    }
  ];

  // --- NEW: THE AUTO-ADVANCE TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      }
      // If it reaches the end, it just stops and waits for the user to click "Get Started"
    }, 4000); // 4 seconds per slide

    // Cleanup timer if the user manually clicks "Next" before the 4 seconds are up
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      localStorage.setItem('has_seen_onboarding', 'true');
      navigate('/register');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    navigate('/register');
  };

  return (
    <div className="welcome-slider-container">
      
      {/* --- NEW: THE STORY PROGRESS BARS --- */}
      <div className="story-progress-container">
        {slides.map((_, index) => (
          <div key={index} className="story-track">
            <div 
              className={`story-fill ${
                index === currentSlide ? 'active' : 
                index < currentSlide ? 'completed' : ''
              }`}
            ></div>
          </div>
        ))}
      </div>

      <div className="slider-top-bar">
         <button className="skip-text-btn" onClick={handleSkip}>Skip</button>
      </div>

      <div className="slider-track" style={{ transform: `translateX(-${currentSlide * 100}vw)` }}>
        {slides.map((slide) => (
          <div className="slide-item" key={slide.id} style={{ backgroundColor: slide.bgColor }}>
            <div className="slide-graphic-area">
                <div className="mock-illustration-placeholder">{slide.emoji}</div>
            </div>
            <div className="slide-bottom-card">
               <div className="slide-text-content">
                  <h2>{slide.title}</h2>
                  <p>{slide.subtitle}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-fixed-controls">
         <button className="slider-primary-btn" onClick={handleNext}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
         </button>
      </div>

    </div>
  );
};

export default Welcome;