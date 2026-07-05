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
  
  const [activeSection, setActiveSection] = useState('bookings'); // 'bookings' or 'account'
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    numberOfTourists: 1,
    dateFrom: '',
    dateTo: '',
    comments: ''
  });
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
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
      password: '',
      confirmPassword: ''
    });
  }, [user, dispatch, navigate]);

  const handleEditBooking = (booking) => {
    setEditingBooking(booking._id);
    setBookingFormData({
      fullName: booking.fullName,
      phone: booking.phone,
      email: booking.email,
      numberOfTourists: booking.numberOfTourists,
      dateFrom: booking.dateFrom ? booking.dateFrom.split('T')[0] : '',
      dateTo: booking.dateTo ? booking.dateTo.split('T')[0] : '',
      comments: booking.comments || ''
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfTourists' ? Number(value) : value
    }));
  };

  const handleUpdateBooking = async (bookingId) => {
    if (!bookingFormData.fullName || !bookingFormData.phone || !bookingFormData.email || 
        !bookingFormData.dateFrom || !bookingFormData.dateTo) {
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
      const API_URL = import.meta.env.VITE_API_URL || '';
      const baseURL = API_URL || 'http://localhost:8000';
      const token = user.token;
      
      const updateData = {
        name: profileData.name,
        email: profileData.email
      };
      
      if (profileData.password) {
        updateData.password = profileData.password;
      }

      const response = await axios.put(
        `${baseURL}/api/users/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local storage and reload to update auth state
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully!');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: '#ff9800',
      confirmed: '#4caf50',
      cancelled: '#f44336'
    };
    
    return (
      <span 
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          backgroundColor: statusColors[status] + '20',
          color: statusColors[status],
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}
      >
        {status}
      </span>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="my-bookings-container">
      <div className="my-bookings-header">
        <h1>My Account</h1>
        <p>Manage your bookings and account information</p>
      </div>

      <div className="my-bookings-tabs">
        <button
          className={`tab-btn ${activeSection === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveSection('bookings')}
        >
          My Bookings
        </button>
        <button
          className={`tab-btn ${activeSection === 'account' ? 'active' : ''}`}
          onClick={() => setActiveSection('account')}
        >
          Manage Account
        </button>
      </div>

      {activeSection === 'bookings' && (
        <div className="bookings-section">
          <h2>My Bookings</h2>
          {isLoading ? (
            <div className="loading-message">Loading bookings...</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-card-header">
                    <div>
                      <h3>{booking.tour?.name || 'Tour Package'}</h3>
                      <p className="booking-id">Booking ID: #{booking._id.slice(-6)}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {editingBooking === booking._id ? (
                    <div className="booking-edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            name="fullName"
                            value={bookingFormData.fullName}
                            onChange={handleBookingChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={bookingFormData.phone}
                            onChange={handleBookingChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={bookingFormData.email}
                            onChange={handleBookingChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Number of Tourists *</label>
                          <input
                            type="number"
                            name="numberOfTourists"
                            value={bookingFormData.numberOfTourists}
                            onChange={handleBookingChange}
                            min="1"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Date From *</label>
                          <input
                            type="date"
                            name="dateFrom"
                            value={bookingFormData.dateFrom}
                            onChange={handleBookingChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Date To *</label>
                          <input
                            type="date"
                            name="dateTo"
                            value={bookingFormData.dateTo}
                            onChange={handleBookingChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Comments</label>
                        <textarea
                          name="comments"
                          value={bookingFormData.comments}
                          onChange={handleBookingChange}
                          rows="3"
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => setEditingBooking(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-save"
                          onClick={() => handleUpdateBooking(booking._id)}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="booking-details">
                        <div className="detail-item">
                          <span className="detail-label">Travelers:</span>
                          <span>{booking.numberOfTourists} Person(s)</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Travel Dates:</span>
                          <span>
                            {booking.dateFrom ? new Date(booking.dateFrom).toLocaleDateString() : 'N/A'} - 
                            {booking.dateTo ? new Date(booking.dateTo).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Contact:</span>
                          <span>{booking.email} | {booking.phone}</span>
                        </div>
                        {booking.comments && (
                          <div className="detail-item">
                            <span className="detail-label">Comments:</span>
                            <span>{booking.comments}</span>
                          </div>
                        )}
                        {booking.isUpdated && (
                          <div className="update-notification">
                            ⚠️ This booking has been updated. Admin will review changes.
                          </div>
                        )}
                      </div>
                      <div className="booking-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditBooking(booking)}
                        >
                          Edit Booking
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">
              <p>You don't have any bookings yet.</p>
              <button
                className="btn-primary"
                onClick={() => navigate('/destinations')}
              >
                Browse Tours
              </button>
            </div>
          )}
        </div>
      )}

      {activeSection === 'account' && (
        <div className="account-section">
          <h2>Manage Account</h2>
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">New Password (leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={profileData.password}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleProfileChange}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={updatingProfile}
            >
              {updatingProfile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
