import React from 'react';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaStar, FaSignOutAlt } from 'react-icons/fa';

function AdminSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'packages', label: 'Packages', icon: <FaBox /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <h2>🌿 ANDI TOURS</h2>
      </div>
      
      <ul className="admin-nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-text">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div style={{ padding: '20px', marginTop: 'auto' }}>
        <button
          className="admin-nav-item"
          onClick={() => {
            // Handle logout
            console.log('Logout clicked');
            // Typically you would redirect to login page and clear auth
          }}
          style={{ width: '100%' }}
        >
          <span className="admin-nav-icon">
            <FaSignOutAlt />
          </span>
          <span className="admin-nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;