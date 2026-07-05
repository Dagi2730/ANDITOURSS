import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBookings, getBookingStats, updateBookingStatus, deleteBooking } from '../../features/booking/adminBookingSlice';

function AdminOrders() {
  const { bookings, stats, isLoading } = useSelector((state) => state.adminBooking);
  const dispatch = useDispatch();
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getBookingStats());
    
    // Refresh bookings and stats every 30 seconds to catch new/updated bookings
    const interval = setInterval(() => {
      dispatch(getBookings());
      dispatch(getBookingStats());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Close dropdown when clicking outside
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateBookingStatus({ id, status: newStatus })).unwrap();
      dispatch(getBookingStats()); // Refresh stats
      setActiveDropdown(null);
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this booking?')) {
      try {
        await dispatch(deleteBooking(id)).unwrap();
        dispatch(getBookingStats()); // Refresh stats
      } catch (error) {
        alert('Failed to delete booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: '#ff9800', color: '#fff' },
      confirmed: { bg: '#4caf50', color: '#fff' },
      cancelled: { bg: '#f44336', color: '#fff' }
    };
    
    const style = statusStyles[status] || statusStyles.pending;
    
    return (
      <span 
        className={`status-badge ${status}`}
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}
      >
        {status}
      </span>
    );
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus);

  return (
    <div className="admin-orders-wrapper">
      <div className="admin-section-header">
        <div>
          <h2>Customer Bookings</h2>
          {(stats.new > 0 || stats.updated > 0) && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              {stats.new > 0 && (
                <span style={{
                  background: '#f44336',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  ⚠️ {stats.new} New Booking{stats.new !== 1 ? 's' : ''}
                </span>
              )}
              {stats.updated > 0 && (
                <span style={{
                  background: '#ff9800',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  ✏️ {stats.updated} Updated Booking{stats.updated !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>
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

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Loading bookings...
        </div>
      ) : (
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
              {filteredBookings.length > 0 ? (
                filteredBookings.map((order) => (
                  <tr 
                    key={order._id}
                    style={{
                      backgroundColor: order.isNewBooking ? '#fff3cd' : order.isUpdated ? '#ffe0b2' : 'transparent'
                    }}
                  >
                    <td>
                      <strong>#{order._id.slice(-6)}</strong>
                      {order.isNewBooking && <span style={{ marginLeft: '8px', color: '#f44336' }}>🆕</span>}
                      {order.isUpdated && !order.isNewBooking && <span style={{ marginLeft: '8px', color: '#ff9800' }}>✏️</span>}
                    </td>
                    <td>{order.fullName}</td>
                    <td>{order.tour?.name || 'N/A'}</td>
                    <td>{order.numberOfTourists} Person(s)</td>
                    <td style={{ overflow: 'visible' }}>
                      <div className="status-dropdown-container" ref={el => dropdownRefs.current[order._id] = el}>
                        <button 
                          className="status-trigger"
                          onClick={() => setActiveDropdown(activeDropdown === order._id ? null : order._id)}
                        >
                          {getStatusBadge(order.status)} <small>▼</small>
                        </button>
                        
                        {activeDropdown === order._id && (
                          <div className="status-menu">
                            <button onClick={() => handleStatusChange(order._id, 'pending')}>Mark Pending</button>
                            <button onClick={() => handleStatusChange(order._id, 'confirmed')}>Mark Confirmed</button>
                            <button onClick={() => handleStatusChange(order._id, 'cancelled')}>Mark Cancelled</button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="view-btn" onClick={() => setSelectedOrder(order)}>👁️ Details</button>
                        <button className="delete-btn" onClick={() => handleDelete(order._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-card" onClick={e => e.stopPropagation()}>
            <div className="card-top-accent"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Booking Details</h3>
                <span className="order-tag">#{selectedOrder._id.slice(-6)}</span>
              </div>

              <div className="detail-grid">
                <div className="info-group">
                  <label>Customer Name</label>
                  <p>{selectedOrder.fullName}</p>
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
                  <p className="highlight-text">{selectedOrder.tour?.name || 'N/A'}</p>
                </div>
                <div className="info-group">
                  <label>Visitors</label>
                  <p>{selectedOrder.numberOfTourists} Person(s)</p>
                </div>
                <div className="info-group">
                  <label>Duration</label>
                  <p>{selectedOrder.tour?.duration || 'N/A'}</p>
                </div>
                <div className="info-group full">
                  <label>Travel Dates</label>
                  <p>📅 {selectedOrder.dateFrom ? new Date(selectedOrder.dateFrom).toLocaleDateString() : 'N/A'} ➔ {selectedOrder.dateTo ? new Date(selectedOrder.dateTo).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="info-group full">
                  <label>Customer Comment</label>
                  <div className="comment-display">
                    {selectedOrder.comments || "No specific comments provided."}
                  </div>
                </div>
                {selectedOrder.isUpdated && (
                  <div className="info-group full">
                    <label style={{ color: '#ff9800' }}>⚠️ Last Updated</label>
                    <p>{selectedOrder.lastUpdatedAt ? new Date(selectedOrder.lastUpdatedAt).toLocaleString() : 'N/A'}</p>
                  </div>
                )}
              </div>
              
              <div className="card-actions">
                <button className="btn-print" onClick={() => window.print()}>Print Invoice</button>
                <button className="btn-close" onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;


