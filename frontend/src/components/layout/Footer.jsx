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
          <span>📞 +251 911 661 377</span>
          <span className="footer-separator">·</span>
          <span>✉️ dobitoursethiopia@gmail.com</span>
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