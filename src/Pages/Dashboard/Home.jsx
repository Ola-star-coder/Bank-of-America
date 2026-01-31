import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from '../../Firebase/config';
import { 
  Eye, EyeSlash, PaperPlaneTilt, Wallet, 
  CreditCard, SquaresFour, Bell 
} from 'phosphor-react';
import './Dashboard.css';

const Home = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  
  // 1. Initial State (Try to get name from local storage first for speed)
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('last_user_data');
    return {
      balance: 0,
      accountNumber: 'Loading...',
      firstName: saved ? JSON.parse(saved).name : 'User'
    };
  });

  // 2. Fetch REAL Data from Firestore
  useEffect(() => {
    if (!user) return;

    // This listener updates AUTOMATICALLY if the database changes
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData({
          balance: data.balance,
          accountNumber: data.accountNumber,
          firstName: data.fullName.split(' ')[0] // Get first name
        });
      }
    });

    return () => unsub();
  }, [user]);

  // Helper: Format Money (Adds commas and decimals)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // You can change this to 'NGN' for Naira later if you want
    }).format(amount);
  };

  // Dummy Transactions (We will replace these in Phase 2)
  const transactions = [
    { id: 1, title: 'Netflix Subscription', date: 'Today, 9:41 AM', amount: -4500, type: 'debit', icon: 'N' },
    { id: 2, title: 'Welcome Bonus', date: 'Just now', amount: 1000, type: 'credit', icon: 'W' },
  ];

  return (
    <div className="dashboard-container">
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
            {/* 3. SHOW REAL BALANCE */}
            {showBalance ? formatCurrency(userData.balance) : '****'}
          </h1>
          <button onClick={() => setShowBalance(!showBalance)} className="toggle-eye">
            {showBalance ? <Eye size={20} /> : <EyeSlash size={20} />}
          </button>
        </div>

        <div className="card-bottom">
          <div className="acc-details">
            <span>Account Number</span>
            {/* 4. SHOW REAL ACCOUNT NUMBER */}
            <p>{userData.accountNumber} <span className="copy-icon">❐</span></p>
          </div>
          <div className="exp-date">
            <span>Exp</span>
            <p>12/28</p>
          </div>
        </div>
      </div>

      <div className="actions-grid">
        <div className="action-item">
          <button className="action-circle purple"><PaperPlaneTilt size={24} weight="fill" /></button>
          <span>Transfer</span>
        </div>
        <div className="action-item">
          <button className="action-circle green"><Wallet size={24} weight="fill" /></button>
          <span>Top-up</span>
        </div>
        <div className="action-item">
          <button className="action-circle blue"><CreditCard size={24} weight="fill" /></button>
          <span>Cards</span>
        </div>
        <div className="action-item">
          <button className="action-circle grey"><SquaresFour size={24} weight="fill" /></button>
          <span>More</span>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h4>Recent Transactions</h4>
          <button className="see-all">See All</button>
        </div>

        <div className="t-list">
          {transactions.map((t) => (
            <div key={t.id} className="t-item">
              <div className={`t-avatar ${t.type}`}>
                {t.icon}
              </div>
              <div className="t-info">
                <h5>{t.title}</h5>
                <span>{t.date}</span>
              </div>
              <div className={`t-amount ${t.type}`}>
                {t.type === 'credit' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;