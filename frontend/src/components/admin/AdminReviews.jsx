import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews, updateReviewStatus, deleteReview } from '../../features/review/adminReviewSlice';

function StarDisplay({ rating }) {
  return (
    <span className="arev-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'arev-star-filled' : 'arev-star-empty'}>★</span>
      ))}
    </span>
  );
}

function AdminReviews() {
  const dispatch = useDispatch();
  const { reviews, isLoading } = useSelector((state) => state.adminReview);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(updateReviewStatus({ id, status: 'APPROVED' })).unwrap();
    } catch (err) {
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review? This cannot be undone.')) {
      try {
        await dispatch(deleteReview(id)).unwrap();
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  const filteredReviews = filterStatus === 'all'
    ? reviews
    : reviews.filter((r) => (r.status || 'PENDING') === filterStatus.toUpperCase());

  return (
    <div className="arev-wrapper">
      <div className="arev-header">
        <div>
          <h2 className="arev-heading">Customer Reviews</h2>
          <p className="arev-subheading">
            Moderate and approve customer reviews before they appear on the site.
          </p>
        </div>
        <div className="filter-tabs" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          {['all', 'pending', 'approved'].map((s) => (
            <button
              key={s}
              className={filterStatus === s ? 'active' : ''}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: filterStatus === s ? '#556B2F' : '#f8fafc',
                color: filterStatus === s ? '#fff' : '#475569',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="arev-list">
        {isLoading && reviews.length === 0 ? (
          <div className="arev-empty">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="arev-empty">
            <div className="arev-empty-icon">⭐</div>
            <h3>No reviews found</h3>
            <p>Customer reviews will appear here once submitted.</p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const isApproved = review.status === 'APPROVED';
            return (
              <div key={review.id} className="arev-row">
                <div className="arev-row-body">
                  <div className="arev-row-top">
                    <strong>{review.user?.name || 'Guest User'}</strong>
                    <span className="arev-email">{review.user?.email}</span>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: isApproved ? '#e8f5e9' : '#fff3e0',
                        color: isApproved ? '#2e7d32' : '#e65100',
                        border: isApproved ? '1px solid #c8e6c9' : '1px solid #ffe0b2',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}
                    >
                      {review.status || 'PENDING'}
                    </span>
                    <StarDisplay rating={review.rating} />
                  </div>
                  <p className="arev-tour">🗺️ {review.tour?.title || 'Ethiopia Tour'}</p>
                  <p className="arev-comment">{review.comment}</p>
                  <span className="arev-date">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="arev-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {!isApproved && (
                    <button
                      className="arev-approve-btn"
                      onClick={() => handleApprove(review.id)}
                      style={{
                        border: 'none',
                        background: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: '6px',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ✓ Approve
                    </button>
                  )}
                  <button className="arev-delete-btn" onClick={() => handleDelete(review.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .arev-wrapper { padding: 20px; font-family: 'Raleway', sans-serif; }
        .arev-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .arev-heading { margin: 0 0 4px; font-size: 1.4rem; font-weight: 700; }
        .arev-subheading { margin: 0; color: #6b6a63; font-size: 0.9rem; }

        .arev-list { display: flex; flex-direction: column; gap: 12px; }

        .arev-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }

        .arev-row-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
        .arev-email { font-size: 0.8rem; color: #64748b; }

        .arev-stars { margin-left: auto; }
        .arev-star-filled { color: #f5a623; }
        .arev-star-empty { color: #cbd5e1; }

        .arev-tour { font-size: 0.85rem; font-weight: 700; color: #556B2F; margin: 4px 0; }
        .arev-comment { font-size: 0.92rem; color: #334155; line-height: 1.6; margin: 8px 0; }
        .arev-date { font-size: 0.78rem; color: #94a3b8; }

        .arev-delete-btn {
          border: none; background: #fdecea; color: #c0392b; border-radius: 6px;
          padding: 8px 14px; cursor: pointer; font-size: 0.82rem; font-weight: 700;
          white-space: nowrap;
        }

        .arev-empty {
          text-align: center; padding: 60px 20px; color: #64748b; background: #fff;
          border-radius: 12px; border: 1px dashed #cbd5e1;
        }
        .arev-empty-icon { font-size: 2.4rem; margin-bottom: 10px; opacity: 0.6; }

        @media (max-width: 640px) {
          .arev-row { flex-direction: column; }
          .arev-actions { margin-top: 12px; width: 100%; justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
}

export default AdminReviews;