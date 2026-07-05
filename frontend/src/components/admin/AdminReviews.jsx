import React, { useState, useEffect, useRef } from 'react';

function AdminReviews() {
  const [reviews, setReviews] = useState([
    { 
      id: 1, 
      user: 'John Smith', 
      package: 'Simien Mountains Trek', 
      rating: 5, 
      comment: 'Amazing experience! The mountain views were absolutely breathtaking. Our guide was knowledgeable and made the trip unforgettable.', 
      date: '2024-03-10', 
      status: 'approved',
      userEmail: 'john@example.com',
      bookingId: '#BK-001'
    },
    { 
      id: 2, 
      user: 'Sarah Johnson', 
      package: 'Danakil Depression Adventure', 
      rating: 4, 
      comment: 'Luxurious camping experience, friendly staff. The salt lakes were incredible. Would definitely recommend!', 
      date: '2024-03-08', 
      status: 'approved',
      userEmail: 'sarah@example.com',
      bookingId: '#BK-002',
      reply: 'Thank you for your wonderful feedback! We\'re glad you enjoyed the adventure.'
    },
    { 
      id: 3, 
      user: 'Michael Brown', 
      package: 'Lalibela Historical Tour', 
      rating: 3, 
      comment: 'Good historical sites but transportation could be better. The churches were amazing but the roads were rough.', 
      date: '2024-03-05', 
      status: 'pending',
      userEmail: 'michael@example.com',
      bookingId: '#BK-003'
    },
    { 
      id: 4, 
      user: 'Emma Wilson', 
      package: 'Omo Valley Cultural Experience', 
      rating: 5, 
      comment: 'Perfect cultural immersion! Everything was magical. The tribal ceremonies were authentic and the local guides were fantastic.', 
      date: '2024-03-01', 
      status: 'approved',
      userEmail: 'emma@example.com',
      bookingId: '#BK-004',
      reply: 'We appreciate your kind words! Cultural preservation is our priority.'
    },
    { 
      id: 5, 
      user: 'David Lee', 
      package: 'Bale Mountains National Park', 
      rating: 2, 
      comment: 'Not worth the price. Lodges were below standard and wildlife sightings were limited. Expected more for the cost.', 
      date: '2024-02-28', 
      status: 'rejected',
      userEmail: 'david@example.com',
      bookingId: '#BK-005',
      reply: 'We apologize for the experience. We\'ll improve our lodge partnerships.'
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
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

  const handleView = (review) => {
    setSelectedReview(review);
    setShowDetailsCard(true);
  };

  const handleDelete = (reviewId, userName) => {
    if (window.confirm(`Are you sure you want to delete review from ${userName}?`)) {
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      alert(`Review deleted successfully!`);
    }
  };

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
    setActiveDropdown(null);
  };

  const handleReply = (reviewId, userName) => {
    setShowReplyForm(reviewId);
    setReplyText('');
  };

  const submitReply = (reviewId) => {
    if (replyText.trim()) {
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId ? { ...review, reply: replyText, status: 'approved' } : review
        )
      );
      setShowReplyForm(null);
      setReplyText('');
    }
  };

  const getRatingStars = (rating) => {
    return (
      <div className="rating-display">
        <span className="stars">{'★'.repeat(rating)}</span>
        <span className="rating-number">{rating}/5</span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="status-badge status-active">✅ Approved</span>;
      case 'pending': return <span className="status-badge status-pending">⏳ Pending</span>;
      case 'rejected': return <span className="status-badge status-cancelled">❌ Rejected</span>;
      default: return <span className="status-badge status-pending">Pending</span>;
    }
  };

  const filteredReviews = filterStatus === 'all' 
    ? reviews 
    : reviews.filter(review => review.status === filterStatus);

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  };

  return (
    <div className="admin-reviews-wrapper">
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-title">⭐ Total Reviews</div>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-change positive">+8 from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">✅ Approved</div>
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-change positive">{Math.round((stats.approved/stats.total)*100)}% of total</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">⏳ Pending</div>
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-change negative">Needs attention</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">📊 Avg Rating</div>
          <div className="stat-number">{stats.averageRating}</div>
          <div className="stat-change positive">
            {'⭐'.repeat(Math.floor(stats.averageRating))}
          </div>
        </div>
      </div>

      {/* Review Details Modal */}
      {showDetailsCard && selectedReview && (
        <div className="admin-modal-overlay" onClick={() => setShowDetailsCard(false)}>
          <div className="review-detail-card" onClick={e => e.stopPropagation()}>
            <div className="card-top-accent"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Review Details</h3>
                <span className="review-tag">{selectedReview.bookingId}</span>
              </div>

              <div className="detail-grid">
                <div className="info-group">
                  <label>Customer Name</label>
                  <p className="highlight-text">{selectedReview.user}</p>
                </div>
                <div className="info-group">
                  <label>Package</label>
                  <p>{selectedReview.package}</p>
                </div>
                <div className="info-group">
                  <label>Rating</label>
                  <div className="rating-display-large">
                    <span className="stars-large">{'★'.repeat(selectedReview.rating)}</span>
                    <span className="rating-number-large">{selectedReview.rating}/5</span>
                  </div>
                </div>
                <div className="info-group">
                  <label>Review Date</label>
                  <p>📅 {selectedReview.date}</p>
                </div>
                <div className="info-group">
                  <label>Status</label>
                  <div className="status-display">
                    {getStatusBadge(selectedReview.status)}
                  </div>
                </div>
                <div className="info-group full">
                  <label>Customer Email</label>
                  <p>{selectedReview.userEmail}</p>
                </div>
                <div className="info-group full">
                  <label>Customer Comment</label>
                  <div className="comment-display">
                    "{selectedReview.comment}"
                  </div>
                </div>
                {selectedReview.reply && (
                  <div className="info-group full">
                    <label>Your Reply</label>
                    <div className="reply-display">
                      {selectedReview.reply}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="card-actions">
                <button 
                  className="btn-close" 
                  onClick={() => setShowDetailsCard(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Form Modal */}
      {showReplyForm && (
        <div className="admin-modal-overlay" onClick={() => setShowReplyForm(null)}>
          <div className="reply-form-card" onClick={e => e.stopPropagation()}>
            <div className="card-top-accent"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Reply to Review</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setShowReplyForm(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="reply-form">
                <textarea
                  className="reply-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows="5"
                />
                <div className="reply-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => setShowReplyForm(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-submit"
                    onClick={() => submitReply(showReplyForm)}
                    disabled={!replyText.trim()}
                  >
                    Submit Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <div>
            <h3>Customer Reviews</h3>
            <div className="filter-controls" style={{ marginTop: '10px' }}>
              <button 
                className={`admin-btn admin-btn-sm ${filterStatus === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setFilterStatus('all')}
              >
                All ({stats.total})
              </button>
              <button 
                className={`admin-btn admin-btn-sm ${filterStatus === 'approved' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setFilterStatus('approved')}
                style={{ marginLeft: '8px' }}
              >
                Approved ({stats.approved})
              </button>
              <button 
                className={`admin-btn admin-btn-sm ${filterStatus === 'pending' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setFilterStatus('pending')}
                style={{ marginLeft: '8px' }}
              >
                Pending ({stats.pending})
              </button>
              <button 
                className={`admin-btn admin-btn-sm ${filterStatus === 'rejected' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setFilterStatus('rejected')}
                style={{ marginLeft: '8px' }}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>
          <div>
            <button 
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => alert('Exporting reviews data...')}
            >
              Export Reviews
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-plain-table reviews-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Package</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <strong>{review.user}</strong>
                    <div className="user-email">{review.userEmail}</div>
                  </td>
                  <td>{review.package}</td>
                  <td>{getRatingStars(review.rating)}</td>
                  <td className="comment-cell">
                    <div className="comment-preview">{review.comment.substring(0, 80)}...</div>
                    {review.reply && (
                      <div className="reply-preview">
                        <span className="reply-label">Your reply:</span> {review.reply.substring(0, 60)}...
                      </div>
                    )}
                  </td>
                  <td>{review.date}</td>
                  <td style={{ overflow: 'visible' }}>
                    <div className="status-dropdown-container" ref={el => dropdownRefs.current[review.id] = el}>
                      <button 
                        className="status-trigger"
                        onClick={() => setActiveDropdown(activeDropdown === review.id ? null : review.id)}
                      >
                        {getStatusBadge(review.status)} <small>▼</small>
                      </button>
                      
                      {activeDropdown === review.id && (
                        <div className="status-menu">
                          <button onClick={() => handleStatusChange(review.id, 'pending')}>
                            <span className="status-indicator pending"></span>
                            Mark as Pending
                          </button>
                          <button onClick={() => handleStatusChange(review.id, 'approved')}>
                            <span className="status-indicator approved"></span>
                            Approve Review
                          </button>
                          <button onClick={() => handleStatusChange(review.id, 'rejected')}>
                            <span className="status-indicator rejected"></span>
                            Reject Review
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button 
                        className="view-btn"
                        onClick={() => handleView(review)}
                        title="View Details"
                      >
                        👁️ Details
                      </button>
                      <button 
                        className="reply-btn"
                        onClick={() => handleReply(review.id, review.user)}
                        title="Reply to Review"
                      >
                        💬 Reply
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(review.id, review.user)}
                        title="Delete Review"
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
        .admin-reviews-wrapper {
          padding: 20px;
        }
        
        .review-detail-card,
        .reply-form-card {
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
        
        .review-tag {
          background: #f5f5f5;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--admin-text);
          font-weight: 500;
        }
        
        .rating-display {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .rating-display-large {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.2rem;
        }
        
        .stars {
          color: #FFD700;
          font-size: 1.2rem;
          letter-spacing: 2px;
        }
        
        .stars-large {
          color: #FFD700;
          font-size: 1.5rem;
          letter-spacing: 3px;
        }
        
        .rating-number {
          color: #666;
          font-size: 0.9rem;
        }
        
        .rating-number-large {
          color: #333;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .comment-display,
        .reply-display {
          background: white;
          border: 1px solid var(--admin-border);
          border-radius: 6px;
          padding: 15px;
          margin-top: 10px;
          line-height: 1.6;
          color: var(--admin-text);
          min-height: 80px;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .comment-display {
          background-color: #faf8f4;
          font-style: italic;
        }
        
        .reply-display {
          background-color: #e8f5e9;
          border-left: 4px solid #4CAF50;
        }
        
        .user-email {
          font-size: 0.8rem;
          color: #666;
          margin-top: 4px;
        }
        
        .comment-cell {
          max-width: 300px;
        }
        
        .comment-preview {
          margin-bottom: 5px;
          line-height: 1.4;
        }
        
        .reply-preview {
          background: #f0f7ff;
          padding: 6px 10px;
          border-radius: 4px;
          margin-top: 5px;
          border-left: 3px solid #4a90e2;
          font-size: 0.85rem;
          line-height: 1.3;
        }
        
        .reply-label {
          font-weight: 600;
          color: #4a90e2;
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
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 0.85rem;
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
        
        .reply-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .reply-btn:hover {
          background: #c8e6c9;
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
        
        /* Reply Form Styles */
        .reply-form {
          padding: 20px;
        }
        
        .reply-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--admin-border);
          border-radius: 6px;
          font-size: 0.95rem;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
          margin-bottom: 20px;
        }
        
        .reply-textarea:focus {
          outline: none;
          border-color: var(--admin-olive);
          box-shadow: 0 0 0 3px rgba(85, 107, 47, 0.1);
        }
        
        .reply-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        .btn-cancel {
          padding: 10px 20px;
          background: #f5f5f5;
          color: #333;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .btn-cancel:hover {
          background: #e0e0e0;
        }
        
        .btn-submit {
          padding: 10px 20px;
          background: var(--admin-olive);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .btn-submit:hover:not(:disabled) {
          background: var(--admin-olive-hover);
          transform: translateY(-1px);
        }
        
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          .review-detail-card,
          .reply-form-card {
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
          
          .reviews-table {
            min-width: 600px;
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

export default AdminReviews;