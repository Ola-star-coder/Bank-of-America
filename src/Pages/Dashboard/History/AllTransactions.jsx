import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, MagnifyingGlass, Wallet, PaperPlaneTilt, CircleNotch } from 'phosphor-react';
import { useAuth } from '../../../Context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/config';
import './History.css';
import '../Dashboard.css'; // Reusing transaction item styles

const AllTransactions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); 

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
        if (!user) return;
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data().transactions || [];
                const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
                setAllTransactions(sorted);
                setFilteredTransactions(sorted);
            }
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [user]);

  // 2. Handle Search & Filter
  useEffect(() => {
    let result = allTransactions;

    // Filter by Type
    if (filterType !== 'all') {
        result = result.filter(t => t.type === filterType);
    }

    // Filter by Search (Title or Amount)
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(t => 
            t.title.toLowerCase().includes(lowerTerm) || 
            t.amount.toString().includes(lowerTerm)
        );
    }

    setFilteredTransactions(result);
  }, [searchTerm, filterType, allTransactions]);

  return (
    <div className="history-container page-slide">
      
      {/* Header */}
      <div className="transfer-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <CaretLeft size={20} weight="bold" />
        </button>
        <h2>Transaction History</h2>
      </div>

      {/* Controls (Sticky) */}
      <div className="history-controls">
          <div className="search-bar-wrapper">
              <MagnifyingGlass size={20} color="#9CA3AF"/>
              <input 
                  type="text" 
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          <div className="filter-row">
              <button 
                className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`filter-chip ${filterType === 'credit' ? 'active' : ''}`}
                onClick={() => setFilterType('credit')}
              >
                Money In
              </button>
              <button 
                className={`filter-chip ${filterType === 'debit' ? 'active' : ''}`}
                onClick={() => setFilterType('debit')}
              >
                Money Out
              </button>
          </div>
      </div>

      {/* List */}
      <div className="history-list">
          {loading ? (
             <div style={{display:'flex', justifyContent:'center', padding:'40px'}}>
                 <CircleNotch size={32} className="spin" color="#0E648E"/>
             </div>
          ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                  <div key={t.id} className="t-item" style={{background:'white'}}>
                    <div className={`t-avatar ${t.type}`}>
                      {t.type === 'credit' ? <Wallet size={20} weight="fill"/> : <PaperPlaneTilt size={20} weight="fill"/>}
                    </div>
                    <div className="t-info">
                      <h5>{t.title}</h5>
                      <span>{t.date} • {new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`t-amount ${t.type}`}>
                      {t.type === 'credit' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                    </div>
                  </div>
              ))
          ) : (
              <div style={{textAlign:'center', marginTop:'40px', color:'#9CA3AF'}}>
                  <p>No transactions found.</p>
              </div>
          )}
      </div>

    </div>
  );
};

export default AllTransactions;