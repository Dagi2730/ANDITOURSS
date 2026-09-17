import React, { useState } from 'react';
import api from '../lib/api';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/messages', formData);
      alert("Message sent! Andi Tours will get back to you shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message. Please try again.');
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
            Questions about our Ethiopian adventures?<br />
            Reach out to us directly and we'll help you plan your perfect trip.
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
              <h3>Phone</h3>
              <p>+251 911 661377</p>
              <p>+251 901 592929</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon">✉️</div>
            <div>
              <h3>Email</h3>
              <p>dobitoursethiopia@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Column 2: Customer Message Form (Covering ~45% width) */}
        <div className="contact-form-container">
          <div className="glass-form">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
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
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Subject" 
                  value={formData.subject}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <textarea 
                  name="message" 
                  rows="5" 
                  placeholder="Your Message..." 
                  value={formData.message}
                  onChange={handleChange} 
                  required
                ></textarea>
              </div>
              <button type="submit" className="send-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
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
          padding: 145px 20px 60px !important;
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
          flex: 1 1 50%;
          color: white;
          min-width: 320px;
        }

        .contact-info h1 {
          font-size: clamp(1.8rem, 5.5vw, 3.8rem) !important;
          margin-bottom: 20px;
          color: #ffffff;
          font-weight: 800;
          letter-spacing: -0.5px;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .contact-subtitle {
          font-size: 1.15rem;
          margin-bottom: 45px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 400;
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

        /* 45% Width Contact Form Container */
        .contact-form-container {
          flex: 0 0 45%;
          width: 45%;
          min-width: 380px;
        }

        .contact-form-container .glass-form {
          width: 100%;
          background: rgba(18, 26, 12, 0.72);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 48px 42px;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
          margin: 0;
        }

        .contact-form-container .glass-form h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 30px;
          text-align: left;
        }

        .contact-form-container .input-group {
          margin-bottom: 22px;
          text-align: left;
        }

        .contact-form-container .input-group input, 
        .contact-form-container .input-group textarea {
          width: 100%;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 14px;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s ease;
        }

        .contact-form-container .input-group input::placeholder, 
        .contact-form-container .input-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
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
          background: #d4e137;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(192, 202, 51, 0.4);
        }

        .contact-form-container .send-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .contact-wrapper {
            flex-direction: column;
            gap: 50px;
          }
          .contact-info {
            width: 100%;
          }
          .contact-form-container {
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