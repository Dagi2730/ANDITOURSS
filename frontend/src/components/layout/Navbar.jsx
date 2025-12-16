import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  // We'll simulate a logged-in user for now. 
  // Change null to { name: "Dagmawit" } to test the 'My Account' look
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
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
            <span className="nav-item account-trigger">
              My Account ({user.name})
            </span>
            <ul className="dropdown-menu">
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><button onClick={handleLogout} className="logout-btn-dropdown">Logout</button></li>
            </ul>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;