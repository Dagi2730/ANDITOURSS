import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import AdminPackages from '../components/admin/AdminPackages';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';
import AdminBlog from '../components/admin/AdminBlog';
import AdminMessages from '../components/admin/AdminMessages';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminStats />;
      case 'packages': return <AdminPackages />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'blog': return <AdminBlog />;
      case 'messages': return <AdminMessages />;
      default: return <AdminStats />;
    }
  };

  return (
    <div className="admin-layout">
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
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle admin menu"
          >
            ☰
          </button>
          <h1>Admin Control Center</h1>
        </header>
        <section className="admin-view-container">{renderContent()}</section>
      </main>
    </div>
  );
}
export default AdminDashboard;