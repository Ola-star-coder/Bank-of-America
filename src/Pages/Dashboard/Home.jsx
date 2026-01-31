import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from '../../Firebase/config';
import { 
  Eye, EyeSlash, PaperPlaneTilt, Bank, 
  CreditCard, SquaresFour, Bell, 
  DeviceMobile, Gift, Lightbulb, WifiHigh, Wallet, ArrowDownLeft 
} from 'phosphor-react';
import './Dashboard.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  
 // 1. Update the State to include transactions array
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('last_user_data');
    return {
      balance: 0,
      accountNumber: 'Loading...',
      firstName: saved ? JSON.parse(saved).name : 'User',
      transactions: [] // <--- NEW: Start empty
    };
  });

  // 2. Update the Database Listener to fetch transactions
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData({
          balance: data.balance,
          accountNumber: data.accountNumber,
          firstName: data.fullName ? data.fullName.split(' ')[0] : 'User',
          // Get the array, or empty if none exists. 
          // Reverse it so newest shows first!
          transactions: data.transactions ? [...data.transactions].reverse() : [] 
        });
      }
    });

    return () => unsub();
  }, [user]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', 
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dash-header">
        <div className="user-profile">
          <div className="profile-pic">
             {/* Uses the first letter of their name */}
             <span>{userData.firstName.charAt(0)}</span>
          </div>
          <div className="greeting">
            <span>Good Morning,</span>
            <h3>{userData.firstName}</h3>
          </div>
        </div>
        
        <button className="notif-btn">
          <Bell size={24} weight="fill" />
          <div className="red-dot"></div>
        </button>
      </header>

      {/* MAIN CARD */}
      <div className="premium-card">
        <div className="card-top">
          <span className="card-label">Total Balance</span>
          <div className="card-brand">
            <span className="circles"></span>
            VISA
          </div>
        </div>
        
        <div className="card-balance">
          <h1>
            {showBalance ? formatMoney(userData.balance) : '$ ****'}
          </h1>
          <button onClick={() => setShowBalance(!showBalance)} className="toggle-eye">
            {showBalance ? <Eye size={20} /> : <EyeSlash size={20} />}
          </button>
        </div>

        <div className="card-bottom">
          <div className="acc-details">
            <span>Account Number</span>
            <p>{userData.accountNumber} <span className="copy-icon">❐</span></p>
          </div>
          <div className="exp-date">
            <span>Exp</span>
            <p>12/28</p>
          </div>
        </div>
      </div>

      {/* NORTH AMERICAN ACTION GRID */}
      <div className="actions-grid">
        {/* Row 1: The Daily Drivers */}
        <div className="action-item">
            <button className="action-circle purple" onClick={() => navigate('/transfer')}>
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

        {/* Row 2: Utilities & Management */}
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
            <button className="action-circle cyan">
               <CreditCard size={24} weight="fill" />
            </button>
            <span>Cards</span>
        </div>
        <div className="action-item">
            <button className="action-circle grey">
               <SquaresFour size={24} weight="fill" />
            </button>
            <span>More</span>
        </div>
      </div>

     {/* TRANSACTIONS SECTION */}
      <div className="transactions-section">
        <div className="section-header">
          <h4>Recent Activity</h4>
          <button className="see-all">See All</button>
        </div>

        <div className="t-list">
          {userData.transactions.length > 0 ? (
            // REAL DATA MAPPING
            userData.transactions.map((t) => (
              <div key={t.id} className="t-item">
                <div className={`t-avatar ${t.type}`}>
                  {/* Using the icon we saved (P or W) */}
                  {t.type === 'credit' ? <Wallet size={20} weight="fill"/> : <PaperPlaneTilt size={20} weight="fill"/>}
                </div>
                <div className="t-info">
                  <h5>{t.title}</h5>
                  <span>{t.date}</span>
                </div>
                <div className={`t-amount ${t.type}`}>
                  {t.type === 'credit' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            // EMPTY STATE (If they haven't done anything yet)
            <div style={{textAlign: 'center', padding: '20px', color: '#6B7280', fontSize: '13px'}}>
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;