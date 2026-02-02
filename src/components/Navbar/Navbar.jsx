import { Link, useLocation } from 'react-router-dom';
import { House, ArrowsLeftRight, CreditCard, UserGear } from 'phosphor-react';
import { useTransferModal } from '../../Context/TransferModelContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { openTransfer } = useTransferModal();

  if (['/login', '/register'].includes(path)) return null;

  return (
    <>
      {/* 1. THE FLOATING BUTTON (Now sits outside the flex flow visually) */}
      <div className="nav-fab-wrapper">
        <button className="nav-fab" onClick={openTransfer}>
            <ArrowsLeftRight size={28} weight="fill" color="white" />
        </button>
      </div>

      {/* 2. THE BAR */}
      <nav className="bottom-nav">
        
        {/* Left Group */}
        <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
          <House size={24} weight={path === '/' ? "fill" : "regular"} />
          <span>Home</span>
        </Link>

        <Link to="/transactions" className={`nav-item ${path === '/transactions' ? 'active' : ''}`}>
           {/* Placeholder Icon for History */}
           <CreditCard size={24} weight={path === '/transactions' ? "fill" : "regular"} />
           <span>History</span>
        </Link>

        {/* SPACER for the center cutout */}
        <div style={{width: 60}}></div>

        {/* Right Group */}
        <Link to="/cards" className={`nav-item ${path === '/cards' ? 'active' : ''}`}>
          <CreditCard size={24} weight={path === '/cards' ? "fill" : "regular"} />
          <span>Cards</span>
        </Link>

        <Link to="/settings" className={`nav-item ${path === '/settings' ? 'active' : ''}`}>
          <UserGear size={24} weight={path === '/settings' ? "fill" : "regular"} />
          <span>Me</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;