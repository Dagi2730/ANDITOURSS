import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const PHONE_NUMBER = '251911661377';
const DEFAULT_MESSAGE = "Hello! I'd like to inquire about an itinerary with Andi Tours. Could you help me plan my trip to Ethiopia?";

function WhatsAppFloatingButton() {
  const [hovered, setHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FaWhatsapp className="whatsapp-icon" />
        {hovered && <span className="whatsapp-tooltip">Chat with us!</span>}
      </a>

      <style>{`
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          z-index: 9999;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: whatsappPulse 2s ease-in-out infinite;
        }

        .whatsapp-float:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
          animation: none;
        }

        .whatsapp-icon {
          color: white;
          font-size: 2rem;
        }

        .whatsapp-tooltip {
          position: absolute;
          right: 72px;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          animation: fadeIn 0.2s ease;
          font-family: 'Raleway', sans-serif;
        }

        .whatsapp-tooltip::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: rgba(0, 0, 0, 0.85);
        }

        @keyframes whatsappPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
          50% { box-shadow: 0 4px 30px rgba(37, 211, 102, 0.7); }
        }

        @media print {
          .whatsapp-float { display: none !important; }
        }

        @media (max-width: 480px) {
          .whatsapp-float {
            bottom: 20px;
            right: 20px;
            width: 52px;
            height: 52px;
          }
          .whatsapp-icon { font-size: 1.7rem; }
        }
      `}</style>
    </>
  );
}

export default WhatsAppFloatingButton;
