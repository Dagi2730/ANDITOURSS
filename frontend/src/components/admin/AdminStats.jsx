import React, { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';

function AdminStats() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dropdownRefs = useRef({});

  const mapBookingToOrder = (booking) => ({
    id: booking.id,
    orderId: `#${booking.id.slice(-6).toUpperCase()}`,
    customer: booking.user?.name || 'Unknown customer',
    email: booking.user?.email || '',
    phone: booking.user?.phone || '',
    package: booking.tour?.title || 'N/A',
    date: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A',
    amount: booking.tour ? `$${(booking.tour.price * (booking.guests || 1)).toLocaleString()}` : '$0',
    status: (booking.status || 'PENDING').toLowerCase(),
    startDate: booking.travelDate ? new Date(booking.travelDate).toISOString().split('T')[0] : 'N/A',
    endDate: booking.travelDateEnd ? new Date(booking.travelDateEnd).toISOString().split('T')[0] : 'N/A',
    duration: booking.tour?.duration || 'N/A',
    visitors: booking.guests || 1,
    comment: booking.comments || 'No specific comments provided.',
    raw: booking,
  });

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [bookingsRes, usersRes, toursRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/users'),
        api.get('/tours'),
      ]);

      setOrders((bookingsRes.data || []).map(mapBookingToOrder));
      setUsers(usersRes.data || []);
      setTours(toursRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load live dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown !== null) {
        const ref = dropdownRefs.current[activeDropdown];
        if (ref && !ref.contains(event.target)) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const targetBooking = orders.find((order) => order.id === orderId);
      if (!targetBooking) return;

      await api.put(`/bookings/${targetBooking.id}`, { status: newStatus.toUpperCase() });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status');
    } finally {
      setActiveDropdown(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Delete this booking?')) return;

    try {
      const targetBooking = orders.find((order) => order.id === orderId);
      if (!targetBooking) return;

      await api.delete(`/bookings/${targetBooking.id}`);
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Failed to delete booking');
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = (status || 'pending').toString().toLowerCase();
    return <span className={`status-badge ${normalizedStatus}`}>{normalizedStatus.toUpperCase()}</span>;
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const totalRevenue = orders.reduce((sum, order) => {
    const amount = Number(order.raw?.tour?.price || 0) * Number(order.raw?.guests || 1);
    return sum + amount;
  }, 0);

  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const confirmedCount = orders.filter((order) => order.status === 'confirmed').length;

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toLocaleString(),
      change: `${users.length} registered accounts`,
      positive: true,
      icon: '👤'
    },
    {
      title: 'Total Bookings',
      value: orders.length.toString(),
      change: `${confirmedCount} confirmed`,
      positive: true,
      icon: '📦'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: `${pendingCount} pending`,
      positive: true,
      icon: '💰'
    },
    {
      title: 'Active Packages',
      value: tours.length.toString(),
      change: `${tours.length} available tours`,
      positive: true,
      icon: '📈'
    },
  ];

  return (
    <div className="admin-stats-wrapper">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-title">
              {stat.icon} {stat.title}
            </div>
            <div className="stat-number">{stat.value}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      <div className="admin-orders-section">
        <div className="admin-section-header">
          <h3>Recent Orders</h3>
          <div className="filter-tabs">
            {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
              <button 
                key={s} 
                className={filterStatus === s ? 'active' : ''} 
                onClick={() => setFilterStatus(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-plain-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Visitors</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.orderId}</strong></td>
                  <td>{order.customer}</td>
                  <td>{order.package}</td>
                  <td>{order.visitors} Persons</td>
                  <td style={{ overflow: 'visible' }}>
                    <div className="status-dropdown-container" ref={el => dropdownRefs.current[order.orderId] = el}>
                      <button 
                        className="status-trigger"
                        onClick={() => setActiveDropdown(activeDropdown === order.orderId ? null : order.orderId)}
                      >
                        {getStatusBadge(order.status)} <small>▼</small>
                      </button>
                      
                      {activeDropdown === order.orderId && (
                        <div className="status-menu">
                          <button onClick={() => handleStatusChange(order.orderId, 'pending')}>Mark Pending</button>
                          <button onClick={() => handleStatusChange(order.orderId, 'confirmed')}>Mark Confirmed</button>
                          <button onClick={() => handleStatusChange(order.orderId, 'cancelled')}>Mark Cancelled</button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="view-btn" onClick={() => setSelectedOrder(order)}>👁️ Details</button>
                      <button className="delete-btn" onClick={() => {
                          if(window.confirm("Delete this booking?")) 
                          setOrders(prevOrders => prevOrders.filter(o => o.orderId !== order.orderId))
                      }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-card" onClick={e => e.stopPropagation()}>
            <div className="card-top-accent"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Booking Details</h3>
                <span className="order-tag">{selectedOrder.orderId}</span>
              </div>

              <div className="detail-grid">
                <div className="info-group">
                  <label>Customer Name</label>
                  <p>{selectedOrder.customer}</p>
                </div>
                <div className="info-group">
                  <label>Phone Number</label>
                  <p>{selectedOrder.phone}</p>
                </div>
                <div className="info-group">
                  <label>Email Address</label>
                  <p>{selectedOrder.email}</p>
                </div>
                <div className="info-group">
                  <label>Tour Package</label>
                  <p className="highlight-text">{selectedOrder.package}</p>
                </div>
                <div className="info-group">
                  <label>Visitors</label>
                  <p>{selectedOrder.visitors} Person(s)</p>
                </div>
                <div className="info-group">
                  <label>Duration</label>
                  <p>{selectedOrder.duration}</p>
                </div>
                <div className="info-group full">
                  <label>Travel Dates</label>
                  <p>📅 {selectedOrder.startDate} ➔ {selectedOrder.endDate}</p>
                </div>
                <div className="info-group full">
                  <label>Customer Comment</label>
                  <div className="comment-display">
                    {selectedOrder.comment || "No specific comments provided."}
                  </div>
                </div>
              </div>
              
              <div className="card-actions">
                <button className="btn-print" onClick={() => window.print()}>Print Invoice</button>
                <button className="btn-close" onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-stats-wrapper {
          padding: 20px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border-left: 4px solid #4CAF50;
        }
        
        .stat-title {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 10px;
          font-weight: 500;
        }
        
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 5px;
        }
        
        .stat-change {
          font-size: 0.85rem;
        }
        
        .stat-change.positive {
          color: #4CAF50;
        }
        
        .stat-change.negative {
          color: #F44336;
        }
        
        .admin-orders-section {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        
        .admin-section-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        
        .admin-section-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.2rem;
        }
        
        .filter-tabs {
          display: flex;
          gap: 8px;
        }
        
        .filter-tabs button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: #f5f5f5;
          color: #666;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .filter-tabs button.active {
          background: #556B2F;
          color: white;
          border-color: #556B2F;
        }
        
        .filter-tabs button:hover:not(.active) {
          background: #e0e0e0;
        }
        
        .admin-table-container {
          padding: 20px;
        }
        
        .admin-plain-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .admin-plain-table th {
          background: #f9f9f9;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 1px solid #eee;
          font-size: 0.9rem;
        }
        
        .admin-plain-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
          color: #333;
          font-size: 0.9rem;
        }
        
        .admin-plain-table tr:hover {
          background: #f9f9f9;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-badge.pending {
          background: #FFF3E0;
          color: #EF6C00;
          border: 1px solid #FFE0B2;
        }
        
        .status-badge.confirmed {
          background: #E8F5E9;
          color: #2E7D32;
          border: 1px solid #C8E6C9;
        }
        
        .status-badge.cancelled {
          background: #FFEBEE;
          color: #C62828;
          border: 1px solid #FFCDD2;
        }
        
        .status-dropdown-container {
          display: inline-block;
          position: relative;
        }
        
        .status-trigger {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          padding: 0;
        }
        
        .status-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          min-width: 150px;
          margin-top: 5px;
        }
        
        .status-menu button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
        }
        
        .status-menu button:hover {
          background: #f5f5f5;
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
        
        .delete-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          background: #ffebee;
          color: #c62828;
        }
        
        .delete-btn:hover {
          background: #ffcdd2;
          transform: translateY(-1px);
        }
        
        /* Modal Styles */
        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        
        .order-detail-card {
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
        
        .card-top-accent {
          height: 4px;
          background: linear-gradient(90deg, #556B2F, #6B8E23);
          border-radius: 12px 12px 0 0;
        }
        
        .card-content {
          padding: 30px;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        
        .card-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }
        
        .order-tag {
          background: #f5f5f5;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .info-group {
          display: flex;
          flex-direction: column;
        }
        
        .info-group.full {
          grid-column: 1 / -1;
        }
        
        .info-group label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .info-group p {
          margin: 0;
          color: #333;
          font-size: 1rem;
        }
        
        .highlight-text {
          color: #556B2F;
          font-weight: 600;
        }
        
        .comment-display {
          background: #faf8f4;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 15px;
          margin-top: 5px;
          line-height: 1.6;
          color: #333;
          font-style: italic;
        }
        
        .card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .btn-print {
          padding: 10px 20px;
          background: #556B2F;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .btn-print:hover {
          background: #6B8E23;
          transform: translateY(-1px);
        }
        
        .btn-close {
          padding: 10px 20px;
          background: #f5f5f5;
          color: #333;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .btn-close:hover {
          background: #e0e0e0;
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
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .admin-section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .filter-tabs {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 5px;
          }
          
          .admin-plain-table {
            min-width: 600px;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .status-dropdown-container {
            position: static;
          }
          
          .status-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminStats;