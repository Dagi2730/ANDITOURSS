import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-compact">
        <div className="footer-info">
          <span className="footer-brand">ANDI TOURS</span>
          <span className="footer-separator">·</span>
          <span>📍 Addis Ababa, Ethiopia</span>
          <span className="footer-separator">·</span>
          <span>📞 <a href="tel:+251911661377" className="footer-contact-link">+251 911 661 377</a></span>
          <span className="footer-separator">·</span>
          <span>✉️ <a href="mailto:dobitoursethiopia@gmail.com" className="footer-contact-link">dobitoursethiopia@gmail.com</a></span>
        </div>
        <div className="credit">
          Created by{' '}
          <a
            href="https://dagmawit-andargachew.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="credit-link"
          >
            Dagmawit Andargachew
          </a>{' '}
          | All rights reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;