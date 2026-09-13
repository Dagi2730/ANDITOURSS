import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBookings, getBookingStats, updateBookingStatus, deleteBooking } from '../../features/booking/adminBookingSlice';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

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

    const interval = setInterval(() => {
      dispatch(getBookings());
      dispatch(getBookingStats());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

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
      dispatch(getBookingStats());
      setActiveDropdown(null);
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this booking?')) {
      try {
        await dispatch(deleteBooking(id)).unwrap();
        dispatch(getBookingStats());
      } catch (error) {
        alert('Failed to delete booking');
      }
    }
  };

  // Sort bookings chronologically ascending to assign clean sequential order IDs (#00001, #00002, ...)
  const chronologicalBookings = [...bookings].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );

  const getOrderNumber = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking?.orderNumber) return booking.orderNumber;
    const idx = chronologicalBookings.findIndex((b) => b.id === bookingId);
    return idx >= 0 ? '#' + String(idx + 1).padStart(5, '0') : '#00001';
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: { bg: '#ff9800', color: '#fff' },
      CONFIRMED: { bg: '#4caf50', color: '#fff' },
      CANCELLED: { bg: '#f44336', color: '#fff' }
    };

    const style = statusStyles[status] || statusStyles.PENDING;

    return (
      <span
        className={`status-badge ${status?.toLowerCase()}`}
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
    : bookings.filter(booking => booking.status === filterStatus.toUpperCase());

  return (
    <div className="admin-orders-wrapper">
      <div className="admin-section-header">
        <div>
          <h2>Customer Bookings</h2>
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
        <div className="admin-table-container orders-table-container">
          <table className="admin-plain-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Order ID</th>
                <th style={{ width: '180px' }}>Customer</th>
                <th style={{ width: '140px' }}>Package</th>
                <th style={{ width: '100px' }}>Visitors</th>
                <th style={{ width: '130px' }}>Status</th>
                <th style={{ width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id-badge">{getOrderNumber(order.id)}</span>
                    </td>
                    <td className="customer-name-cell">
                      {order.user?.name || 'Guest Customer'}
                    </td>
                    <td className="package-title-cell">
                      {order.tour?.title || 'N/A'}
                    </td>
                    <td>{order.guests} Person(s)</td>
                    <td style={{ overflow: 'visible' }}>
                      <div className="status-dropdown-container" ref={el => dropdownRefs.current[order.id] = el}>
                        <button
                          className="status-trigger"
                          onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                        >
                          {getStatusBadge(order.status)} <small>▼</small>
                        </button>

                        {activeDropdown === order.id && (
                          <div className="status-menu">
                            <button onClick={() => handleStatusChange(order.id, 'PENDING')}>Mark Pending</button>
                            <button onClick={() => handleStatusChange(order.id, 'CONFIRMED')}>Mark Confirmed</button>
                            <button onClick={() => handleStatusChange(order.id, 'CANCELLED')}>Mark Cancelled</button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="view-btn" onClick={() => setSelectedOrder(order)}>👁️ Details</button>
                        <button className="delete-btn" onClick={() => handleDelete(order.id)}>🗑️</button>
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

      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-card" onClick={e => e.stopPropagation()}>
            <div className="card-top-accent"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Booking Details</h3>
                <span className="order-tag">{getOrderNumber(selectedOrder.id)}</span>
              </div>

              <div className="detail-grid">
                <div className="info-group">
                  <label>Customer Name</label>
                  <p className="modal-customer-name">{selectedOrder.user?.name || 'Guest Customer'}</p>
                </div>
                <div className="info-group">
                  <label>Phone Number</label>
                  <p>{selectedOrder.user?.phone || 'N/A'}</p>
                </div>
                <div className="info-group">
                  <label>Email Address</label>
                  <p>{selectedOrder.user?.email || 'N/A'}</p>
                </div>
                <div className="info-group">
                  <label>Tour Package</label>
                  <p className="highlight-text">{selectedOrder.tour?.title || 'N/A'}</p>
                </div>
                <div className="info-group">
                  <label>Visitors</label>
                  <p>{selectedOrder.guests} Person(s)</p>
                </div>
                <div className="info-group">
                  <label>Duration</label>
                  <p>{selectedOrder.tour?.duration || 'N/A'}</p>
                </div>
                <div className="info-group full">
                  <label>Travel Dates</label>
                  <p>📅 {selectedOrder.travelDate ? new Date(selectedOrder.travelDate).toLocaleDateString() : 'N/A'} ➔ {selectedOrder.travelDateEnd ? new Date(selectedOrder.travelDateEnd).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="info-group full">
                  <label>Uploaded Document / Passport Copy</label>
                  {selectedOrder.passportUrl ? (
                    <div className="passport-container">
                      <img 
                        src={getImageUrl(selectedOrder.passportUrl)}
                        alt="Uploaded Document"
                        className="passport-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="passport-actions">
                        <a 
                          href={getImageUrl(selectedOrder.passportUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="passport-view-link"
                        >
                          📄 Open Uploaded Document Full Size
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="passport-missing">No document uploaded with this booking</p>
                  )}
                </div>
                <div className="info-group full">
                  <label>Customer Comment</label>
                  <div className="comment-display">
                    {selectedOrder.comments || "No specific comments provided."}
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
        .orders-table-container {
          overflow-x: auto;
          width: 100%;
          padding-bottom: 10px;
          -webkit-overflow-scrolling: touch;
        }

        .admin-plain-table {
          width: 100%;
          min-width: 920px;
          border-collapse: separate;
          border-spacing: 0;
          background: #ffffff;
        }

        .admin-plain-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
          font-size: 0.88rem;
          padding: 14px 18px;
          border-bottom: 2px solid #e2e8f0;
          text-align: left;
          white-space: nowrap;
        }

        .admin-plain-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          font-size: 0.92rem;
        }

        .order-id-badge {
          background: #f1f5f9;
          color: #334155;
          padding: 5px 10px;
          border-radius: 6px;
          font-weight: 700;
          font-family: monospace;
          font-size: 0.9rem;
          border: 1px solid #cbd5e1;
          display: inline-block;
        }

        .customer-name-cell {
          font-weight: 700 !important;
          color: #0f172a !important;
          white-space: nowrap !important;
          padding-right: 24px !important;
        }

        .package-title-cell {
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          padding-right: 20px;
        }

        .modal-customer-name {
          font-size: 1.1rem !important;
          font-weight: 800 !important;
          color: #0f172a !important;
        }

        .status-dropdown-container {
          position: relative;
          display: inline-block;
        }

        .status-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
        }

        .status-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 6px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          z-index: 999;
          min-width: 160px;
          overflow: visible;
          display: flex;
          flex-direction: column;
        }

        .status-menu button {
          padding: 10px 14px;
          text-align: left;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .status-menu button:hover {
          background: #f5f5f5;
        }

        .status-menu button:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }
        
        /* Passport styles */
        .passport-container {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .passport-image {
          max-width: 100%;
          max-height: 350px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          object-fit: contain;
          background: #f8fafc;
          padding: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .passport-actions {
          display: flex;
          gap: 10px;
        }

        .passport-view-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #f0f4e8;
          color: #556B2F;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          margin-top: 4px;
          border: 1px solid #d5e2c0;
          transition: background 0.2s ease;
        }

        .passport-view-link:hover {
          background: #e2e9d4;
        }

        .passport-missing {
          color: #94a3b8;
          font-size: 0.9rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default AdminOrders;