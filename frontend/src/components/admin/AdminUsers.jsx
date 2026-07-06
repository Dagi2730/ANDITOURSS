import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsCard, setShowDetailsCard] = useState(false);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowDetailsCard(true);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users');
      const mapped = res.data.map(u => ({
        id: u.id,
        name: u.name || '',
        email: u.email,
        phone: u.phone || '',
        role: u.role,
        status: 'active',
        joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
        lastLogin: '',
        bookings: u.bookingsCount || 0,
      }));
      setUsers(mapped);
    } catch (err) {
      setError('Failed to load users. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter(u => u.id !== userId));
      alert(`User "${userName}" deleted successfully!`);
    } catch (err) {
      alert('Failed to delete user. Check backend logs.');
    }
  };

  return (
    <div className="admin-users-wrapper">
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-title">👥 Total Users</div>
          <div className="stat-number">{users.length}</div>
          <div className="stat-change positive">+12 from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">👑 Admin Users</div>
          <div className="stat-number">{users.filter(u => u.role?.toString().toUpperCase() === 'ADMIN').length}</div>
          <div className="stat-change positive">+2 from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">👤 Active Users</div>
          <div className="stat-number">{users.filter(u => u.status === 'active').length}</div>
          <div className="stat-change positive">+8 from last month</div>
        </div>
      </div>

      {showDetailsCard && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowDetailsCard(false)}>
          <div className="user-detail-card" onClick={e => e.stopPropagation()}>
            <div className="card-top-accent"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>User Details</h3>
                <span className="user-tag">ID: #{selectedUser.id}</span>
              </div>

              <div className="detail-grid">
                <div className="info-group">
                  <label>Full Name</label>
                  <p className="highlight-text">{selectedUser.name}</p>
                </div>
                <div className="info-group">
                  <label>Email Address</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="info-group">
                  <label>Phone Number</label>
                  <p>{selectedUser.phone}</p>
                </div>
                <div className="info-group">
                  <label>Account Type</label>
                  <p className={`role-badge ${selectedUser.role}`}>
                    {selectedUser.role?.toString().toUpperCase() === 'ADMIN' ? '👑 Admin' : '👤 Customer'}
                  </p>
                </div>
                <div className="info-group">
                  <label>Account Status</label>
                  <p className={`status-badge ${selectedUser.status}`}>
                    {selectedUser.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
                  </p>
                </div>
                <div className="info-group">
                  <label>Total Bookings</label>
                  <p className="highlight-text">{selectedUser.bookings}</p>
                </div>
                <div className="info-group full">
                  <label>Account Created</label>
                  <p>📅 {selectedUser.joinDate}</p>
                </div>
                <div className="info-group full">
                  <label>Last Login</label>
                  <p>🕒 {selectedUser.lastLogin}</p>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-print" onClick={() => alert('Exporting user data...')}>
                  Export User Data
                </button>
                <button className="btn-close" onClick={() => setShowDetailsCard(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h3>User Management</h3>
          <div>
            <button
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => alert('Exporting users data...')}
            >
              Export Users
            </button>
          </div>
        </div>

        {loading && <p style={{ padding: '20px' }}>Loading users...</p>}
        {error && <p style={{ padding: '20px', color: '#c62828' }}>{error}</p>}

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-plain-table users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Bookings</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="id-cell">#{user.id.slice(0, 8)}</td>
                  <td className="name-cell">
                    <strong>{user.name}</strong>
                    <div
                      className="user-role-indicator"
                      style={{
                        fontSize: '0.8rem',
                        color: user.role?.toString().toUpperCase() === 'ADMIN' ? '#4a148c' : '#0277bd',
                        marginTop: '4px',
                      }}
                    >
                      {user.role?.toString().toUpperCase() === 'ADMIN' ? '👑 Admin' : '👤 Customer'}
                    </div>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className="bookings-count">{user.bookings}</span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <div className="action-btns">
                      <button className="view-btn" onClick={() => handleView(user)} title="View Details">
                        👁️ Details
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
                        onClick={() => handleDelete(user.id, user.name)}
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-users-wrapper {
          padding: 20px;
        }

        .admin-plain-table.users-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .admin-plain-table.users-table th,
        .admin-plain-table.users-table td {
          padding: 14px 16px;
          text-align: left;
          vertical-align: middle;
          border-bottom: 1px solid #eee;
          white-space: normal;
          word-break: break-word;
        }

        .admin-plain-table.users-table th {
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #666;
          background: #fafafa;
        }

        .admin-plain-table.users-table .id-cell {
          font-family: monospace;
          font-size: 0.85rem;
          color: #888;
        }

        .admin-plain-table.users-table .name-cell strong {
          display: block;
        }

        .admin-plain-table.users-table .email-cell {
          word-break: break-all;
        }

        .user-detail-card {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.3s ease;
          position: relative;
        }

        .user-tag {
          background: #f5f5f5;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--admin-text);
          font-weight: 500;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .role-badge.admin {
          background-color: #f3e5f5;
          color: #4a148c;
        }

        .role-badge.customer {
          background-color: #e3f2fd;
          color: #0277bd;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-badge.active {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.inactive {
          background-color: #f5f5f5;
          color: #666;
        }

        .bookings-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--admin-olive);
          color: white;
          border-radius: 50%;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .user-role-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .action-btns {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .view-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          background: #e3f2fd;
          color: #0277bd;
        }

        .view-btn:hover {
          background: #bbdefb;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .user-detail-card {
            width: 95%;
            max-height: 95vh;
          }

          .card-content {
            padding: 20px;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .action-btns {
            flex-direction: column;
            align-items: stretch;
          }

          .action-btns button {
            width: 100%;
            margin-bottom: 5px;
          }

          .users-table {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminUsers;