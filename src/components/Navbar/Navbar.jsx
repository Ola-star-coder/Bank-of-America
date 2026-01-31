import { Link, useLocation } from 'react-router-dom';
import { House, ArrowsLeftRight, CreditCard, UserGear } from 'phosphor-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Don't show Navbar on Login or Register pages
  if (path === '/login' || path === '/register') {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <House size={24} weight={path === '/' ? "fill" : "regular"} />
        <span>Home</span>
      </Link>

      <Link to="/transfer" className={`nav-item ${path === '/transfer' ? 'active' : ''}`}>
        <ArrowsLeftRight size={24} weight={path === '/transfer' ? "fill" : "regular"} />
        <span>Transfer</span>
      </Link>

      <Link to="/cards" className={`nav-item ${path === '/cards' ? 'active' : ''}`}>
        <CreditCard size={24} weight={path === '/cards' ? "fill" : "regular"} />
        <span>Cards</span>
      </Link>

      <Link to="/settings" className={`nav-item ${path === '/settings' ? 'active' : ''}`}>
        <UserGear size={24} weight={path === '/settings' ? "fill" : "regular"} />
        <span>Me</span>
      </Link>
    </nav>
  );
};

export default Navbar;