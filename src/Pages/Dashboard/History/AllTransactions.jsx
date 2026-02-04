import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, MagnifyingGlass, ArrowDown, ArrowUp, CalendarBlank, XCircle } from 'phosphor-react'; // Added XCircle
import { useAuth } from '../../../Context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/config';
import TransactionDetailsSheet from '../../../components/Sheets/TransactionDetailSheet';
import './History.css';

const AllTransactions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [rawTransactions, setRawTransactions] = useState([]); // Store original data
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'credit', 'debit'
  const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD string
  
  const [selectedTx, setSelectedTx] = useState(null);

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
        if (!user) return;
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data().transactions || [];
                // Sort newest first
                setRawTransactions(data.sort((a, b) => b.timestamp - a.timestamp));
            }
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  // 2. FILTER & GROUP LOGIC
  useEffect(() => {
    let result = rawTransactions;

    // A. Filter by Type
    if (filterType !== 'all') {
        result = result.filter(t => t.type === filterType);
    }

    // B. Filter by Search
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(t => t.title.toLowerCase().includes(lower));
    }

    // C. Filter by Date (Native Picker)
    if (selectedDate) {
        // selectedDate is "2024-02-28", t.timestamp is ms
        // Check if date strings match
        result = result.filter(t => {
            const txDate = new Date(t.timestamp).toISOString().split('T')[0];
            return txDate === selectedDate;
        });
    }

    // D. Grouping
    const groups = {};
    result.forEach(t => {
      const date = new Date(t.timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let key = date.toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' });

      if (date.toDateString() === today.toDateString()) key = "Today";
      else if (date.toDateString() === yesterday.toDateString()) key = "Yesterday";

      if (!groups[key]) groups[key] = { items: [], total: 0 };
      groups[key].items.push(t);
      groups[key].total += t.amount; 
    });

    setGroupedTransactions(Object.entries(groups).map(([label, data]) => ({
      label, items: data.items, dailyTotal: data.total
    })));

  }, [rawTransactions, filterType, searchTerm, selectedDate]);


  return (
    <div className="history-container page-slide">
      
      {/* HEADER */}
      <div className="history-header-compact">
         <button onClick={() => navigate(-1)} className="back-btn-simple">
             <CaretLeft size={24} color="#1F2937"/>
         </button>
         <h2>Transactions</h2>
         
         {/* NATIVE DATE PICKER HACK */}
         <div style={{position: 'relative'}}>
             <button className={`calendar-btn ${selectedDate ? 'active-date' : ''}`}>
                 <CalendarBlank size={24} color={selectedDate ? '#0E648E' : '#1F2937'} />
             </button>
             <input 
                type="date" 
                className="hidden-date-input"
                onChange={(e) => setSelectedDate(e.target.value)}
             />
         </div>
      </div>
      
      {/* SHOW SELECTED DATE BADGE */}
      {selectedDate && (
          <div style={{display:'flex', justifyContent:'center', marginBottom:'16px'}}>
              <div className="date-badge" onClick={() => setSelectedDate('')}>
                  Showing: {selectedDate} <XCircle size={16} weight="fill"/>
              </div>
          </div>
      )}

      {/* SEARCH BAR */}
      <div className="search-row">
         <div className="search-input-wrapper">
             <MagnifyingGlass size={18} color="#9CA3AF"/>
             <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
         </div>
      </div>

      {/* FILTER CHIPS */}
      <div className="filter-row" style={{marginBottom:'24px', paddingBottom:'0'}}>
          <button 
            className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >All</button>
          <button 
            className={`filter-chip ${filterType === 'credit' ? 'active' : ''}`}
            onClick={() => setFilterType('credit')}
          >Money In</button>
          <button 
            className={`filter-chip ${filterType === 'debit' ? 'active' : ''}`}
            onClick={() => setFilterType('debit')}
          >Money Out</button>
      </div>

      {/* LIST */}
      <div className="history-scroll-area">
         {groupedTransactions.length > 0 ? (
          groupedTransactions.map((group, index) => (
            <div key={index} className="history-group-section">
               <div className="group-header-row">
                   <span className="gh-date">{group.label}</span>
                   <span className="gh-total">
                      {group.dailyTotal > 0 ? '+' : ''}{group.dailyTotal.toLocaleString('en-US', {style:'currency', currency:'USD'})}
                   </span>
               </div>
               <div className="group-items-box">
                  {group.items.map(t => (
                     <div key={t.id} className="t-row-item" onClick={() => setSelectedTx(t)}>
                        <div className={`t-icon-box ${t.type}`}>
                           {t.type === 'credit' ? <ArrowDown size={18} weight="bold"/> : <ArrowUp size={18} weight="bold"/>}
                        </div>
                        <div className="t-content-text">
                           <h4>{t.title}</h4>
                           <span>{new Date(t.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={`t-amount-text ${t.type}`}>
                           {t.type === 'credit' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          ))
         ) : (
             <div className="empty-history">
                 <p>No transactions found.</p>
             </div>
         )}
      </div>

      <TransactionDetailsSheet 
         transaction={selectedTx} 
         isOpen={!!selectedTx} 
         onClose={() => setSelectedTx(null)} 
      />

    </div>
  );
};

export default AllTransactions;