import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourItem = ({ tour, onSelect }) => {
  const navigate = useNavigate();

  // Hide if inactive
  if (tour.status === 'inactive' || tour.status === 'Inactive') {
    return null;
  }

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const imageUrl = getImageUrl(tour.imageUrl);

  const handleOpenDetails = (e) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(tour);
    } else {
      navigate(`/tour/${tour.id || tour._id}`);
    }
  };

  return (
    <div className="tour-card" onClick={handleOpenDetails} style={{ cursor: 'pointer', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <div className="tour-image" style={{ height: '210px', overflow: 'hidden' }}>
        <img 
          src={imageUrl} 
          alt={tour.title || tour.name || 'Tour Image'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      <div className="tour-info" style={{ padding: '20px', color: '#1a1a1a', background: '#ffffff' }}>
        <h3 onClick={handleOpenDetails} style={{ color: '#0f172a', WebkitTextFillColor: '#0f172a', fontWeight: '800', fontSize: '1.2rem', margin: '0 0 10px 0', cursor: 'pointer' }}>
          {tour.title || tour.name}
        </h3>
        <p className="description" style={{ color: '#334155', WebkitTextFillColor: '#334155', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 16px 0', fontWeight: '500' }}>
          {tour.description ? (tour.description.length > 105 ? tour.description.substring(0, 105) + '...' : tour.description) : 'No description provided.'}
        </p>
        <div className="tour-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
          <span className="duration" style={{ color: '#1e293b', WebkitTextFillColor: '#1e293b', fontWeight: '700', fontSize: '0.9rem' }}>
            ⏱ {tour.duration}
          </span>
          <button type="button" onClick={handleOpenDetails} className="details-btn" style={{ background: '#556B2F', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourItem;