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
    <div className="tour-card" onClick={handleOpenDetails} style={{ cursor: 'pointer' }}>
      <div className="tour-image">
        <img 
          src={imageUrl} 
          alt={tour.title || tour.name || 'Tour Image'} 
        />
      </div>
      
      <div className="tour-info">
        <h3 onClick={handleOpenDetails}>{tour.title || tour.name}</h3>
        <p className="description">
          {tour.description ? tour.description.substring(0, 105) + '...' : 'No description provided.'}
        </p>
        <div className="tour-footer">
          <span className="duration">⏱ {tour.duration}</span>
          <button type="button" onClick={handleOpenDetails} className="details-btn">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourItem;