import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    setMenuOpen(false);
    navigate('/');
  };

  const handleAccountClick = () => {
    setMenuOpen((open) => !open);
  };

  return (
    <nav className="navbar-custom">
      <Link to="/" className="logo-text">ANDI TOURS</Link>

      <ul className="nav-links">
        <li><Link to="/" className="nav-item">Home</Link></li>
        <li><Link to="/destinations" className="nav-item">Destinations</Link></li>
        <li><Link to="/gallery" className="nav-item">Gallery</Link></li>
        <li><Link to="/contact" className="nav-item">Contact</Link></li>

        {!user ? (
          <li><Link to="/login" className="nav-item">Login</Link></li>
        ) : (
          <li className="nav-dropdown">
            <button type="button" className="nav-item account-trigger" onClick={handleAccountClick}>
              My Account ({user.name})
            </button>
            {menuOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link></li>
                {user.role?.toString().toUpperCase() === 'ADMIN' && (
                  <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link></li>
                )}
                <li>
                  <button onClick={handleLogout} className="logout-btn-dropdown">Logout</button>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
