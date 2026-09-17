import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../lib/api';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

const Contact = () => {
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tourId: '',
    numberOfTourists: 1,
    dateFrom: '',
    dateTo: '',
    comments: ''
  });
  const [passportFile, setPassportFile] = useState(null);
  const [passportPreviewName, setPassportPreviewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await api.get('/tours');
        setTours(res.data || []);
        if (res.data && res.data.length > 0) {
          setFormData(prev => ({ ...prev, tourId: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load tours in contact form:', err);
      }
    };
    fetchTours();
  }, []);

  const handleCopyPhone = (number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(number);
    }
    toast.success(`Copied ${number} to clipboard!`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfTourists' ? Number(value) : value
    }));
  };

  const handlePassportChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Passport copy must be less than 5MB');
      e.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, WebP, or PDF file');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.dateFrom || !formData.dateTo) {
      toast.error('Please fill in all required booking fields');
      return;
    }

    const dFrom = new Date(formData.dateFrom);
    const dTo = new Date(formData.dateTo);
    if (dTo < dFrom) {
      toast.error('Travel End Date cannot be earlier than Travel Start Date');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('tourId', formData.tourId || (tours[0]?.id || ''));
      data.append('numberOfTourists', formData.numberOfTourists);
      data.append('dateFrom', formData.dateFrom);
      data.append('dateTo', formData.dateTo);
      data.append('comments', formData.comments);
      if (passportFile) {
        data.append('passport', passportFile);
      }

      // 1. Submit Booking
      await api.post('/bookings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2. Also Submit Contact Message so request appears in Admin Messages tab
      const selectedTour = tours.find(t => t.id === formData.tourId) || tours[0];
      const tourTitle = selectedTour ? selectedTour.title : 'Tour Package';
      const msgText = `Tour Package: ${tourTitle}\nTourists: ${formData.numberOfTourists}\nTravel Start: ${formData.dateFrom}\nTravel End: ${formData.dateTo}\nPhone: ${formData.phone}\nComments: ${formData.comments || 'No extra comments'}`;

      try {
        await api.post('/messages', {
          name: formData.fullName,
          email: formData.email,
          subject: `Tour Booking Request: ${tourTitle}`,
          message: msgText
        });
      } catch (msgErr) {
        console.warn('Message sync notice:', msgErr);
      }

      // Save email locally for instant "My Bookings" lookup without login
      localStorage.setItem('guestBookingEmail', formData.email.trim());

      toast.success("Tour Booking submitted successfully! Check 'My Bookings' tab to view status.");
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        tourId: tours[0]?.id || '',
        numberOfTourists: 1,
        dateFrom: '',
        dateTo: '',
        comments: ''
      });
      removePassport();
    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit tour booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        
        {/* Column 1: Contact Details */}
        <div className="contact-info">
          <h1>Get in Touch & Book</h1>
          <p className="contact-subtitle">
            Planning your Ethiopian adventure?<br />
            Fill in your tour booking details directly below or reach out to us.
          </p>
          
          <div className="info-item">
            <div className="icon">📍</div>
            <div>
              <h3>Location</h3>
              <p>Addis Ababa, Ethiopia</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon">📞</div>
            <div>
              <h3>Phone (Click to Copy)</h3>
              <p>
                <button
                  type="button"
                  onClick={() => handleCopyPhone('+251 911 661 377')}
                  className="contact-copy-btn"
                  title="Click to copy phone number"
                >
                  +251 911 661 377
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => handleCopyPhone('+251 901 592 929')}
                  className="contact-copy-btn"
                  title="Click to copy phone number"
                >
                  +251 901 592 929
                </button>
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon">✉️</div>
            <div>
              <h3>Email</h3>
              <p><a href="mailto:dobitoursethiopia@gmail.com" className="contact-info-link">dobitoursethiopia@gmail.com</a></p>
            </div>
          </div>
        </div>

        {/* Column 2: Tour Booking Form */}
        <div className="contact-form-container">
          <div className="glass-form">
            <h2>Book Your Tour</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="fullName" 
                  placeholder="Your Full Name" 
                  value={formData.fullName}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email Address" 
                  value={formData.email}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="+251 911 223344" 
                  value={formData.phone}
                  onChange={handleChange} 
                  required 
                />
              </div>

              {tours.length > 0 && (
                <div className="input-group">
                  <label>Select Tour Package *</label>
                  <select
                    name="tourId"
                    value={formData.tourId}
                    onChange={handleChange}
                    className="contact-select"
                    required
                  >
                    {tours.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.duration})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="input-group">
                <label>Number of Tourists *</label>
                <input 
                  type="number" 
                  name="numberOfTourists" 
                  min="1"
                  max="100"
                  value={formData.numberOfTourists}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-row-dual" style={{ display: 'flex', gap: '16px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Start Date *</label>
                  <input 
                    type="date" 
                    name="dateFrom" 
                    min={todayStr}
                    value={formData.dateFrom}
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>End Date *</label>
                  <input 
                    type="date" 
                    name="dateTo" 
                    min={formData.dateFrom || todayStr}
                    value={formData.dateTo}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Passport Copy (Optional)</label>
                {passportPreviewName ? (
                  <div className="passport-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>📄 {passportPreviewName}</span>
                    <button type="button" onClick={removePassport} style={{ background: '#c62828', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
                  </div>
                ) : (
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handlePassportChange}
                    style={{ padding: '10px' }}
                  />
                )}
              </div>

              <div className="input-group">
                <label>Comments / Special Requests</label>
                <textarea 
                  name="comments" 
                  rows="3" 
                  placeholder="Any special requests or details..." 
                  value={formData.comments}
                  onChange={handleChange} 
                ></textarea>
              </div>

              <button type="submit" className="send-btn" disabled={submitting}>
                {submitting ? 'Submitting Booking...' : 'Submit Tour Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <WhatsAppFloatingButton />

      {/* Embedded Styles for Contact Page */}
      <style>{`
        .contact-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 135px 20px 60px !important;
        }

        .contact-wrapper {
          display: flex;
          max-width: 1350px;
          width: 100%;
          gap: 60px;
          align-items: flex-start;
          justify-content: space-between;
        }

        .contact-info {
          flex: 1 1 45%;
          color: white;
          min-width: 320px;
        }

        .contact-info h1 {
          font-size: clamp(1.8rem, 5.5vw, 3.5rem) !important;
          margin-bottom: 20px;
          color: #ffffff;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .contact-subtitle {
          font-size: 1.1rem;
          margin-bottom: 45px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.95);
        }

        .info-item {
          display: flex;
          gap: 25px;
          margin-bottom: 35px;
          align-items: center;
        }

        .info-item .icon {
          font-size: 1.4rem;
          background: rgba(85, 107, 47, 0.25);
          width: 55px;
          height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 15px;
          border: 1px solid rgba(168, 197, 90, 0.4);
        }

        .info-item h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #A8C55A;
          font-weight: 600;
        }

        .info-item p {
          margin: 5px 0 0 0;
          font-size: 1rem;
        }

        .contact-form-container {
          flex: 0 0 52%;
          width: 52%;
          min-width: 380px;
        }

        .contact-form-container .glass-form {
          width: 100%;
          background: rgba(18, 26, 12, 0.78);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 42px 38px;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
          margin: 0;
        }

        .contact-form-container .glass-form h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 24px;
          text-align: left;
        }

        .contact-form-container .input-group {
          margin-bottom: 18px;
          text-align: left;
        }

        .contact-form-container .input-group label {
          display: block;
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .contact-form-container .input-group input, 
        .contact-form-container .input-group textarea,
        .contact-select {
          width: 100%;
          padding: 14px 18px;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s ease;
        }

        .contact-select option {
          background: #1f2913;
          color: #ffffff;
        }

        .contact-form-container .input-group input:focus, 
        .contact-form-container .input-group textarea:focus,
        .contact-select:focus {
          border-color: #A8C55A;
          background: rgba(0, 0, 0, 0.65);
          box-shadow: 0 0 0 4px rgba(168, 197, 90, 0.25);
        }

        .contact-form-container .send-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(145deg, #556B2F, #6B8E23);
          color: #ffffff;
          border: 1px solid #A8C55A;
          border-radius: 50px;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .contact-form-container .send-btn:hover {
          background: #6B8E23;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(107, 142, 35, 0.4);
        }

        @media (max-width: 1024px) {
          .contact-wrapper {
            flex-direction: column;
            gap: 40px;
          }
          .contact-info, .contact-form-container {
            width: 100%;
            flex: 1 1 100%;
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;