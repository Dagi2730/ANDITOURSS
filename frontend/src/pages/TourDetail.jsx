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
import PrintItineraryButton from '../components/PrintItineraryButton';
import api from '../lib/api';
import '../styles/TourDetail.css';

function StarInput({ value, onChange }) {
  return (
    <div className="star-input" style={{ fontSize: '1.8rem', cursor: 'pointer', display: 'flex', gap: '4px', margin: '8px 0' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{ color: n <= value ? '#facc15' : '#cbd5e1', transition: 'color 0.2s' }}
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
    <span className="star-display" style={{ color: '#facc15' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? '#facc15' : 'rgba(255,255,255,0.25)', marginRight: '2px' }}>★</span>
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

  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const handleReviewChange = (e) => {
    setReviewForm(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      alert('Please click on 1 to 5 stars to select your rating');
      return;
    }
    if (!reviewForm.comment.trim()) {
      alert('Please write a comment for your review');
      return;
    }
    setSubmittingReview(true);
    try {
      await dispatch(createReview({
        tourId: id,
        name: reviewForm.name,
        email: reviewForm.email,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      })).unwrap();
      setReviewForm({ name: '', email: '', rating: 0, comment: '' });
      alert('Thank you! Your review has been posted and will appear after admin approval.');
    } catch (err) {
      alert(typeof err === 'string' ? err : err?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingData.fullName || !bookingData.phone || !bookingData.email ||
        !bookingData.dateFrom || !bookingData.dateTo || !bookingData.numberOfTourists) {
      alert('Please fill in all required fields');
      return;
    }

    if (!passportFile) {
      alert('Please upload a copy of your passport to complete the booking');
      return;
    }

    const dFrom = new Date(bookingData.dateFrom);
    const dTo = new Date(bookingData.dateTo);

    if (dTo < dFrom) {
      alert('Travel End Date cannot be earlier than Travel Start Date');
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
      alert('Thank you! Your booking request has been submitted successfully. Andi Tours will reach out to you shortly.');
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(typeof error === 'string' ? error : error?.message || 'Error submitting booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/destinations');
    }
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const getImagesList = () => {
    if (!tour) return ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'];
    let list = [];
    if (tour.images && Array.isArray(tour.images) && tour.images.length > 0) {
      list = tour.images;
    } else if (tour.imageUrl) {
      try {
        const parsed = JSON.parse(tour.imageUrl);
        if (Array.isArray(parsed)) list = parsed;
        else list = [tour.imageUrl];
      } catch (e) {
        list = [tour.imageUrl];
      }
    }
    if (list.length === 0) {
      list = ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'];
    }
    return list.map(url => getImageUrl(url));
  };

  const imagesList = getImagesList();
  const currentImage = imagesList[activeImageIndex] || imagesList[0];

  const handlePrevImage = () => {
    if (!imagesList || imagesList.length <= 1) return;
    setActiveImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!imagesList || imagesList.length <= 1) return;
    setActiveImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="tour-modal-overlay" onClick={handleClose}>
        <div className="tour-modal-card" style={{ padding: '50px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
          <button className="tour-modal-close-btn" onClick={handleClose}>✕</button>
          <div className="loading-container" style={{ color: '#ffffff' }}>Loading tour details...</div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="tour-modal-overlay" onClick={handleClose}>
        <div className="tour-modal-card" style={{ padding: '50px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
          <button className="tour-modal-close-btn" onClick={handleClose}>✕</button>
          <div className="error-container" style={{ color: '#ffffff' }}>Tour not found</div>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const todayStr = new Date().toISOString().split('T')[0];
  const maxFutureDate = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0];

  return (
    <div className="tour-modal-overlay" onClick={handleClose}>
      <div className="tour-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* --- MODAL HEADER SECTION --- */}
        <div className="tour-modal-header">
          <div>
            <h1 className="tour-modal-header-title">{tour.title}</h1>
            <div className="tour-modal-header-meta">
              <span className="tour-duration-tag">⏱ {tour.duration}</span>
              {tour.location && <span className="tour-location-tag">📍 {tour.location}</span>}
              {averageRating && (
                <span className="tour-rating-tag">
                  <StarDisplay rating={Math.round(averageRating)} /> {averageRating} ({reviews.length})
                </span>
              )}
            </div>
          </div>
          <button className="tour-modal-close-btn" onClick={handleClose} title="Close Details (Esc)">
            ✕
          </button>
        </div>

        {/* --- STANDALONE IMAGE GALLERY --- */}
        <div className="tour-gallery-container">
          <div className="main-image-wrapper">
            <img src={currentImage} alt={tour.title} className="tour-standalone-image" />
            {imagesList.length > 1 && (
              <>
                <button className="gallery-arrow arrow-left" onClick={handlePrevImage} title="Previous Image (Left Arrow)">‹</button>
                <button className="gallery-arrow arrow-right" onClick={handleNextImage} title="Next Image (Right Arrow)">›</button>
                <div className="gallery-badge">{activeImageIndex + 1} / {imagesList.length}</div>
              </>
            )}
          </div>

          {/* THUMBNAIL SELECTORS */}
          {imagesList.length > 1 && (
            <div className="gallery-thumbnails">
              {imagesList.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`thumbnail-card ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
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
                <PrintItineraryButton tour={tour} />
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

                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h3>Share your experience</h3>
                  {!user && (
                    <div className="form-row-dual" style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                      <div className="input-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', fontWeight: '600' }}>Your Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={reviewForm.name || ''}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. John Doe"
                          required
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div className="input-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#555', fontWeight: '600' }}>Your Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={reviewForm.email || ''}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                          required
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>
                  )}
                  <label style={{ display: 'block', fontSize: '0.88rem', color: '#555', fontWeight: '600' }}>
                    Rating <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span> (Click 1 to 5 stars)
                  </label>
                  <StarInput
                    value={reviewForm.rating}
                    onChange={(n) => setReviewForm(prev => ({ ...prev, rating: n }))}
                  />
                  {reviewForm.rating === 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#e53e3e', display: 'block', marginBottom: '8px' }}>
                      Please select 1 to 5 stars
                    </span>
                  )}

                  <textarea
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    rows="4"
                    maxLength={1500}
                    placeholder="Tell other travelers about your trip..."
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', textAlign: 'right', marginTop: '4px' }}>
                    {reviewForm.comment.length} / 1500 characters
                  </span>

                  <button type="submit" className="btn-submit-review" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>

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
                  <label htmlFor="fullName">
                    Full Name <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
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
                  <label htmlFor="phone">
                    Phone Number <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
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
                  <label htmlFor="email">
                    Email Address <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
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
                  <label htmlFor="numberOfTourists">
                    Number of Tourists <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
                  <input
                    type="number"
                    id="numberOfTourists"
                    name="numberOfTourists"
                    value={bookingData.numberOfTourists}
                    onChange={handleBookingChange}
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateFrom">
                    Travel Start Date <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    value={bookingData.dateFrom}
                    onChange={handleBookingChange}
                    min={todayStr}
                    max={maxFutureDate}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateTo">
                    Travel End Date <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    value={bookingData.dateTo}
                    onChange={handleBookingChange}
                    min={bookingData.dateFrom || todayStr}
                    max={maxFutureDate}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="passport">
                    Passport Copy <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
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
                    maxLength={1000}
                    placeholder="Any special requests or additional information..."
                  />
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', textAlign: 'right', marginTop: '2px' }}>
                    {bookingData.comments.length} / 1000 characters
                  </span>
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
      </div>
    </div>
  );
};

export default TourDetail;