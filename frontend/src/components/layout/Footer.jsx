import React from 'react';
import { toast } from 'react-toastify';

function Footer() {
  const handleCopyPhone = (number, e) => {
    if (e) e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(number);
    }
    toast.success(`Copied ${number} to clipboard!`);
  };

  return (
    <footer className="footer">
      <div className="footer-compact">
        <div className="footer-info">
          <span className="footer-brand">ANDI TOURS</span>
          <span className="footer-separator">·</span>
          <span>📍 Addis Ababa, Ethiopia</span>
          <span className="footer-separator">·</span>
          <span>
            📞{' '}
            <button
              type="button"
              onClick={(e) => handleCopyPhone('+251 911 661 377', e)}
              className="footer-contact-copy-btn"
              title="Click to copy phone number"
            >
              +251 911 661 377
            </button>
          </span>
          <span className="footer-separator">·</span>
          <span>
            ✉️{' '}
            <a href="mailto:dobitoursethiopia@gmail.com" className="footer-contact-link">
              dobitoursethiopia@gmail.com
            </a>
          </span>
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