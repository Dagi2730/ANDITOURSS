import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import AdminPackages from '../components/admin/AdminPackages';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';
import AdminReviews from '../components/admin/AdminReviews';
import AdminBlog from '../components/admin/AdminBlog';
import '../styles/Admin.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminStats />;
      case 'packages': return <AdminPackages />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'blog': return <AdminBlog />;
      case 'reviews': return <AdminReviews />;
      default: return <AdminStats />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="admin-main-content">
        <header className="admin-header">
          <h1>Admin Control Center</h1>
          <p>Welcome back, Andi. Manage your business data here.</p>
        </header>
        <section className="admin-view-container">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;