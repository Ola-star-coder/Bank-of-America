import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from '../../Firebase/config';
import { 
  PaperPlaneTilt, Bank, DeviceMobile, Gift, 
  Lightbulb, WifiHigh, CreditCard, SquaresFour, 
  Bell, Wallet
} from 'phosphor-react';
import './Dashboard.css';

// Components
import CardCarousel from '../../components/Cards/CardCarousel';
import ActionSlider from '../../components/Widgets/ActionSlider';
import NotificationSheet from '../../components/Sheets/NotificationSheet';
import { useTransferModal } from '../../Context/TransferModalContext';

const Home = () => {
  const { user } = useAuth();
  const { openTransfer } = useTransferModal();
  const navigate = useNavigate();
  
  // State
  const [showBalance, setShowBalance] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // 1. Lazy State for Instant Name Rendering
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('last_user_data');
    return {
      balance: 0,
      accountNumber: 'Loading...',
      firstName: saved ? JSON.parse(saved).name : 'User',
      transactions: [],
      beneficiaries: [] 
    };
  });

  // 2. Real-time Database Listener
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData({
          balance: data.balance,
          accountNumber: data.accountNumber,
          firstName: data.fullName ? data.fullName.split(' ')[0] : 'User',
          transactions: data.transactions ? [...data.transactions].reverse() : [],
          beneficiaries: data.beneficiaries || []
        });
      }
    });

    return () => unsub();
  }, [user]);

  // Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  return (
    <div className="dashboard-container page-fade">
      
      {/* HEADER */}
      <header className="dash-header">
        {/* Click Profile -> Go to Settings */}
        <div className="user-profile" onClick={() => navigate('/settings')} style={{cursor:'pointer'}}>
          <div className="profile-pic">
             <span>{userData.firstName.charAt(0)}</span>
          </div>
         <div className="greeting">
            <span>{getGreeting()}</span>
            <h3>{userData.firstName}</h3>
          </div>
        </div>
        
        {/* Click Bell -> Open Notifications */}
        <button 
            className="notif-btn" 
            onClick={() => {
                setIsNotifOpen(true);
                setHasUnread(false);
            }}
        >
          <Bell size={20} weight="fill" />
          {hasUnread && <div className="red-dot"></div>}
        </button>
      </header>

      {/* CARDS */}
      <CardCarousel 
          userData={userData} 
          showBalance={showBalance}
          toggleBalance={() => setShowBalance(!showBalance)}
      />

      {/* ACTION GRID */}
      <div className="actions-grid">
        <div className="action-item">
            <button className="action-circle purple" onClick={openTransfer}>
              <PaperPlaneTilt size={24} weight="fill" />
            </button>
            <span>Send</span> 
        </div>
        <div className="action-item">
            <button className="action-circle green">
              <Bank size={24} weight="fill" />
            </button>
            <span>Add Cash</span>
        </div>
        <div className="action-item">
            <button className="action-circle blue">
              <DeviceMobile size={24} weight="fill" />
            </button>
            <span>Mobile</span>
        </div>
        <div className="action-item">
            <button className="action-circle orange">
               <Gift size={24} weight="fill" />
            </button>
            <span>Rewards</span>
        </div>

        {/* Row 2 */}
        <div className="action-item">
            <button className="action-circle yellow">
               <Lightbulb size={24} weight="fill" />
            </button>
            <span>Utilities</span>
        </div>
        <div className="action-item">
            <button className="action-circle red">
               <WifiHigh size={24} weight="bold" />
            </button>
            <span>Internet</span>
        </div>
        <div className="action-item">
            <button className="action-circle cyan" onClick={() => navigate('/cards')}>
               <CreditCard size={24} weight="fill" />
            </button>
            <span>Cards</span>
        </div>
        <div className="action-item">
            <button className="action-circle grey" onClick={openTransfer}>
               <SquaresFour size={24} weight="fill" />
            </button>
            <span>More</span>
        </div>
      </div>

      {/* SLIDER WIDGET */}
      <ActionSlider />

      {/* TRANSACTIONS LIST */}
      <div className="transactions-section">
        <div className="section-header">
          <h4>Recent Activity</h4>
          <button className="see-all" onClick={() => navigate('/transactions')}>See All</button>
        </div>

        <div className="t-list">
          {userData.transactions.length > 0 ? (
            userData.transactions.slice(0, 3).map((t) => (
              <div key={t.id} className="t-item">
                <div className={`t-avatar ${t.type}`}>
                  {t.type === 'credit' ? <Wallet size={20} weight="fill"/> : <PaperPlaneTilt size={20} weight="fill"/>}
                </div>
                <div className="t-info">
                  <h5>{t.title}</h5>
                  <span>{new Date(t.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <div className={`t-amount ${t.type}`}>
                {t.type === 'credit' ? '+' : '-'}${Math.abs(parseFloat(t.amount) || 0).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{textAlign: 'center', padding: '20px', color: '#6B7280', fontSize: '13px'}}>
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* NOTIFICATION SHEET */}
      <NotificationSheet 
         isOpen={isNotifOpen} 
         onClose={() => setIsNotifOpen(false)} 
      />

    </div>
  );
};

export default Home;