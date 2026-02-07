import { X, ShareNetwork, ArrowDown, ArrowUp } from 'phosphor-react';
import '../../Pages/Dashboard/Transfer/Transfer.css';

const TransactionDetailsSheet = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const isCredit = transaction.type === 'credit';
  const color = isCredit ? '#10B981' : '#1F2937';

  const dateObj = new Date(transaction.timestamp);
  const dateStr = dateObj.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', 
    hour: 'numeric', minute: 'numeric'
  });

  // --- NEW: SHARE LOGIC ---
  const handleShare = async () => {
    const shareData = {
        title: 'Transaction Receipt',
        text: `Transaction: ${transaction.title}\nAmount: $${Math.abs(transaction.amount)}\nRef: ${transaction.id}\nDate: ${dateObj.toLocaleDateString()}`
    };

    // 1. Try Native Share (Mobile)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error(err);
        }
    } 
    // 2. Fallback for Desktop (Copy to Clipboard)
    else {
        try {
            await navigator.clipboard.writeText(shareData.text);
            alert("Receipt details copied to clipboard!");
        } catch (err) {
            alert("Unable to share.");
        }
    }
  };

  return (
    <div className="modal-overlay" style={{alignItems: 'flex-end'}} onClick={onClose}>
       
       <div 
         className="sheet-content slide-up-animation"
         onClick={(e) => e.stopPropagation()} 
       >
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
             <h3 style={{margin:0}}>Transaction Details</h3>
             <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}>
                <X size={24} color="#374151"/>
             </button>
          </div>

          <div className="receipt-card" style={{boxShadow:'none', border:'1px solid #F3F4F6', padding:'24px'}}>
             <div style={{
                 width:'64px', height:'64px', borderRadius:'20px', 
                 background: isCredit ? '#ECFDF5' : '#F3F4F6',
                 color: color, display:'flex', alignItems:'center', justifyContent:'center',
                 margin:'0 auto 16px auto'
             }}>
                {isCredit ? <ArrowDown size={32} weight="bold"/> : <ArrowUp size={32} weight="bold"/>}
             </div>

             <h2 style={{fontSize:'28px', margin:'0 0 8px 0', color: color}}>
                {isCredit ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
             </h2>
             <span style={{fontSize:'14px', color:'#6B7280', fontWeight:'500'}}>{transaction.title}</span>

             <div className="receipt-divider-dashed"></div>

             <div className="receipt-details">
                <div className="r-row"><span>Status</span><span className="r-val" style={{color:'#10B981'}}>Success</span></div>
                <div className="r-row"><span>Date</span><span className="r-val">{dateStr}</span></div>
                <div className="r-row"><span>Reference</span><span className="r-val">#{transaction.id || 'REF-000'}</span></div>
                <div className="r-row"><span>Type</span><span className="r-val" style={{textTransform:'capitalize'}}>{transaction.type}</span></div>
             </div>
          </div>

          <button className="receipt-btn share" style={{marginTop:'24px'}} onClick={handleShare}>
             <ShareNetwork size={20} weight="bold"/>
             Share Receipt
          </button>

       </div>
    </div>
  );
};

export default TransactionDetailsSheet;