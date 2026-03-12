import { useNavigate } from 'react-router-dom';
import { WarningCircle, House, ArrowLeft } from 'phosphor-react';
import './Dashboard/Dashboard.css'; 

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container page-fade" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
         backgroundColor: '#F3F4F6',
        textAlign: 'center', 
        minHeight: '100vh' 
    }}>
      
      <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#151515',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
      }}>
          <WarningCircle size={48} color="#0E648E" weight="fill" />
      </div>

      <h1 style={{ fontSize: '28px', color: '#111827', margin: '0 0 12px 0' }}>
          Page Not Found
      </h1>
      
      <p style={{ color: '#6B7280', margin: '0 0 32px 0', maxWidth: '300px', fontSize: '15px' }}>
          We couldn't find the page you're looking for. It might have been moved or the URL is incorrect.
      </p>

      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '320px' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{
                flex: 1,
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                background: 'white',
                color: '#1F2937',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} weight="bold" />
            Go Back
          </button>

          <button 
            className="main-btn" 
            onClick={() => navigate('/')} 
            style={{ margin: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <House size={20} weight="bold" />
            Home
          </button>
      </div>

    </div>
  );
};

export default NotFound;