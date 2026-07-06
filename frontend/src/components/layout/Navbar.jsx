import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    setMobileOpen(false);
    navigate('/');
  };

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav className="navbar-custom">
      <Link to="/" className="logo-text">ANDI TOURS</Link>

      <button
        type="button"
        className={`nav-hamburger ${mobileOpen ? 'active' : ''}`}
        aria-label="Toggle navigation"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`nav-links ${mobileOpen ? 'active' : ''}`}>
        <li><Link to="/" className="nav-item" onClick={handleLinkClick}>Home</Link></li>
        <li><Link to="/destinations" className="nav-item" onClick={handleLinkClick}>Destinations</Link></li>
        <li><Link to="/gallery" className="nav-item" onClick={handleLinkClick}>Gallery</Link></li>
        <li><Link to="/contact" className="nav-item" onClick={handleLinkClick}>Contact</Link></li>

        {!user ? (
          <li><Link to="/login" className="nav-item" onClick={handleLinkClick}>Login</Link></li>
        ) : (
          <>
            <li><Link to="/my-bookings" className="nav-item" onClick={handleLinkClick}>My Bookings</Link></li>
            <li>
              <button type="button" onClick={handleLogout} className="nav-item logout-btn">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;