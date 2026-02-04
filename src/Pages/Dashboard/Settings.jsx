import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { 
  CaretLeft, PencilSimple, Copy, ShieldCheck, 
  Users, Moon, LockKey, SignOut, CaretRight 
} from 'phosphor-react';
import { toast } from 'react-toastify';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  // Fetch Full Profile for Account Number
  useEffect(() => {
    const fetchProfile = async () => {
       if (user) {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) setProfile(snap.data());
       }
    };
    fetchProfile();
  }, [user]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleLogout = async () => {
     try {
       await logout();
       navigate('/login');
     } catch (err) {
       toast.error("Failed to log out");
     }
  };

  return (
    <div className="settings-container page-slide">
      
      {/* ZONE 1: IDENTITY HEADER */}
      <div className="identity-header">
         <div className="settings-nav">
            <button onClick={() => navigate(-1)} className="nav-icon-btn">
               <CaretLeft size={20} weight="bold" />
            </button>
            <span style={{fontWeight:600}}>My Profile</span>
            <button className="nav-icon-btn">
               <PencilSimple size={20} weight="bold" />
            </button>
         </div>

         <div className="profile-avatar-large">
            {profile?.fullName?.charAt(0) || user?.email?.charAt(0)}
            <div className="edit-badge"><PencilSimple size={14} weight="bold"/></div>
         </div>
         
         <h2 className="user-name-large">{profile?.fullName || 'User'}</h2>
         <span className="user-email-small">{user?.email}</span>
      </div>

      {/* ZONE 2: ACCOUNT UTILITY */}
      <div className="account-details-card">
         <div className="acc-info-block">
            <label>Account Number</label>
            <h3>{profile?.accountNumber || 'Loading...'}</h3>
         </div>
         <button className="copy-btn" onClick={() => handleCopy(profile?.accountNumber)}>
            <Copy size={18} weight="bold"/>
         </button>
      </div>

      {/* ZONE 3: PREFERENCES */}
      <div className="settings-section">
         <h4 className="section-title">General</h4>
         <div className="settings-group">
            <div className="settings-row" onClick={() => toast.info("Coming soon!")}>
               <div className="row-icon blue"><Users size={20} weight="fill"/></div>
               <span className="row-label">Beneficiaries</span>
               <CaretRight size={16} className="row-action"/>
            </div>
            <div className="settings-row">
               <div className="row-icon purple"><Moon size={20} weight="fill"/></div>
               <span className="row-label">Dark Mode</span>
               {/* Mock Toggle */}
               <div style={{width:40, height:24, background:'#E5E7EB', borderRadius:20, position:'relative'}}>
                  <div style={{width:20, height:20, background:'white', borderRadius:'50%', position:'absolute', top:2, left:2, boxShadow:'0 2px 4px rgba(0,0,0,0.2)'}}></div>
               </div>
            </div>
         </div>
      </div>

      <div className="settings-section">
         <h4 className="section-title">Security</h4>
         <div className="settings-group">
            <div className="settings-row" onClick={() => toast.info("Use the Transfer flow to change PIN")}>
               <div className="row-icon green"><LockKey size={20} weight="fill"/></div>
               <span className="row-label">Transaction PIN</span>
               <CaretRight size={16} className="row-action"/>
            </div>
            <div className="settings-row">
               <div className="row-icon orange"><ShieldCheck size={20} weight="fill"/></div>
               <span className="row-label">Privacy Policy</span>
               <CaretRight size={16} className="row-action"/>
            </div>
         </div>
      </div>

      {/* ZONE 4: DANGER */}
      <button className="logout-btn" onClick={handleLogout}>
         <SignOut size={20} weight="bold"/>
         Log Out
      </button>

      <p className="version-text">Version 1.0.2 • Build 2026</p>

    </div>
  );
};

export default Settings;