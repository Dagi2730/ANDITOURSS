import React, { useState } from 'react';

function AdminStats() {
  const [orders, setOrders] = useState([
    { id: 1, orderId: '#ORD-001', customer: 'John Smith', package: 'Bali Paradise', date: '2024-03-15', amount: '$1,250', status: 'confirmed' },
    { id: 2, orderId: '#ORD-002', customer: 'Sarah Johnson', package: 'Maldives Escape', date: '2024-03-14', amount: '$2,100', status: 'pending' },
    { id: 3, orderId: '#ORD-003', customer: 'Michael Brown', package: 'Japan Adventure', date: '2024-03-12', amount: '$1,850', status: 'confirmed' },
    { id: 4, orderId: '#ORD-004', customer: 'Emma Wilson', package: 'Paris Romance', date: '2024-03-10', amount: '$1,500', status: 'cancelled' },
    { id: 5, orderId: '#ORD-005', customer: 'David Lee', package: 'Thailand Explorer', date: '2024-03-08', amount: '$980', status: 'confirmed' },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleView = (orderId) => {
    alert(`Viewing order: ${orderId}`);
  };

  const handleEdit = (orderId) => {
    alert(`Editing order: ${orderId}`);
  };

  const handleDelete = (orderId, index) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const newOrders = orders.filter((_, i) => i !== index);
      setOrders(newOrders);
      alert(`Order ${orderId} deleted successfully!`);
    }
  };

  const handleStatusChange = (orderId, newStatus, index) => {
    const newOrders = [...orders];
    newOrders[index].status = newStatus;
    setOrders(newOrders);
    setDropdownOpen(null);
    alert(`Order ${orderId} status changed to ${newStatus}`);
  };

  const toggleDropdown = (orderId) => {
    setDropdownOpen(dropdownOpen === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="status-badge status-active">Confirmed</span>;
      case 'pending': return <span className="status-badge status-pending">Pending</span>;
      case 'cancelled': return <span className="status-badge status-cancelled">Cancelled</span>;
      default: return <span className="status-badge status-pending">Pending</span>;
    }
  };

  const stats = [
    { 
      title: 'Total Users', 
      value: '1,254', 
      change: '+12.5%', 
      positive: true,
      icon: '👤'
    },
    { 
      title: 'Total Orders', 
      value: orders.length.toString(), 
      change: '+8.2%', 
      positive: true,
      icon: '📦'
    },
    { 
      title: 'Revenue', 
      value: '$24,580', 
      change: '+15.3%', 
      positive: true,
      icon: '💰'
    },
    { 
      title: 'Growth Rate', 
      value: '24.5%', 
      change: '+3.2%', 
      positive: true,
      icon: '📈'
    },
  ];

  return (
    <div>
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

      <div className="table-container">
        <div className="table-header">
          <h3>Recent Orders</h3>
          <div>
            <button 
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => alert('Exporting data to CSV...')}
            >
              Export CSV
            </button>
            <button 
              className="admin-btn admin-btn-primary admin-btn-sm" 
              style={{ marginLeft: '10px' }}
              onClick={() => alert('Opening new order form...')}
            >
              + New Order
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-plain-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{order.orderId}</td>
                  <td>{order.customer}</td>
                  <td>{order.package}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    <div className="status-with-dropdown">
                      {getStatusBadge(order.status)}
                      <div className="dropdown-container">
                        <button 
                          className="dropdown-toggle"
                          onClick={() => toggleDropdown(order.orderId)}
                          title="Change Status"
                        >
                          ▼
                        </button>
                        {dropdownOpen === order.orderId && (
                          <div className="dropdown-menu">
                            <button 
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order.orderId, 'pending', index)}
                            >
                              <span className="status-indicator pending"></span>
                              Mark as Pending
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order.orderId, 'confirmed', index)}
                            >
                              <span className="status-indicator active"></span>
                              Mark as Confirmed
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order.orderId, 'cancelled', index)}
                            >
                              <span className="status-indicator cancelled"></span>
                              Mark as Cancelled
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
                        onClick={() => handleView(order.orderId)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="admin-btn admin-btn-primary admin-btn-sm admin-btn-icon"
                        onClick={() => handleEdit(order.orderId)}
                        title="Edit Order"
                      >
                        ✏️
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
                        onClick={() => handleDelete(order.orderId, index)}
                        title="Delete Order"
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
    </div>
  );
}

export default AdminStats;