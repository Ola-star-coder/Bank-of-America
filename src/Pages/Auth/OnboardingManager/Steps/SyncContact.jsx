import { useState } from 'react';
import { UsersThree, CircleNotch } from 'phosphor-react';
import '../Onboarding.css';

const SyncContacts = ({ updateData, onNext }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = (didSync) => {
    updateData('contactsSynced', didSync);
    
    if (didSync) {
      setIsSyncing(true);
      // Fake delay to simulate pulling native phone contacts
      setTimeout(() => {
        setIsSyncing(false);
        onNext();
      }, 1500);
    } else {
      onNext();
    }
  };

  return (
    <>
      <div className="onboarding-content">
        
        <div style={{ 
          width: '64px', height: '64px', background: '#10B981', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: 'white', marginBottom: '1.5rem', marginTop: '2rem'
        }}>
          <UsersThree size={32} weight="fill" />
        </div>

        <h1 className="ob-title">Sync your contacts to find them on Bridge</h1>
        <p className="ob-subtitle" style={{ marginBottom: '2rem' }}>
          This helps you find, invite, and securely pay friends. You can manage syncing anytime in your Security & privacy settings.
        </p>

        <button className="ob-help-link" style={{ textAlign: 'left', margin: '0' }}>
          How Bridge uses your contacts
        </button>
      </div>

      <div className="bottom-action-bar stacked">
        <button className="ob-secondary-btn" onClick={() => handleSync(false)} disabled={isSyncing}>
          Not now
        </button>
        <button className="ob-next-btn" onClick={() => handleSync(true)} disabled={isSyncing}>
          {isSyncing ? <CircleNotch size={24} className="spin" /> : 'Sync contacts'}
        </button>
      </div>
    </>
  );
};

export default SyncContacts;