import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from 'react-toastify';
import '../styles/ReviewsRecommendations.css';

const COUNTRIES_LIST = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Italy", "Spain", "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark",
  "Japan", "China", "India", "Brazil", "South Africa", "Ethiopia", "Kenya", "Other"
];

// StarDisplay helper
function StarDisplay({ rating }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? '#facc15' : 'rgba(255, 255, 255, 0.25)' }}>
          ★
        </span>
      ))}
    </span>
  );
}

// StarInput helper (starts unfilled if 0)
function StarInput({ value, onChange }) {
  return (
    <div className="modal-star-input" style={{ display: 'flex', gap: '6px', fontSize: '1.8rem', cursor: 'pointer', margin: '8px 0' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{ color: n <= value ? '#facc15' : '#cbd5e1', transition: 'color 0.2s' }}
          onClick={() => onChange(n)}
          role="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          {n <= value ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

const ReviewsRecommendationsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    user_name: '',
    user_country: 'United States',
    tour_name: '',
    rating: 0,
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

  // Keyboard navigation for closing modal (Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

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

    if (reviewForm.rating === 0) {
      toast.error('Please click a star (1 to 5) to select your review rating');
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
        user_country: 'United States',
        tour_name: '',
        rating: 0,
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reviews-page" style={{ background: '#0f172a', color: '#ffffff', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="reviews-hero" style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem' }}>
          Traveler Reviews & Testimonials
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
          Read authentic stories and verified feedback from travelers around the globe who experienced Ethiopia with Andi Tours.
        </p>
      </div>

      {/* Reviews Feed */}
      <section className="reviews-section" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="reviews-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title" style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: '700' }}>
            Verified Traveler Reviews
          </h2>
          <button
            className="btn-write-review"
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(145deg, #556B2F, #6B8E23)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ✍️ Write a Review
          </button>
        </div>

        {loadingReviews ? (
          <div className="no-reviews-message" style={{ color: '#ffffff', fontSize: '1.1rem', textAlign: 'center', padding: '3rem' }}>
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews-message" style={{ color: '#ffffff', fontSize: '1.1rem', textAlign: 'center', padding: '3rem', background: '#1e293b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            No reviews yet. Be the first to share your Ethiopian travel experience!
          </div>
        ) : (
          <div className="reviews-feed" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {reviews.map((review) => (
              <div key={review.id} className="review-feed-card" style={{ background: '#1e293b', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="review-feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div className="review-author-info">
                    <span className="review-author-name" style={{ fontWeight: '700', fontSize: '1.1rem', color: '#ffffff', display: 'block' }}>{review.user_name}</span>
                    {review.user_country && (
                      <span className="review-author-country" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        📍 {review.user_country}
                      </span>
                    )}
                  </div>
                  <StarDisplay rating={review.rating} />
                </div>
                <span className="review-tour-badge" style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.8rem', padding: '0.25rem 0.65rem', borderRadius: '8px', fontWeight: '600', marginBottom: '1rem' }}>
                  🗺️ {review.tour_name}
                </span>
                <p className="review-feed-comment" style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>{review.comment}</p>
                <span className="review-feed-date" style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>
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
                  <div className="review-feed-image" style={{ marginTop: '1rem', borderRadius: '10px', overflow: 'hidden', height: '180px' }}>
                    <img src={review.image_url} alt="Review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Write a Review Modal */}
      {showModal && (
        <div className="review-modal-overlay" onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()} style={{ background: '#1e293b', color: '#ffffff', borderRadius: '24px', padding: '2rem', maxWidth: '550px', width: '100%', border: '1px solid rgba(255,255,255,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            {submitted ? (
              <div className="modal-success" style={{ textAlign: 'center', padding: '2rem 0' }}>
                <span className="success-icon" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
                <h2 style={{ color: '#facc15', fontSize: '2rem', marginBottom: '1rem' }}>Thank You!</h2>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem' }}>
                  Your review has been submitted and will appear after admin approval. We appreciate your feedback!
                </p>
                <button className="submit-btn" onClick={closeModal} style={{ background: '#facc15', color: '#0f172a', border: 'none', padding: '0.75rem 2rem', borderRadius: '50px', fontWeight: '800', cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#ffffff' }}>Write a Review</h2>
                  <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleSubmitReview}>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="review-name" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Your Full Name <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="review-name"
                      name="user_name"
                      value={reviewForm.user_name}
                      onChange={handleFormChange}
                      placeholder="e.g. Sarah Johnson"
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="review-country" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Country of Residence
                    </label>
                    <select
                      id="review-country"
                      name="user_country"
                      value={reviewForm.user_country}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
                    >
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="review-tour" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Tour Taken <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="review-tour"
                      name="tour_name"
                      value={reviewForm.tour_name}
                      onChange={handleFormChange}
                      placeholder="e.g. Simien Mountains 4-Day Trek"
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Rating <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span> (Click to Rate)
                    </label>
                    <StarInput
                      value={reviewForm.rating}
                      onChange={(n) => setReviewForm((prev) => ({ ...prev, rating: n }))}
                    />
                    {reviewForm.rating === 0 && (
                      <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>Please select 1 to 5 stars</span>
                    )}
                  </div>

                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="review-date" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Travel Date
                    </label>
                    <input
                      type="date"
                      id="review-date"
                      name="travel_date"
                      value={reviewForm.travel_date}
                      onChange={handleFormChange}
                      max={today}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="review-comment" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Your Experience <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                    </label>
                    <textarea
                      id="review-comment"
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleFormChange}
                      placeholder="Tell us about your journey..."
                      rows="4"
                      maxLength={2000}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a', color: '#ffffff', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', textAlign: 'right' }}>
                      {reviewForm.comment.length} / 2000 characters
                    </span>
                  </div>

                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="review-image" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Add Photo (Optional)
                    </label>
                    <input
                      type="file"
                      id="review-image"
                      name="image"
                      accept="image/*"
                      onChange={handleFormChange}
                      style={{ width: '100%', color: '#cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(145deg, #556B2F, #6B8E23)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '50px',
                        fontWeight: '800',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      {submitting ? 'Submitting...' : 'SUBMIT REVIEW'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
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
