import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBooking, deleteBooking } from '../features/booking/bookingSlice';
import api from '../lib/api';
import { toast } from 'react-toastify';
import '../styles/MyBookings.css';

const MyBookings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lookupEmail, setLookupEmail] = useState('');
  const [searching, setSearching] = useState(false);

  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    guests: 1,
    travelDate: '',
    travelDateEnd: '',
    comments: ''
  });

  const fetchBookings = async (emailToSearch = '') => {
    setLoading(true);
    try {
      let url = '/bookings/mybookings';
      const search = emailToSearch || lookupEmail || localStorage.getItem('guestBookingEmail');
      if (!user && search) {
        url += `?email=${encodeURIComponent(search)}`;
      }
      const res = await api.get(url);
      setBookingsList(res.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookingsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('guestBookingEmail') || '';
    if (savedEmail && !user) {
      setLookupEmail(savedEmail);
    }
    fetchBookings(savedEmail);
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!lookupEmail.trim()) {
      toast.error('Please enter your email address to search bookings');
      return;
    }
    localStorage.setItem('guestBookingEmail', lookupEmail.trim());
    fetchBookings(lookupEmail.trim());
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking.id);
    setBookingFormData({
      guests: booking.guests,
      travelDate: booking.travelDate ? booking.travelDate.split('T')[0] : '',
      travelDateEnd: booking.travelDateEnd ? booking.travelDateEnd.split('T')[0] : '',
      comments: booking.comments || ''
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };

  const handleUpdateBooking = async (bookingId) => {
    if (!bookingFormData.travelDate || !bookingFormData.travelDateEnd || !bookingFormData.guests) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(updateBooking({ id: bookingId, bookingData: bookingFormData })).unwrap();
      toast.success('Booking updated successfully!');
      setEditingBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(error || 'Failed to update booking');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(deleteBooking(bookingId)).unwrap();
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error(error || 'Failed to cancel booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`booking-status-badge status-${status?.toLowerCase()}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="my-bookings-container mb-page">
      <div className="my-bookings-header mb-header">
        <h1>My Bookings</h1>
        <p>Track and manage your Ethiopian tour bookings</p>
      </div>

      {!user && (
        <div className="email-lookup-card glass-form mb-lookup">
          <h3>Lookup Your Bookings</h3>
          <p className="lookup-hint">Enter the email address you used when booking your tour:</p>
          <form onSubmit={handleSearchSubmit} className="lookup-form">
            <input
              type="email"
              placeholder="your.email@example.com"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              required
            />
            <button type="submit" className="lookup-btn">View My Bookings</button>
          </form>
        </div>
      )}

      <div className="bookings-section mb-section">
        {loading ? (
          <div className="loading-message mb-loading">Loading bookings...</div>
        ) : bookingsList && bookingsList.length > 0 ? (
          <div className="bookings-list mb-list">
            {bookingsList.map((booking) => (
              <div key={booking.id} className="booking-card mb-card">
                <div className="booking-card-header mb-card-header">
                  <div>
                    <h3>{booking.tour?.title || 'Tour Package'}</h3>
                    <p className="booking-id mb-booking-id">
                      Booking ID: {booking.orderNumber || `#${String(booking.id).slice(-5)}`}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                {editingBooking === booking.id ? (
                  <div className="booking-edit-form glass-form" style={{maxWidth: '100%', padding: '24px', marginTop: '16px'}}>
                    <div className="form-row mb-form-row">
                      <div className="input-group">
                        <label>Number of Tourists *</label>
                        <input type="number" name="guests" value={bookingFormData.guests} onChange={handleBookingChange} min="1" required />
                      </div>
                    </div>
                    <div className="form-row mb-form-row" style={{display: 'flex', gap: '20px'}}>
                      <div className="input-group" style={{flex: 1}}>
                        <label>Date From *</label>
                        <input type="date" name="travelDate" value={bookingFormData.travelDate} onChange={handleBookingChange} required />
                      </div>
                      <div className="input-group" style={{flex: 1}}>
                        <label>Date To *</label>
                        <input type="date" name="travelDateEnd" value={bookingFormData.travelDateEnd} onChange={handleBookingChange} required />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Comments / Special Requests</label>
                      <textarea name="comments" value={bookingFormData.comments} onChange={handleBookingChange} rows="3" />
                    </div>
                    <div className="form-actions mb-form-actions" style={{display: 'flex', gap: '15px', marginTop: '15px'}}>
                      <button type="button" className="send-btn" style={{background: 'rgba(255,255,255,0.1)', color: '#fff'}} onClick={() => setEditingBooking(null)}>Cancel</button>
                      <button type="button" className="send-btn" onClick={() => handleUpdateBooking(booking.id)}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="booking-details mb-details">
                      <div className="detail-item mb-detail-item">
                        <span className="detail-label mb-detail-label">Traveler Name</span>
                        <span>{booking.user?.name || user?.name || 'Guest Customer'}</span>
                      </div>
                      <div className="detail-item mb-detail-item">
                        <span className="detail-label mb-detail-label">Travelers Count</span>
                        <span>{booking.guests} Person(s)</span>
                      </div>
                      <div className="detail-item mb-detail-item">
                        <span className="detail-label mb-detail-label">Travel Dates</span>
                        <span>{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'N/A'} — {booking.travelDateEnd ? new Date(booking.travelDateEnd).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="detail-item mb-detail-item">
                        <span className="detail-label mb-detail-label">Contact</span>
                        <span>{booking.user?.email || user?.email || 'N/A'} | {booking.user?.phone || user?.phone || 'N/A'}</span>
                      </div>
                      {booking.comments && (
                        <div className="detail-item mb-detail-item full">
                          <span className="detail-label mb-detail-label">Comments</span>
                          <span>{booking.comments}</span>
                        </div>
                      )}
                    </div>
                    <div className="booking-actions mb-actions">
                      <button className="btn-edit mb-btn-edit" onClick={() => handleEditBooking(booking)}>Edit Booking</button>
                      <button className="btn-delete mb-btn-delete" onClick={() => handleDeleteBooking(booking.id)}>Cancel Booking</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings mb-empty">
            <p>No tour bookings found.</p>
            <button className="btn-primary mb-btn-primary" onClick={() => navigate('/destinations')}>Browse Tours</button>
          </div>
        )}
      </div>

      <style>{`
        .mb-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 110px 24px 80px;
        }

        .mb-header {
          margin-bottom: 28px;
          text-align: center;
        }

        .mb-header h1 {
          font-size: 2.2rem;
          color: #ffffff;
          margin: 0 0 8px 0;
          font-weight: 800;
          text-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        .mb-header p {
          color: rgba(255, 255, 255, 0.88);
          font-size: 1.05rem;
          margin: 0;
          text-shadow: 0 1px 3px rgba(0,0,0,0.35);
        }

        .mb-lookup {
          background: rgba(18, 26, 12, 0.72) !important;
          backdrop-filter: blur(15px);
          padding: 24px 28px !important;
          border-radius: 16px !important;
          margin-bottom: 30px !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
        }

        .mb-lookup h3 {
          font-size: 1.2rem;
          color: #ffffff;
          margin: 0 0 6px 0;
          font-weight: 700;
        }

        .lookup-hint {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.85);
          margin-bottom: 14px;
        }

        .lookup-form {
          display: flex;
          gap: 12px;
        }

        .lookup-form input {
          flex: 1;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.45);
          color: #fff;
          font-size: 0.95rem;
        }

        .lookup-btn {
          padding: 12px 24px;
          background: linear-gradient(145deg, #556B2F, #6B8E23);
          color: white;
          border: 1px solid #A8C55A;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .lookup-btn:hover {
          background: #6B8E23;
        }

        .mb-section h2 {
          font-size: 1.25rem;
          color: #ffffff;
          margin-bottom: 18px;
          font-weight: 700;
          text-shadow: 0 1px 3px rgba(0,0,0,0.35);
        }

        .mb-loading, .mb-empty {
          text-align: center;
          padding: 60px 20px;
          color: #f0f0f0;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(8px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .mb-empty p {
          margin-bottom: 16px;
          font-size: 1.1rem;
        }

        .mb-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mb-card {
          background: white;
          border: 1px solid #ececec;
          border-radius: 14px;
          padding: 24px 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .mb-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .mb-card-header h3 {
          font-size: 1.2rem;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          font-weight: 700;
        }

        .mb-booking-id {
          font-size: 0.82rem;
          color: #777;
          font-family: monospace;
          margin: 0;
        }

        .booking-status-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .status-pending { background: #fff3e0; color: #e65100; }
        .status-confirmed { background: #e8f5e9; color: #2e7d32; }
        .status-cancelled { background: #ffebee; color: #c62828; }

        .mb-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 24px;
          margin-bottom: 18px;
        }

        .mb-detail-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .mb-detail-item.full {
          grid-column: 1 / -1;
        }

        .mb-detail-item span:last-child {
          font-size: 0.95rem;
          color: #333;
          font-weight: 500;
        }

        .mb-detail-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #888;
          font-weight: 700;
        }

        .mb-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .mb-btn-edit, .mb-btn-delete {
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }

        .mb-btn-edit { background: #f0f4e8; color: #556B2F; }
        .mb-btn-edit:hover { background: #e2e9d4; }
        .mb-btn-delete { background: #fdeceb; color: #c62828; }
        .mb-btn-delete:hover { background: #fadbd8; }

        .glass-form input,
        .glass-form textarea,
        .input-group input,
        .input-group textarea {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          background: rgba(0, 0, 0, 0.45) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
        }

        .glass-form label,
        .input-group label {
          color: #ffffff !important;
          font-weight: 600 !important;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
        }

        .mb-btn-primary {
          padding: 11px 26px;
          border-radius: 8px;
          background: #556B2F;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 6px;
          transition: background 0.2s ease;
        }

        .mb-btn-primary:hover { background: #445924; }

        @media (max-width: 600px) {
          .lookup-form {
            flex-direction: column;
          }
          .mb-details, .mb-form-row {
            grid-template-columns: 1fr;
          }
          .mb-actions {
            flex-direction: column;
          }
          .mb-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;