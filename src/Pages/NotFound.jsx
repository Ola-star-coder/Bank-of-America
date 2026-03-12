import { useNavigate } from 'react-router-dom';
import { House, ArrowLeft } from 'phosphor-react';
import './NotFound.css'; // Importing your dedicated CSS!

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-wrapper page-fade">
      
      {/* The Animated "Dropped Chart" SVG */}
      <div className="chart-container">
        <svg viewBox="0 0 200 100" className="chart-svg">
          {/* The line that goes steadily up, peaks, then crashes down */}
          <path 
            d="M 10 80 L 40 60 L 70 65 L 100 30 L 130 15 L 150 40 L 180 90" 
            className="chart-line" 
          />
          {/* The glowing red dot at the bottom */}
          <circle cx="180" cy="90" r="6" className="crash-dot" />
        </svg>
      </div>

      <h1 className="nf-title">404</h1>
      <h2 className="nf-subtitle">Market Drop</h2>
      
      <p className="nf-desc">
        Our charts show a sudden drop. The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="nf-actions">
          <button className="nf-btn nf-btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} weight="bold" />
            Go Back
          </button>

          <button className="nf-btn nf-btn-primary" onClick={() => navigate('/')}>
            <House size={20} weight="bold" />
            Dashboard
          </button>
      </div>

    </div>
  );
};

export default NotFound;