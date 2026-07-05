import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../styles/TourDetail.css';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const baseURL = API_URL || 'http://localhost:8000';
        const response = await axios.get(`${baseURL}/api/tours/${id}`);
        setTour(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tour:', error);
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'numberOfTourists' ? Number(value) : value
    }));
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

    setSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const baseURL = API_URL || 'http://localhost:8000';
      const token = user.token;
      
      const response = await axios.post(
        `${baseURL}/api/bookings`,
        {
          tourId: tour._id,
          ...bookingData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(error.response?.data?.message || 'Error submitting booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading tour details...</div>;
  }

  if (!tour) {
    return <div className="error-container">Tour not found</div>;
  }

  const API_URL = import.meta.env.VITE_API_URL || '';
  const baseURL = API_URL || 'http://localhost:8000';
  const imageUrl = tour.imageUrl 
    ? (tour.imageUrl.startsWith('http') ? tour.imageUrl : `${baseURL}${tour.imageUrl}`)
    : 'https://via.placeholder.com/800x400?text=Tour+Image';

  return (
    <div className="tour-detail-container">
      {/* Hero Section */}
      <div className="tour-detail-hero">
        <img src={imageUrl} alt={tour.name} className="tour-hero-image" />
        <div className="tour-hero-overlay">
          <div className="tour-hero-content">
            <h1 className="tour-hero-title">{tour.name}</h1>
            <div className="tour-hero-meta">
              <span className="tour-price-large">${tour.price}</span>
              <span className="tour-duration-large">⏱ {tour.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-detail-content">
        <div className="tour-detail-main">
          {/* Tab Navigation */}
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
          </div>

          {/* Tab Content */}
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
          </div>

          {/* Description Section */}
          <div className="tour-description-section">
            <h2>About This Tour</h2>
            <p>{tour.description}</p>
          </div>
        </div>

        {/* Booking Section */}
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
    </div>
  );
};

export default TourDetail;


