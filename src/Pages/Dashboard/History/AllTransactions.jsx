import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, MagnifyingGlass, ArrowDown, ArrowUp, CalendarBlank, XCircle } from 'phosphor-react';
import { useAuth } from '../../../Context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/config';
import TransactionDetailsSheet from '../../../components/Sheets/TransactionDetailSheet';
import './History.css';

const AllTransactions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [rawTransactions, setRawTransactions] = useState([]); 
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
                // CRASH FIX: Ensure timestamp exists before sorting
                const sortedData = data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                setRawTransactions(sortedData);
            }
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  // 2. FILTER & GROUP LOGIC
  useEffect(() => {
    let result = rawTransactions;

    // A. Filter by Type (Money In vs Money Out)
    if (filterType !== 'all') {
        result = result.filter(t => t.type === filterType);
    }

    // B. Filter by Search (CRASH FIX: Check if title exists first)
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(t => (t.title || '').toLowerCase().includes(lower));
    }

    // C. Filter by Date (Native Picker)
    if (selectedDate) {
        result = result.filter(t => {
            if (!t.timestamp) return false;
            const txDate = new Date(t.timestamp).toISOString().split('T')[0];
            return txDate === selectedDate;
        });
    }

    // D. Grouping Logic
    const groups = {};
    result.forEach(t => {
      // Safety check for date
      const timestamp = t.timestamp || Date.now();
      const date = new Date(timestamp);
      
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let key = date.toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' });

      if (date.toDateString() === today.toDateString()) key = "Today";
      else if (date.toDateString() === yesterday.toDateString()) key = "Yesterday";

      if (!groups[key]) groups[key] = { items: [], total: 0 };
      
      groups[key].items.push(t);
      
      // --- TOTAL CALCULATION ---
      // 1. Convert to number (fix NaN)
      const val = parseFloat(t.amount);
      const safeAmount = isNaN(val) ? 0 : val;

      // 2. Add or Subtract based on type
      if (t.type === 'credit') {
          groups[key].total += safeAmount;
      } else {
          groups[key].total -= safeAmount; // Subtract debits for correct Daily Net
      }
    });

    setGroupedTransactions(Object.entries(groups).map(([label, data]) => ({
      label, items: data.items, dailyTotal: data.total
    })));

  }, [rawTransactions, filterType, searchTerm, selectedDate]);


  return (
    <div className="history-container page-slide">
      
      {/* HEADER WITH DATE PICKER */}
      <div className="history-header-compact">
         <button onClick={() => navigate(-1)} className="back-btn-simple">
             <CaretLeft size={24} color="#1F2937"/>
         </button>
         <h2>Transactions</h2>
         
         {/* THE HIDDEN DATE INPUT HACK */}
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
      
      {/* SHOW SELECTED DATE BADGE (Clear Button) */}
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

      {/* TRANSACTION LIST */}
      <div className="history-scroll-area">
         {groupedTransactions.length > 0 ? (
          groupedTransactions.map((group, index) => (
            <div key={index} className="history-group-section">
               {/* Group Header (e.g., Today +$500) */}
               <div className="group-header-row">
                   <span className="gh-date">{group.label}</span>
                   <span className="gh-total">
                      {group.dailyTotal > 0 ? '+' : ''}
                      {group.dailyTotal.toLocaleString('en-US', {style:'currency', currency:'USD'})}
                   </span>
               </div>
               
               {/* Items */}
               <div className="group-items-box">
                  {group.items.map(t => {
                      // Safety Check for Row Amount
                      const val = parseFloat(t.amount);
                      const safeRowAmount = isNaN(val) ? 0 : val;
                      
                      return (
                      <div key={t.id} className="t-row-item" onClick={() => setSelectedTx(t)}>
                         <div className={`t-icon-box ${t.type}`}>
                            {t.type === 'credit' ? <ArrowDown size={18} weight="bold"/> : <ArrowUp size={18} weight="bold"/>}
                         </div>
                         <div className="t-content-text">
                            <h4>{t.title || 'Unknown Transaction'}</h4>
                            <span>
                                {t.timestamp 
                                    ? new Date(t.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) 
                                    : '--:--'}
                            </span>
                         </div>
                         <div className={`t-amount-text ${t.type}`}>
                            {t.type === 'credit' ? '+' : '-'}
                            ${Math.abs(safeRowAmount).toLocaleString()}
                         </div>
                      </div>
                   )})}
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