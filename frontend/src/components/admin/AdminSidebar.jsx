import React from 'react';
import { useDispatch } from 'react-redux';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt, FaImages, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

function AdminSidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'packages', label: 'Packages', icon: <FaBox /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'blog', label: 'Stories & Gallery', icon: <FaImages /> },
    { id: 'messages', label: 'Messages', icon: <FaEnvelope /> },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      if (setMobileOpen) setMobileOpen(false);
      dispatch(logout());
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/');
      alert('Logged out successfully!');
    }
  };

  const handleSidebarItemClick = (itemId) => {
    setActiveTab(itemId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="admin-sidebar-logo">
        <h2>🌿 DOBI TOURS</h2>
        {mobileOpen && (
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
          >
            ×
          </button>
        )}
      </div>
      
      <ul className="admin-nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleSidebarItemClick(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-text">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="admin-sidebar-footer" style={{ padding: '20px', marginTop: 'auto' }}>
        <button
          className="admin-nav-item logout-btn"
          onClick={handleLogout}
          style={{ width: '100%' }}
        >
          <span className="admin-nav-icon">
            <FaSignOutAlt />
          </span>
          <span className="admin-nav-text">Logout</span>
        </button>
      </div>

      <style>{`
        .admin-sidebar {
          width: 250px;
          background: white;
          color: #333;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0,0,0,0.05);
          z-index: 100;
          border-right: 1px solid #e0e0e0;
        }
        
        .admin-sidebar-logo {
          padding: 25px 20px;
          border-bottom: 1px solid #e0e0e0;
          background: linear-gradient(145deg, #556B2F, #6B8E23);
        }
        
        .admin-sidebar-logo h2 {
          margin: 0;
          color: white;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-align: center;
        }
        
        .admin-nav-list {
          list-style: none;
          padding: 20px 0;
          margin: 0;
          flex: 1;
        }
        
        .admin-nav-list li {
          margin-bottom: 5px;
        }
        
        .admin-nav-item {
          width: 100%;
          padding: 14px 20px;
          background: none;
          border: none;
          color: #555;
          display: flex;
          align-items: center;
          cursor: pointer;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        
        .admin-nav-item:hover {
          background: #f5f5f5;
          color: #333;
          border-left: 4px solid #ddd;
        }
        
        .admin-nav-item.active {
          background: #f5f5f5;
          color: #556B2F;
          border-left: 4px solid #556B2F;
          font-weight: 600;
        }
        
        .admin-nav-item.active .admin-nav-icon {
          color: #556B2F;
        }
        
        .admin-nav-icon {
          margin-right: 12px;
          font-size: 1.1rem;
          color: #666;
          transition: color 0.3s ease;
        }
        
        .admin-nav-text {
          font-size: 0.95rem;
          letter-spacing: 0.3px;
        }
        
        .logout-btn {
          border-top: 1px solid #e0e0e0;
          margin-top: 20px;
          padding-top: 20px;
          color: #666;
        }
        
        .logout-btn:hover {
          background: #f5f5f5;
          color: #e53935;
          border-left: 4px solid #e53935;
        }
        
        .logout-btn:hover .admin-nav-icon {
          color: #e53935;
        }

        .admin-sidebar-close {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          margin-left: 8px;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 100%;
            min-width: auto;
            height: auto;
            transform: translateY(-110%);
            opacity: 0;
            visibility: hidden;
            transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
          }

          .admin-sidebar.mobile-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .admin-sidebar-logo {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .admin-sidebar-logo h2 {
            font-size: 1.2rem;
            margin: 0;
          }

          .admin-nav-text {
            display: inline;
          }
          
          .admin-nav-icon {
            margin-right: 12px;
            font-size: 1.1rem;
          }
          
          .admin-nav-item {
            justify-content: flex-start;
            padding: 14px 20px;
          }
          
          .logout-btn {
            justify-content: flex-start;
          }
        }
      `}</style>
    </aside>
  );
}

export default AdminSidebar;