import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { 
  Eye, EyeSlash, PaperPlaneTilt, Wallet, 
  CreditCard, SquaresFour, Bell, CaretDown 
} from 'phosphor-react';
import './Dashboard.css';

const Home = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [accountNum, setAccountNum] = useState('Loading...');

  const getFirstName = () => {
    const rawName = user?.displayName || user?.email?.split('@')[0];
    const nameNoNumbers = rawName.replace(/[0-9]/g, '');
    if (!nameNoNumbers) return 'User'; 
    return nameNoNumbers.charAt(0).toUpperCase() + nameNoNumbers.slice(1);
  };

  useEffect(() => {
    const savedNum = localStorage.getItem(`acc_num_${user?.uid}`);
    if (savedNum) {
      setAccountNum(savedNum);
    } else {
      const newNum = '2' + Math.floor(Math.random() * 900000000 + 100000000).toString();
      localStorage.setItem(`acc_num_${user?.uid}`, newNum);
      setAccountNum(newNum);
    }
  }, [user]);

 
  const transactions = [
    { id: 1, title: 'Netflix Subscription', date: 'Today, 9:41 AM', amount: -4500, type: 'debit', icon: 'N' },
    { id: 2, title: 'Janet Rollings', date: 'Yesterday, 4:20 PM', amount: 25000, type: 'credit', icon: 'J' },
    { id: 3, title: 'Data Topup', date: 'Jan 28, 2026', amount: -1000, type: 'debit', icon: 'D' }
  ];

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <div className="user-profile">
          <div className="profile-pic">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" />
            ) : (
              <span>{getFirstName().charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="greeting">
            <span>Good Morning,</span>
            <h3>{getFirstName()}</h3>
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
            {showBalance ? `$12,500,000` : '$ ****'}
          </h1>
          <button onClick={() => setShowBalance(!showBalance)} className="toggle-eye">
            {showBalance ? <Eye size={20} /> : <EyeSlash size={20} />}
          </button>
        </div>

        <div className="card-bottom">
          <div className="acc-details">
            <span>Account Number</span>
            <p>{accountNum} <span className="copy-icon">❐</span></p>
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

      {/* 4. TRANSACTION LIST */}
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