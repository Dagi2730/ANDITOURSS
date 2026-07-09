import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews, deleteReview } from '../../features/review/adminReviewSlice';

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

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review? This cannot be undone.')) {
      try {
        await dispatch(deleteReview(id)).unwrap();
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  return (
    <div className="arev-wrapper">
      <div className="arev-header">
        <h2 className="arev-heading">Customer Reviews</h2>
        <p className="arev-subheading">
          Moderate reviews left by customers with confirmed bookings.
        </p>
      </div>

      <div className="arev-list">
        {isLoading && reviews.length === 0 ? (
          <div className="arev-empty">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="arev-empty">
            <div className="arev-empty-icon">⭐</div>
            <h3>No reviews yet</h3>
            <p>Customer reviews will appear here once submitted.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="arev-row">
              <div className="arev-row-body">
                <div className="arev-row-top">
                  <strong>{review.user?.name}</strong>
                  <span className="arev-email">{review.user?.email}</span>
                  <StarDisplay rating={review.rating} />
                </div>
                <p className="arev-tour">{review.tour?.title}</p>
                <p className="arev-comment">{review.comment}</p>
                <span className="arev-date">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
              <button className="arev-delete-btn" onClick={() => handleDelete(review.id)}>
                🗑️ Delete
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .arev-wrapper { padding: 20px; font-family: 'Inter', sans-serif; }
        .arev-header { margin-bottom: 24px; }
        .arev-heading { margin: 0 0 4px; font-size: 1.4rem; font-weight: 700; }
        .arev-subheading { margin: 0; color: #6b6a63; font-size: 0.9rem; }

        .arev-list { display: flex; flex-direction: column; gap: 12px; }

        .arev-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 16px;
        }

        .arev-row-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .arev-email { font-size: 0.8rem; color: #8a8878; }

        .arev-stars { margin-left: auto; }
        .arev-star-filled { color: #f5a623; }
        .arev-star-empty { color: #ddd; }

        .arev-tour { font-size: 0.85rem; font-weight: 600; color: #556B2F; margin: 4px 0; }
        .arev-comment { font-size: 0.9rem; color: #444; line-height: 1.6; margin: 6px 0; }
        .arev-date { font-size: 0.78rem; color: #aaa; }

        .arev-delete-btn {
          border: none; background: #fdecea; color: #c0392b; border-radius: 6px;
          padding: 8px 14px; cursor: pointer; font-size: 0.82rem; font-weight: 600;
          margin-left: 16px; white-space: nowrap;
        }

        .arev-empty {
          text-align: center; padding: 60px 20px; color: #8a8878; background: #fff;
          border-radius: 12px; border: 1px dashed #ddd;
        }
        .arev-empty-icon { font-size: 2.4rem; margin-bottom: 10px; opacity: 0.6; }

        @media (max-width: 640px) {
          .arev-row { flex-direction: column; }
          .arev-delete-btn { margin-left: 0; margin-top: 10px; }
        }
      `}</style>
    </div>
  );
}

export default AdminReviews;