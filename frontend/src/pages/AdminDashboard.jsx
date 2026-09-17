import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../features/auth/authSlice';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import AdminPackages from '../components/admin/AdminPackages';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';
import AdminBlog from '../components/admin/AdminBlog';
import AdminMessages from '../components/admin/AdminMessages';
import AdminReviews from '../components/admin/AdminReviews';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminStats />;
      case 'packages': return <AdminPackages />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'blog': return <AdminBlog />;
      case 'reviews': return <AdminReviews />;
      case 'messages': return <AdminMessages />;
      default: return <AdminStats />;
    }
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        mobileOpen={sidebarOpen}
        setMobileOpen={setSidebarOpen}
      />
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="admin-header-title-container">
            <button
              className="admin-sidebar-toggle"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle admin menu"
            >
              ☰
            </button>
            <h1>Admin Control Center</h1>
          </div>
          <button onClick={handleLogout} className="admin-header-logout-btn" title="Logout of Admin Panel">
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
        </header>
        <section className="admin-view-container">{renderContent()}</section>
      </main>
    </div>
  );
}
export default AdminDashboard;