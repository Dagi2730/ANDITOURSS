import React, { useState, useEffect, useRef } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      orderId: '#ORD-001', 
      customer: 'John Smith', 
      email: 'john@example.com', 
      phone: '+251 911 223344',
      package: 'Simien Mountains Trek', 
      date: '2024-03-15', 
      amount: '$1,250', 
      status: 'pending', 
      startDate: '2024-04-10',
      endDate: '2024-04-17',
      duration: '7 days',
      visitors: 2,
      comment: 'We need an English speaking guide and a mule for luggage.'
    },
    // Add more mock data here as needed
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dropdownRefs = useRef({});

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

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    setActiveDropdown(null);
  };

  const getStatusBadge = (status) => {
    return <span className={`status-badge ${status}`}>{status.toUpperCase()}</span>;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="admin-orders-wrapper">
      <div className="admin-section-header">
        <h2>Customer Bookings</h2>
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
                  <div className="status-dropdown-container" ref={el => dropdownRefs.current[order.id] = el}>
                    <button 
                      className="status-trigger"
                      onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                    >
                      {getStatusBadge(order.status)} <small>▼</small>
                    </button>
                    
                    {activeDropdown === order.id && (
                      <div className="status-menu">
                        <button onClick={() => handleStatusChange(order.id, 'pending')}>Mark Pending</button>
                        <button onClick={() => handleStatusChange(order.id, 'confirmed')}>Mark Confirmed</button>
                        <button onClick={() => handleStatusChange(order.id, 'cancelled')}>Mark Cancelled</button>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="view-btn" onClick={() => setSelectedOrder(order)}>👁️ Details</button>
                    <button className="delete-btn" onClick={() => {
                        if(window.confirm("Delete this booking?")) 
                        setOrders(orders.filter(o => o.id !== order.id))
                    }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ATTRACTIVE DETAILS CARD MODAL --- */}
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
                <button className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;