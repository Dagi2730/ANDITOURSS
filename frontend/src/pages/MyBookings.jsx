import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, updateBooking, deleteBooking } from '../features/booking/bookingSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/MyBookings.css';

const MyBookings = () => {
  const { user } = useSelector((state) => state.auth);
  const { bookings, isLoading } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('bookings');
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    guests: 1,
    travelDate: '',
    travelDateEnd: '',
    comments: ''
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getMyBookings());
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: ''
    });
  }, [user, dispatch, navigate]);

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
      dispatch(getMyBookings());
    } catch (error) {
      toast.error(error || 'Failed to update booking');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(deleteBooking(bookingId)).unwrap();
        toast.success('Booking cancelled successfully');
        dispatch(getMyBookings());
      } catch (error) {
        toast.error(error || 'Failed to cancel booking');
      }
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setUpdatingProfile(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = user?.token;

      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      };

      if (profileData.password) {
        updateData.password = profileData.password;
      }

      const response = await axios.put(`${API_URL}/api/users/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...storedUser,
        ...response.data,
        token: storedUser.token || token,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error.response);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`booking-status-badge status-${status?.toLowerCase()}`}>
        {status}
      </span>
    );
  };

  if (!user) return null;

  return (
    <div className="my-bookings-container mb-page">
      <div className="my-bookings-header mb-header">
        <h1>My Account</h1>
        <p>Manage your bookings and account information</p>
      </div>

      <div className="my-bookings-tabs mb-tabs">
        <button
          className={`tab-btn mb-tab ${activeSection === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveSection('bookings')}
        >
          My Bookings
        </button>
        <button
          className={`tab-btn mb-tab ${activeSection === 'account' ? 'active' : ''}`}
          onClick={() => setActiveSection('account')}
        >
          Manage Account
        </button>
      </div>

      {activeSection === 'bookings' && (
        <div className="bookings-section mb-section">
          <h2>My Bookings</h2>
          {isLoading ? (
            <div className="loading-message mb-loading">Loading bookings...</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="bookings-list mb-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card mb-card">
                  <div className="booking-card-header mb-card-header">
                    <div>
                      <h3>{booking.tour?.title || 'Tour Package'}</h3>
                      <p className="booking-id mb-booking-id">Booking ID: #{booking.id.slice(-6)}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {editingBooking === booking.id ? (
                    <div className="booking-edit-form mb-edit-form">
                      <div className="form-row mb-form-row">
                        <div className="form-group mb-form-group">
                          <label>Number of Tourists *</label>
                          <input type="number" name="guests" value={bookingFormData.guests} onChange={handleBookingChange} min="1" required />
                        </div>
                      </div>
                      <div className="form-row mb-form-row">
                        <div className="form-group mb-form-group">
                          <label>Date From *</label>
                          <input type="date" name="travelDate" value={bookingFormData.travelDate} onChange={handleBookingChange} required />
                        </div>
                        <div className="form-group mb-form-group">
                          <label>Date To *</label>
                          <input type="date" name="travelDateEnd" value={bookingFormData.travelDateEnd} onChange={handleBookingChange} required />
                        </div>
                      </div>
                      <div className="form-group mb-form-group">
                        <label>Comments</label>
                        <textarea name="comments" value={bookingFormData.comments} onChange={handleBookingChange} rows="3" />
                      </div>
                      <div className="form-actions mb-form-actions">
                        <button className="btn-cancel mb-btn-cancel" onClick={() => setEditingBooking(null)}>Cancel</button>
                        <button className="btn-save mb-btn-save" onClick={() => handleUpdateBooking(booking.id)}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="booking-details mb-details">
                        <div className="detail-item mb-detail-item">
                          <span className="detail-label mb-detail-label">Travelers</span>
                          <span>{booking.guests} Person(s)</span>
                        </div>
                        <div className="detail-item mb-detail-item">
                          <span className="detail-label mb-detail-label">Travel Dates</span>
                          <span>{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'N/A'} — {booking.travelDateEnd ? new Date(booking.travelDateEnd).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="detail-item mb-detail-item">
                          <span className="detail-label mb-detail-label">Contact</span>
                          <span>{user.email} | {user.phone || 'N/A'}</span>
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
              <p>You don't have any bookings yet.</p>
              <button className="btn-primary mb-btn-primary" onClick={() => navigate('/destinations')}>Browse Tours</button>
            </div>
          )}
        </div>
      )}

      {activeSection === 'account' && (
        <div className="account-section mb-section">
          <h2>Manage Account</h2>
          <form className="profile-form mb-profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group mb-form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" value={profileData.name} onChange={handleProfileChange} required />
            </div>
            <div className="form-group mb-form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} required />
            </div>
            <div className="form-group mb-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleProfileChange} placeholder="Enter phone number" />
            </div>
            <div className="form-group mb-form-group">
              <label htmlFor="password">New Password (leave blank to keep current)</label>
              <input type="password" id="password" name="password" value={profileData.password} onChange={handleProfileChange} />
            </div>
            <div className="form-group mb-form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={profileData.confirmPassword} onChange={handleProfileChange} />
            </div>
            <button type="submit" className="btn-primary mb-btn-primary" disabled={updatingProfile}>
              {updatingProfile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .mb-page { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
        .mb-header h1 { font-size: 1.8rem; color: #2b2b1f; margin: 0 0 6px 0; }
        .mb-header p { color: #777; font-size: 0.95rem; margin: 0 0 28px 0; }
        .mb-tabs { display: flex; gap: 8px; border-bottom: 1px solid #e5e5e0; margin-bottom: 28px; }
        .mb-tab { padding: 10px 20px; background: none; border: none; border-bottom: 2px solid transparent; font-size: 0.95rem; font-weight: 500; color: #888; cursor: pointer; transition: all 0.15s ease; }
        .mb-tab.active { color: #556B2F; border-bottom-color: #556B2F; }
        .mb-tab:hover { color: #556B2F; }
        .mb-section h2 { font-size: 1.15rem; color: #333; margin-bottom: 18px; }
        .mb-loading, .mb-empty { text-align: center; padding: 60px 20px; color: #888; }
        .mb-list { display: flex; flex-direction: column; gap: 18px; }
        .mb-card { background: white; border: 1px solid #ececec; border-radius: 14px; padding: 22px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .mb-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; }
        .booking-status-badge { padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .status-pending { background: #fff3e0; color: #e65100; }
        .status-confirmed { background: #e8f5e9; color: #2e7d32; }
        .status-cancelled { background: #ffebee; color: #c62828; }
        .mb-details { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; margin-bottom: 18px; }
        .mb-detail-label { font-size: 0.75rem; text-transform: uppercase; color: #999; font-weight: 600; }
        .mb-actions { display: flex; gap: 10px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
        .mb-btn-edit, .mb-btn-delete { padding: 9px 18px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; border: none; }
        .mb-btn-edit { background: #f0f4e8; color: #556B2F; }
        .mb-btn-delete { background: #fdeceb; color: #c62828; }
        .mb-edit-form { background: #fafaf8; border-radius: 10px; padding: 18px; }
        .mb-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
        .mb-form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .mb-form-group label { font-size: 0.82rem; font-weight: 600; color: #555; }
        .mb-form-group input, .mb-form-group textarea { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; }
        .mb-form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
        .mb-btn-save { padding: 9px 18px; border-radius: 8px; background: #556B2F; color: white; border: none; cursor: pointer; }
        .mb-btn-cancel { padding: 9px 18px; border-radius: 8px; background: #f0f0f0; color: #555; border: none; cursor: pointer; }
        .mb-profile-form { background: white; border: 1px solid #ececec; border-radius: 14px; padding: 28px; max-width: 480px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .mb-btn-primary { padding: 11px 26px; border-radius: 8px; background: #556B2F; color: white; border: none; cursor: pointer; }
        @media (max-width: 600px) { .mb-details, .mb-form-row { grid-template-columns: 1fr; } .mb-actions { flex-direction: column; } }
      `}</style>
    </div>
  );
};

export default MyBookings;