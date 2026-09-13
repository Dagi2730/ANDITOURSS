import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from 'react-toastify';
import '../styles/ReviewsRecommendations.css';

// Recommendations removed as per user request

// ─── FAQ Data ───
// Moved to FAQAssistant

// ─── StarDisplay helper ───
function StarDisplay({ rating }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= rating ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

// ─── StarInput helper ───
function StarInput({ value, onChange }) {
  return (
    <div className="modal-star-input">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= value ? 'star-filled' : 'star-empty'}
          onClick={() => onChange(n)}
          role="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Main Page Component ───
const ReviewsRecommendationsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    user_name: '',
    user_country: '',
    tour_name: '',
    rating: 5,
    comment: '',
    travel_date: '',
    image: null,
  });

  // Fetch approved reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/public-reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  // Handle review form
  const handleFormChange = (e) => {
    if (e.target.name === 'image') {
      setReviewForm((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setReviewForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.user_name || !reviewForm.tour_name || !reviewForm.comment) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('user_name', reviewForm.user_name);
      formData.append('user_country', reviewForm.user_country);
      formData.append('tour_name', reviewForm.tour_name);
      formData.append('rating', reviewForm.rating);
      formData.append('comment', reviewForm.comment);
      if (reviewForm.travel_date) formData.append('travel_date', reviewForm.travel_date);
      if (reviewForm.image) formData.append('image', reviewForm.image);

      await api.post('/public-reviews', formData);
      setSubmitted(true);
      setReviewForm({
        user_name: '',
        user_country: '',
        tour_name: '',
        rating: 5,
        comment: '',
        travel_date: '',
        image: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
  };

  return (
    <div className="reviews-page">
      {/* ── Hero ── */}
      <div className="reviews-hero">
        <h1>Traveler Reviews</h1>
        <p>
          Read verified stories from travelers who explored with us.
        </p>
      </div>

      {/* ── Reviews Feed ── */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2 className="section-title">✅ Verified Traveler Reviews</h2>
          <button
            className="btn-write-review"
            onClick={() => setShowModal(true)}
          >
            ✍️ Write a Review
          </button>
        </div>

        {loadingReviews ? (
          <div className="no-reviews-message">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews-message">
            No reviews yet. Be the first to share your Ethiopian travel experience!
          </div>
        ) : (
          <div className="reviews-feed">
            {reviews.map((review) => (
              <div key={review.id} className="review-feed-card">
                <div className="review-feed-header">
                  <div className="review-author-info">
                    <span className="review-author-name">{review.user_name}</span>
                    {review.user_country && (
                      <span className="review-author-country">
                        📍 {review.user_country}
                      </span>
                    )}
                  </div>
                  <StarDisplay rating={review.rating} />
                </div>
                <span className="review-tour-badge">🗺️ {review.tour_name}</span>
                <p className="review-feed-comment">{review.comment}</p>
                <span className="review-feed-date">
                  {review.travel_date
                    ? `Traveled: ${new Date(review.travel_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}`
                    : new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                </span>
                {review.image_url && (
                  <div className="review-feed-image">
                    <img src={review.image_url} alt="Review" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>


      {/* ── Write a Review Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="modal-success glass-form" style={{maxWidth: '500px'}}>
                <span className="success-icon">🎉</span>
                <h2 style={{ color: '#a8c648' }}>Thank You!</h2>
                <p>
                  Your review has been submitted and will appear after admin
                  approval. We appreciate your feedback!
                </p>
                <div className="modal-actions" style={{ justifyContent: 'center' }}>
                  <button className="btn-modal-submit" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-form" style={{maxWidth: '500px'}}>
                <h2>Write a Review</h2>
                <form onSubmit={handleSubmitReview}>
                  <div className="input-group">
                    <label htmlFor="review-name">Your Name *</label>
                    <input
                      type="text"
                      id="review-name"
                      name="user_name"
                      value={reviewForm.user_name}
                      onChange={handleFormChange}
                      placeholder="e.g. Sarah Johnson"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="review-country">Country</label>
                    <input
                      type="text"
                      id="review-country"
                      name="user_country"
                      value={reviewForm.user_country}
                      onChange={handleFormChange}
                      placeholder="e.g. United States"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="review-tour">Tour Taken *</label>
                    <input
                      type="text"
                      id="review-tour"
                      name="tour_name"
                      value={reviewForm.tour_name}
                      onChange={handleFormChange}
                      placeholder="e.g. Simien Mountains Trek"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Rating *</label>
                    <StarInput
                      value={reviewForm.rating}
                      onChange={(n) =>
                        setReviewForm((prev) => ({ ...prev, rating: n }))
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="review-date">Travel Date</label>
                    <input
                      type="date"
                      id="review-date"
                      name="travel_date"
                      value={reviewForm.travel_date}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="review-comment">Your Experience *</label>
                    <textarea
                      id="review-comment"
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleFormChange}
                      placeholder="Tell us about your journey..."
                      rows="5"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="review-image">Add an Image (Optional)</label>
                    <input
                      type="file"
                      id="review-image"
                      name="image"
                      accept="image/*"
                      onChange={handleFormChange}
                      style={{ padding: '8px 0' }}
                    />
                  </div>

                  <div className="modal-actions" style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
                    <button
                      type="button"
                      className="send-btn"
                      style={{background: 'rgba(255,255,255,0.1)', color: '#fff'}}
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="send-btn"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsRecommendationsPage;
