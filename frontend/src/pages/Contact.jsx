import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../lib/api';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

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
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const fullMessage = formData.phone
        ? `${formData.message}\n\nPhone Number: ${formData.phone}`
        : formData.message;

      await api.post('/messages', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: fullMessage
      });

      toast.success('Thank you! Your message has been sent to Andi Tours. We will respond shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        
        {/* Column 1: Contact Details */}
        <div className="contact-info">
          <h1>Get in Touch</h1>
          <p className="contact-subtitle">
            Have questions about our Ethiopian tours or need a custom travel itinerary?<br />
            Send us a message below or reach out directly to our team.
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

        {/* Column 2: Send Message Form */}
        <div className="contact-form-container">
          <div className="glass-form">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Full Name" 
                  value={formData.name}
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
                <label>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="+251 911 223344" 
                  value={formData.phone}
                  onChange={handleChange} 
                />
              </div>

              <div className="input-group">
                <label>Subject *</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="What is your message about?" 
                  value={formData.subject}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <label>Your Message *</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  placeholder="Write your message or inquiry here..." 
                  value={formData.message}
                  onChange={handleChange} 
                  required
                ></textarea>
              </div>

              <button type="submit" className="send-btn" disabled={submitting}>
                {submitting ? 'Sending Message...' : 'Send Message'}
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
        .contact-form-container .input-group textarea {
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

        .contact-form-container .input-group input:focus, 
        .contact-form-container .input-group textarea:focus {
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

        .contact-copy-btn {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .contact-copy-btn:hover {
          color: #A8C55A;
        }

        .contact-info-link {
          color: #ffffff;
          text-decoration: underline;
        }

        .contact-info-link:hover {
          color: #A8C55A;
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