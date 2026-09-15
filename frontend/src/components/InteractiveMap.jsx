import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DESTINATIONS_MAP = [
  {
    id: 'lalibela',
    name: 'Lalibela',
    region: 'Amhara Region',
    coords: { top: '38%', left: '52%' },
    tagline: 'World-famous 12th-century Rock-Hewn Churches',
    description: 'Explore eleven ancient monolithic rock churches carved directly into pink volcanic tuff.',
    recommendedHotels: ['Maribela Hotel', 'Mezena Lodge', 'Roha Hotel'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    tourLink: '/destinations'
  },
  {
    id: 'simien',
    name: 'Simien Mountains',
    region: 'Gondar & North',
    coords: { top: '24%', left: '44%' },
    tagline: 'Dramatic peaks, deep valleys & Gelada baboons',
    description: 'A UNESCO World Heritage national park featuring Ras Dashen peak and endemic Ethiopian wildlife.',
    recommendedHotels: ['Limalimo Lodge', 'Simien Lodge', 'Goha Hotel Gondar'],
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    tourLink: '/destinations'
  },
  {
    id: 'danakil',
    name: 'Danakil Depression',
    region: 'Afar Region',
    coords: { top: '28%', left: '68%' },
    tagline: 'Vibrant hydrothermal sulfur springs & Erta Ale lava lake',
    description: 'One of the lowest and hottest places on Earth, renowned for Dallol neon sulfur pools and active volcanism.',
    recommendedHotels: ['Kuriftu Resort Semera', 'Erta Ale Eco Camp', 'Planet Hotel Mekele'],
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tourLink: '/destinations'
  },
  {
    id: 'gondar',
    name: 'Gondar',
    region: 'Amhara Region',
    coords: { top: '28%', left: '38%' },
    tagline: 'The Camelot of Africa — 17th Century Castles',
    description: 'Ancient royal capital featuring Fasil Ghebbi fortress compound and Debre Berhan Selassie church.',
    recommendedHotels: ['Goha Hotel', 'Haile Resort Gondar', 'Florida International Hotel'],
    image: 'https://images.unsplash.com/photo-1523805081446-ed9a7bb84eaa?auto=format&fit=crop&w=800&q=80',
    tourLink: '/destinations'
  },
  {
    id: 'omo',
    name: 'Omo Valley',
    region: 'Southern Nations',
    coords: { top: '78%', left: '32%' },
    tagline: 'Cultural heritage trails & indigenous tribes',
    description: 'Home to the Mursi, Hamer, and Karo tribes with ancient traditions in the lush Omo basin.',
    recommendedHotels: ['Buska Lodge Turmi', 'Paradise Lodge Arba Minch', 'Haile Resort Arba Minch'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    tourLink: '/destinations'
  }
];

function InteractiveMap() {
  const [activePin, setActivePin] = useState(DESTINATIONS_MAP[0]);

  return (
    <div className="interactive-map-section">
      <div className="map-header">
        <span className="section-eyebrow">Explore Ethiopia</span>
        <h2 className="section-title-light">Interactive Circuit Map &amp; Destinations</h2>
        <p className="section-subtitle-light">
          Click any destination pin to discover key highlights, tour routes, and recommended regional accommodations.
        </p>
      </div>

      <div className="map-container-grid">
        {/* Visual Map Canvas */}
        <div className="map-visual-box">
          <div className="map-svg-background">
            <div className="ethiopia-shape-overlay" />
            {DESTINATIONS_MAP.map((dest) => (
              <button
                key={dest.id}
                type="button"
                className={`map-pin ${activePin.id === dest.id ? 'active' : ''}`}
                style={{ top: dest.coords.top, left: dest.coords.left }}
                onClick={() => setActivePin(dest)}
                aria-label={`Select ${dest.name}`}
              >
                <span className="pin-pulse" />
                <span className="pin-icon">📍</span>
                <span className="pin-label">{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Destination Card Panel */}
        <div className="map-info-card">
          <div className="info-card-image-box">
            <img src={activePin.image} alt={activePin.name} className="info-card-img" />
            <span className="info-card-badge">{activePin.region}</span>
          </div>

          <div className="info-card-body">
            <h3>{activePin.name}</h3>
            <p className="info-card-tagline">{activePin.tagline}</p>
            <p className="info-card-desc">{activePin.description}</p>

            <div className="info-hotels-box">
              <strong>🏨 Recommended Regional Lodges:</strong>
              <ul>
                {activePin.recommendedHotels.map((hotel, idx) => (
                  <li key={idx}>✓ {hotel}</li>
                ))}
              </ul>
            </div>

            <Link to="/destinations" className="map-card-btn">
              Explore {activePin.name} Packages →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .interactive-map-section {
          padding: 60px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .map-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-eyebrow {
          display: inline-block;
          padding: 6px 18px;
          border-radius: 20px;
          background: rgba(85, 107, 47, 0.25);
          color: #a8c55a;
          border: 1px solid rgba(168, 197, 90, 0.4);
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .section-title-light {
          font-size: clamp(2rem, 4vw, 2.8rem);
          color: #ffffff !important;
          margin: 0 0 14px;
          font-weight: 800;
          text-shadow: 0 2px 10px rgba(0,0,0,0.6);
        }

        .section-subtitle-light {
          color: #cbd5e1 !important;
          font-size: 1.1rem;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 500;
        }

        .map-container-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 30px;
          align-items: center;
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid #e2e8f0;
        }

        .map-visual-box {
          position: relative;
          min-height: 420px;
          background: linear-gradient(135deg, #2b2a25 0%, #1e293b 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
        }

        .map-svg-background {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 420px;
        }

        .ethiopia-shape-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 45%, rgba(85, 107, 47, 0.35) 0%, transparent 70%);
        }

        .map-pin {
          position: absolute;
          background: transparent;
          border: none;
          cursor: pointer;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 10;
          transition: transform 0.2s ease;
        }

        .map-pin:hover {
          transform: translate(-50%, -50%) scale(1.15);
        }

        .pin-icon {
          font-size: 1.5rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
        }

        .pin-label {
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .map-pin.active .pin-label {
          background: #556B2F;
          color: #ffffff;
          border-color: #a8c55a;
          box-shadow: 0 0 12px rgba(85, 107, 47, 0.6);
        }

        .pin-pulse {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(168, 197, 90, 0.7);
          animation: mapPulse 2s infinite;
          left: 6px;
        }

        @keyframes mapPulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .map-info-card {
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #cbd5e1;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        }

        .info-card-image-box {
          position: relative;
          height: 180px;
        }

        .info-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info-card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #556B2F;
          color: #ffffff;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .info-card-body {
          padding: 20px;
        }

        .info-card-body h3 {
          margin: 0 0 6px;
          font-size: 1.4rem;
          color: #0f172a;
          font-weight: 800;
        }

        .info-card-tagline {
          color: #556B2F;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .info-card-desc {
          color: #334155;
          font-size: 0.92rem;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .info-hotels-box {
          background: #ffffff;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          margin-bottom: 18px;
        }

        .info-hotels-box strong {
          color: #1e293b;
          font-size: 0.88rem;
          display: block;
          margin-bottom: 6px;
        }

        .info-hotels-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-hotels-box li {
          font-size: 0.85rem;
          color: #475569;
          font-weight: 500;
        }

        .map-card-btn {
          display: block;
          text-align: center;
          background: linear-gradient(145deg, #556B2F, #6B8E23);
          color: #ffffff;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .map-card-btn:hover {
          background: linear-gradient(145deg, #6B8E23, #556B2F);
          transform: translateY(-2px);
        }

        @media (max-width: 850px) {
          .map-container-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default InteractiveMap;
