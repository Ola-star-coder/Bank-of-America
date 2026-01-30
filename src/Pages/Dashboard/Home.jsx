import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Eye, EyeSlash, PaperPlaneTilt, Wallet, CreditCard, CaretRight } from 'phosphor-react';
import './Dashboard.css'; // We will write this next

const Home = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  // Fake Data for visual testing
  const [balance, setBalance] = useState(125000.50);
  const transactions = [
    { id: 1, title: 'Netflix Subscription', date: 'Today, 9:41 AM', amount: -15.00, type: 'debit' },
    { id: 2, title: 'Transfer from John', date: 'Yesterday, 4:20 PM', amount: 250.00, type: 'credit' },
    { id: 3, title: 'Grocery Store', date: 'Jan 28, 2026', amount: -85.20, type: 'debit' },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dash-header">
        <div className="user-greeting">
          <div className="avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="texts">
            <span className="welcome-text">Welcome back,</span>
            <h3>{user?.email?.split('@')[0]}</h3>
          </div>
        </div>
      </header>

      {/* Main Balance Card */}
      <div className="balance-card">
        <div className="card-top">
          <span>Total Balance</span>
          <button onClick={() => setShowBalance(!showBalance)} className="eye-btn">
            {showBalance ? <Eye size={22} color="white" /> : <EyeSlash size={22} color="white" />}
          </button>
        </div>
        <div className="balance-amount">
          <h1>{showBalance ? `$${balance.toLocaleString()}` : '****'}</h1>
        </div>
        <div className="card-bottom">
          <span>Account: 1234567890</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn">
          <div className="icon-box"><PaperPlaneTilt size={24} /></div>
          <span>Transfer</span>
        </button>
        <button className="action-btn">
          <div className="icon-box"><Wallet size={24} /></div>
          <span>Top-up</span>
        </button>
        <button className="action-btn">
          <div className="icon-box"><CreditCard size={24} /></div>
          <span>Cards</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-section">
        <div className="section-header">
          <h4>Recent Transactions</h4>
          <button className="see-all">See All</button>
        </div>

        <div className="transaction-list">
          {transactions.map((t) => (
            <div key={t.id} className="transaction-item">
              <div className="t-icon">
                {t.type === 'credit' ? <Wallet weight="fill" color="#27AE60" /> : <CreditCard weight="fill" color="#FF5A1F" />}
              </div>
              <div className="t-details">
                <h5>{t.title}</h5>
                <span>{t.date}</span>
              </div>
              <div className={`t-amount ${t.type}`}>
                {t.type === 'credit' ? '+' : '-'}${Math.abs(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 