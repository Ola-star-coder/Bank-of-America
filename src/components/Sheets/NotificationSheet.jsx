import { X, MagnifyingGlass, Check, Clock, User, Wallet, BellRinging, FunnelSimple } from 'phosphor-react';
import '../../Pages/Dashboard/History/History.css'; // Reusing base sheet styles

const NotificationSheet = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock Data Grouped
  const notifications = {
      today: [
          {
            id: 1,
            title: "Cash Back Earned!",
            msg: "You earned $50 cashback!",
            time: "15:00",
            icon: <Wallet size={20} weight="fill" />,
            theme: "green" // green, orange, blue, etc.
          },
          {
            id: 2,
            title: "Scheduled Payment",
            msg: "Payment processing today",
            time: "13:00",
            icon: <Clock size={20} weight="fill" />,
            theme: "orange"
          },
          {
            id: 3,
            title: "Profile Updated",
            msg: "Profile updated successfully",
            time: "12:00",
            icon: <User size={20} weight="fill" />,
            theme: "blue"
          }
      ],
      yesterday: [
          {
            id: 4,
            title: "Card Linked",
            msg: "Card added successfully",
            time: "14:00",
            icon: <Check size={20} weight="bold" />,
            theme: "green"
          },
          {
            id: 5,
            title: "Security Alert",
            msg: "New login from iPhone 14",
            time: "09:30",
            icon: <BellRinging size={20} weight="fill" />,
            theme: "red"
          }
      ]
  };

  return (
    <div className="modal-overlay" style={{alignItems: 'flex-end'}} onClick={onClose}>
       <div className="sheet-content slide-up-animation notif-sheet-bg" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
             <h3 style={{margin:0, fontSize:'18px'}}>Notifications</h3>
             <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}>
                <X size={24} color="#374151"/>
             </button>
          </div>

          {/* Search Bar (Visual Only) */}
          <div className="notif-search-row">
             <div className="notif-search-box">
                <MagnifyingGlass size={18} color="#9CA3AF"/>
                <input type="text" placeholder="Search notifications" />
             </div>
             <button className="notif-filter-btn">
                <FunnelSimple size={20} weight="fill" />
             </button>
          </div>

          {/* Scrollable List */}
          <div className="notif-scroll-area">
              
              {/* TODAY GROUP */}
              <div className="notif-group-label">Today</div>
              {notifications.today.map(n => (
                  <div key={n.id} className="notif-card">
                      <div className={`notif-icon-box ${n.theme}`}>
                          {n.icon}
                      </div>
                      <div className="notif-content">
                          <div className="notif-top-row">
                              <span className="notif-title">{n.title}</span>
                              <span className="notif-time">{n.time}</span>
                          </div>
                          <p className="notif-msg">{n.msg}</p>
                      </div>
                  </div>
              ))}

              {/* YESTERDAY GROUP */}
              <div className="notif-group-label">Yesterday</div>
              {notifications.yesterday.map(n => (
                  <div key={n.id} className="notif-card">
                      <div className={`notif-icon-box ${n.theme}`}>
                          {n.icon}
                      </div>
                      <div className="notif-content">
                          <div className="notif-top-row">
                              <span className="notif-title">{n.title}</span>
                              <span className="notif-time">{n.time}</span>
                          </div>
                          <p className="notif-msg">{n.msg}</p>
                      </div>
                  </div>
              ))}

          </div>
       </div>
    </div>
  );
};

export default NotificationSheet;