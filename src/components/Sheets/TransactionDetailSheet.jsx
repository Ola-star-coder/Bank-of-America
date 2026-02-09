import { useEffect } from 'react';
import ReactDOM from 'react-dom'; 
import { X, ShareNetwork, ArrowDown, ArrowUp } from 'phosphor-react';
import '../../Pages/Dashboard/History/History.css'; 

const TransactionDetailsSheet = ({ transaction, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !transaction) return null;

  const isCredit = transaction.type === 'credit';
  const color = isCredit ? '#10B981' : '#1F2937';

  const dateStr = transaction.timestamp 
    ? new Date(transaction.timestamp).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', 
        hour: 'numeric', minute: 'numeric'
      })
    : 'Date unavailable';

  // 2. THE CONTENT
  const modalContent = (
    <div className="tx-modal-overlay" onClick={onClose}>
       <div className="tx-sheet-content" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',marginTop: '20px', marginBottom:'24px'}}>
             <h3 style={{margin:0, fontSize:'18px', fontWeight:'700', color:'#111827'}}>Transaction Details</h3>
             <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', padding:0}}>
                <X size={24} color="#374151"/>
             </button>
          </div>

          {/* Receipt Card */}
          <div className="receipt-card">
             <div style={{
                 width:'64px', height:'64px', borderRadius:'20px', 
                 background: isCredit ? '#ECFDF5' : '#F3F4F6',
                 color: color, display:'flex', alignItems:'center', justifyContent:'center',
                 margin:'0 auto 16px auto'
             }}>
                {isCredit ? <ArrowDown size={32} weight="bold"/> : <ArrowUp size={32} weight="bold"/>}
             </div>

             <h2 style={{fontSize:'32px', margin:'0 0 8px 0', color: color, fontWeight: 700}}>
                {isCredit ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
             </h2>
             <span style={{fontSize:'14px', color:'#6B7280', fontWeight:'500'}}>{transaction.title}</span>

             <div className="receipt-divider-dashed"></div>

             <div className="receipt-details">
                <div className="r-row"><span>Status</span><span className="r-val" style={{color:'#10B981'}}>Success</span></div>
                <div className="r-row"><span>Date</span><span className="r-val">{dateStr}</span></div>
                <div className="r-row"><span>Reference</span><span className="r-val">#{transaction.id ? transaction.id.toString().slice(-8) : 'REF-000'}</span></div>
                <div className="r-row"><span>Type</span><span className="r-val" style={{textTransform:'capitalize'}}>{transaction.type}</span></div>
             </div>
          </div>

          <button className="receipt-btn share" onClick={() => alert('Share Logic Here')}>
             <ShareNetwork size={20} weight="bold"/>
             Share Receipt
          </button>

       </div>
    </div>
  );
  return ReactDOM.createPortal(modalContent, document.body);
};

export default TransactionDetailsSheet;