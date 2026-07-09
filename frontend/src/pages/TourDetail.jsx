import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createBooking } from '../features/booking/bookingSlice';
import {
  getReviewsByTour,
  checkEligibility,
  createReview,
  reset as resetReviews,
} from '../features/review/reviewSlice';
import api from '../lib/api';
import '../styles/TourDetail.css';

function StarInput({ value, onChange }) {
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= value ? 'star-filled' : 'star-empty'}
          onClick={() => onChange(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function StarDisplay({ rating }) {
  return (
    <span className="star-display">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  );
}

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews, eligibility, isLoading: reviewsLoading } = useSelector((state) => state.review);

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('highlights');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    numberOfTourists: 1,
    dateFrom: '',
    dateTo: '',
    comments: ''
  });
  const [passportFile, setPassportFile] = useState(null);
  const [passportPreviewName, setPassportPreviewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await api.get(`/tours/${id}`);
        setTour(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tour:', error);
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  useEffect(() => {
    dispatch(getReviewsByTour(id));
    if (user) {
      dispatch(checkEligibility(id));
    }
    return () => {
      dispatch(resetReviews());
    };
  }, [id, user, dispatch]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'numberOfTourists' ? Number(value) : value
    }));
  };

  const handlePassportChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Passport copy must be less than 5MB');
      e.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, WebP, or PDF file');
      e.target.value = '';
      return;
    }

    setPassportFile(file);
    setPassportPreviewName(file.name);
  };

  const removePassport = () => {
    setPassportFile(null);
    setPassportPreviewName('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to book a tour');
      navigate('/login');
      return;
    }

    if (!bookingData.fullName || !bookingData.phone || !bookingData.email ||
        !bookingData.dateFrom || !bookingData.dateTo || !bookingData.numberOfTourists) {
      alert('Please fill in all required fields');
      return;
    }

    if (!passportFile) {
      alert('Please upload a copy of your passport to complete the booking');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('tourId', tour.id);
      formData.append('fullName', bookingData.fullName);
      formData.append('phone', bookingData.phone);
      formData.append('email', bookingData.email);
      formData.append('numberOfTourists', bookingData.numberOfTourists);
      formData.append('dateFrom', bookingData.dateFrom);
      formData.append('dateTo', bookingData.dateTo);
      formData.append('comments', bookingData.comments);
      formData.append('passport', passportFile);

      await dispatch(createBooking(formData)).unwrap();

      alert('Booking submitted successfully! We will contact you soon.');
      setShowBookingForm(false);
      setBookingData({
        fullName: '',
        phone: '',
        email: '',
        numberOfTourists: 1,
        dateFrom: '',
        dateTo: '',
        comments: ''
      });
      removePassport();
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(error || 'Error submitting booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      alert('Please write a comment for your review');
      return;
    }
    setSubmittingReview(true);
    try {
      await dispatch(createReview({ tourId: id, rating: reviewForm.rating, comment: reviewForm.comment })).unwrap();
      setReviewForm({ rating: 5, comment: '' });
      alert('Thank you! Your review has been posted.');
    } catch (err) {
      alert(err || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading tour details...</div>;
  }

  if (!tour) {
    return <div className="error-container">Tour not found</div>;
  }

  const imageUrl = tour.imageUrl || 'https://via.placeholder.com/800x400?text=Tour+Image';

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="tour-detail-container">
      <div className="tour-detail-hero">
        <img src={imageUrl} alt={tour.title} className="tour-hero-image" />
        <div className="tour-hero-overlay">
          <div className="tour-hero-content">
            <h1 className="tour-hero-title">{tour.title}</h1>
            <div className="tour-hero-meta">
              <span className="tour-price-large">${tour.price}</span>
              <span className="tour-duration-large">⏱ {tour.duration}</span>
              {averageRating && (
                <span className="tour-rating-large">
                  <StarDisplay rating={Math.round(averageRating)} /> {averageRating} ({reviews.length})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tour-detail-content">
        <div className="tour-detail-main">
          <div className="tour-tabs">
            <button
              className={`tab-button ${activeTab === 'highlights' ? 'active' : ''}`}
              onClick={() => setActiveTab('highlights')}
            >
              Highlights
            </button>
            <button
              className={`tab-button ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              Itinerary
            </button>
            <button
              className={`tab-button ${activeTab === 'travelDetails' ? 'active' : ''}`}
              onClick={() => setActiveTab('travelDetails')}
            >
              Travel Details
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'highlights' && (
              <div className="tab-panel">
                <h2>Tour Highlights</h2>
                {tour.highlights ? (
                  <div className="highlights-content">
                    <p>{tour.highlights}</p>
                  </div>
                ) : (
                  <p className="no-content">No highlights available for this tour.</p>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="tab-panel">
                <h2>Day-by-Day Itinerary</h2>
                {tour.itinerary && tour.itinerary.length > 0 ? (
                  <div className="itinerary-list">
                    {tour.itinerary.map((day, index) => (
                      <div key={index} className="itinerary-day-card">
                        <div className="itinerary-day-header">
                          <span className="day-badge">Day {day.day}</span>
                          <h3 className="day-title">{day.title}</h3>
                        </div>
                        <p className="day-description">{day.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-content">No itinerary available for this tour.</p>
                )}
              </div>
            )}

            {activeTab === 'travelDetails' && (
              <div className="tab-panel">
                <h2>Travel Details</h2>
                {tour.travelDetails ? (
                  <div className="travel-details-content">
                    <p>{tour.travelDetails}</p>
                  </div>
                ) : (
                  <p className="no-content">No travel details available for this tour.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h2>Customer Reviews</h2>

                {user && eligibility.eligible && (
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h3>Share your experience</h3>
                    <StarInput
                      value={reviewForm.rating}
                      onChange={(n) => setReviewForm(prev => ({ ...prev, rating: n }))}
                    />
                    <textarea
                      value={reviewForm.comment}
                      onChange={handleReviewChange}
                      rows="4"
                      placeholder="Tell other travelers about your trip..."
                      required
                    />
                    <button type="submit" className="btn-submit-review" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                )}

                {user && eligibility.alreadyReviewed && (
                  <p className="review-note">You've already reviewed this tour. Thank you!</p>
                )}

                {user && !eligibility.hasConfirmedBooking && !eligibility.alreadyReviewed && (
                  <p className="review-note">
                    Only customers with a confirmed booking for this tour can leave a review.
                  </p>
                )}

                {!user && (
                  <p className="review-note">
                    <span onClick={() => navigate('/login')} className="review-login-link">Log in</span> to leave a review if you've completed this tour.
                  </p>
                )}

                {reviewsLoading && reviews.length === 0 ? (
                  <p className="no-content">Loading reviews...</p>
                ) : reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-card-header">
                          <strong>{review.user?.name}</strong>
                          <StarDisplay rating={review.rating} />
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-content">No reviews yet. Be the first to share your experience!</p>
                )}
              </div>
            )}
          </div>

          <div className="tour-description-section">
            <h2>About This Tour</h2>
            <p>{tour.description}</p>
          </div>
        </div>

        <div className="tour-booking-sidebar">
          <div className="booking-card">
            <h3>Book This Trip</h3>
            <div className="booking-summary">
              <div className="booking-summary-item">
                <span>Price per person:</span>
                <strong>${tour.price}</strong>
              </div>
              <div className="booking-summary-item">
                <span>Duration:</span>
                <strong>{tour.duration}</strong>
              </div>
            </div>

            {!showBookingForm ? (
              <button
                className="btn-book-now"
                onClick={() => setShowBookingForm(true)}
              >
                Book This Trip
              </button>
            ) : (
              <form className="booking-form" onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleBookingChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleBookingChange}
                    required
                    placeholder="+251 911 223344"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleBookingChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numberOfTourists">Number of Tourists *</label>
                  <input
                    type="number"
                    id="numberOfTourists"
                    name="numberOfTourists"
                    value={bookingData.numberOfTourists}
                    onChange={handleBookingChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateFrom">Travel Date From *</label>
                  <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    value={bookingData.dateFrom}
                    onChange={handleBookingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateTo">Travel Date To *</label>
                  <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    value={bookingData.dateTo}
                    onChange={handleBookingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="passport">Passport Copy *</label>
                  {passportPreviewName ? (
                    <div className="passport-preview">
                      <span className="passport-file-name">📄 {passportPreviewName}</span>
                      <button
                        type="button"
                        className="passport-remove-btn"
                        onClick={removePassport}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="passport-upload-area">
                      <label htmlFor="passport" className="passport-upload-label">
                        <span className="passport-upload-icon">🛂</span>
                        <span>Click to upload passport copy</span>
                        <span className="passport-upload-hint">JPG, PNG, WebP, or PDF (Max 5MB)</span>
                      </label>
                      <input
                        id="passport"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handlePassportChange}
                        className="passport-file-input"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="comments">Comments / Special Requests</label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={bookingData.comments}
                    onChange={handleBookingChange}
                    rows="4"
                    placeholder="Any special requests or additional information..."
                  />
                </div>

                <div className="booking-form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowBookingForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .passport-upload-area {
          border: 2px dashed #ccc;
          border-radius: 10px;
          padding: 22px 16px;
          text-align: center;
          position: relative;
          cursor: pointer;
        }

        .passport-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #555;
        }

        .passport-upload-icon {
          font-size: 1.8rem;
          margin-bottom: 4px;
        }

        .passport-upload-hint {
          font-size: 0.78rem;
          color: #999;
        }

        .passport-file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .passport-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0f4e8;
          border: 1px solid #d5e2c0;
          border-radius: 8px;
          padding: 10px 14px;
        }

        .passport-file-name {
          font-size: 0.88rem;
          color: #556B2F;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 220px;
        }

        .passport-remove-btn {
          border: none;
          background: #fdeceb;
          color: #c62828;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }

        .star-input { font-size: 1.6rem; cursor: pointer; margin-bottom: 12px; }
        .star-display { font-size: 1rem; }
        .star-filled { color: #f5a623; }
        .star-empty { color: #ddd; }

        .review-form {
          background: #f9f9f7; border: 1px solid #eee; border-radius: 10px;
          padding: 20px; margin-bottom: 24px;
        }
        .review-form h3 { margin: 0 0 10px; font-size: 1.05rem; }
        .review-form textarea {
          width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;
          font-family: inherit; font-size: 0.92rem; box-sizing: border-box; resize: vertical;
        }
        .btn-submit-review {
          margin-top: 10px; background: #556B2F; color: #fff; border: none;
          padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .btn-submit-review:disabled { opacity: 0.6; cursor: not-allowed; }

        .review-note { color: #777; font-style: italic; margin-bottom: 20px; }
        .review-login-link { color: #556B2F; font-weight: 600; cursor: pointer; text-decoration: underline; }

        .reviews-list { display: flex; flex-direction: column; gap: 14px; }
        .review-card { border-bottom: 1px solid #eee; padding-bottom: 14px; }
        .review-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .review-comment { margin: 4px 0; line-height: 1.6; color: #444; }
        .review-date { font-size: 0.78rem; color: #999; }

        .tour-rating-large {
          display: inline-flex; align-items: center; gap: 6px; margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default TourDetail;