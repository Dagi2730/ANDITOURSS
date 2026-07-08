import React, { useState } from 'react';
import api from '../lib/api';

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
          <p>Questions about our Ethiopian adventures? Reach out to us directly and we'll help you plan your perfect trip.</p>
          
          <div className="info-item">
            <div className="icon">📍</div>
            <div>
              <h3>Location</h3>
              <p>Addis Ababa, Ethiopia<br />Bole Road, Friendship Building</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon">📞</div>
            <div>
              <h3>Phone</h3>
              <p>+251 911 000 000</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon">✉️</div>
            <div>
              <h3>Email</h3>
              <p>info@anditours.com</p>
            </div>
          </div>

          <div className="social-links">
            <span className="social-tag">Facebook</span>
            <span className="social-tag">Instagram</span>
            <span className="social-tag">WhatsApp</span>
          </div>
        </div>

        {/* Column 2: Customer Message Form */}
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
                  placeholder="How can we help you?" 
                  rows="5" 
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

      <style>{`
        .contact-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 140px 20px 60px;
        }

        .contact-wrapper {
          display: flex;
          max-width: 1200px;
          width: 100%;
          gap: 60px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .contact-info {
          flex: 1;
          color: white;
          min-width: 320px;
        }

        .contact-info h1 {
          font-size: 3.5rem;
          margin-bottom: 20px;
          color: #C0CA33;
          font-weight: 800;
        }

        .contact-info p {
          font-size: 1.1rem;
          margin-bottom: 45px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
        }

        .info-item {
          display: flex;
          gap: 25px;
          margin-bottom: 35px;
          align-items: center;
        }

        .info-item .icon {
          font-size: 1.4rem;
          background: rgba(255, 255, 255, 0.15);
          width: 55px;
          height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .info-item h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #C0CA33;
          font-weight: 600;
        }

        .info-item p {
          margin: 5px 0 0 0;
          font-size: 1rem;
        }

        .social-links {
          margin-top: 50px;
          display: flex;
          gap: 15px;
        }

        .social-tag {
          cursor: pointer;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 18px;
          border-radius: 30px;
          transition: 0.3s;
          background: rgba(255, 255, 255, 0.05);
        }

        .social-tag:hover {
          background: #C0CA33;
          color: #1a1a1a;
          border-color: #C0CA33;
        }

        .contact-form-container {
          flex: 1;
          min-width: 380px;
        }

        .glass-form {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 50px 40px;
          border-radius: 30px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .glass-form h2 {
          color: white;
          margin-bottom: 35px;
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
        }

        .input-group {
          margin-bottom: 25px;
        }

        .input-group input, 
        .input-group textarea {
          width: 100%;
          padding: 16px;
          background: rgba(0, 0, 0, 0.32);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          outline: none;
          transition: 0.3s;
          caret-color: #ffffff;
          -webkit-text-fill-color: #ffffff;
        }

        .input-group input::placeholder, 
        .input-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.9);
        }

        .input-group input:focus, 
        .input-group textarea:focus {
          border-color: #C0CA33;
          background: rgba(0, 0, 0, 0.4);
        }

        .send-btn {
          width: 100%;
          padding: 16px;
          background: #C0CA33;
          color: #1a1a1a;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          transition: 0.4s;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .send-btn:hover {
          background: #ffffff;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 900px) {
          .contact-wrapper { flex-direction: column; }
          .contact-info h1 { font-size: 2.8rem; }
        }
      `}</style>
    </div>
  );
};

export default Contact;