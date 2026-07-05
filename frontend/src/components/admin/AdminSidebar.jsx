import React from 'react';
import { useDispatch } from 'react-redux';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaStar, FaSignOutAlt, FaImages } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'packages', label: 'Packages', icon: <FaBox /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'blog', label: 'Stories & Gallery', icon: <FaImages /> },
    { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any admin authentication tokens from localStorage/sessionStorage
      dispatch(logout());
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      
      // Clear any cookies that might be storing admin auth
      document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Redirect to home page
      navigate('/');
      
      // Optional: Show a success message
      alert('Logged out successfully!');
    }
  };

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
        
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 70px;
            overflow: hidden;
          }
          
          .admin-sidebar-logo h2 {
            font-size: 0;
            text-align: center;
          }
          
          .admin-sidebar-logo h2::before {
            content: "🌿";
            font-size: 1.5rem;
          }
          
          .admin-nav-text {
            display: none;
          }
          
          .admin-nav-icon {
            margin-right: 0;
            font-size: 1.2rem;
          }
          
          .admin-nav-item {
            justify-content: center;
            padding: 15px;
          }
          
          .logout-btn {
            justify-content: center;
          }
        }
      `}</style>
    </aside>
  );
}

export default AdminSidebar;