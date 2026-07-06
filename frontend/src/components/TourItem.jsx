import React from 'react';
import { Link } from 'react-router-dom';

const TourItem = ({ tour }) => {
  // Define the backend base URL for images
  const API_URL = import.meta.env.VITE_API_URL || '';
  const PF = API_URL || "http://localhost:8000";

  // Hide if inactive
  if (tour.status === 'inactive' || tour.status === 'Inactive') {
    return null;
  }

  return (
    <div className="tour-card">
      <div className="tour-image">
        {/* Check if the image is a full URL (like from Unsplash) 
            or a local path (from your /uploads folder)
        */}
        <img 
          src={
            tour.imageUrl 
              ? (tour.imageUrl.startsWith('http') ? tour.imageUrl : PF + tour.imageUrl) 
              : 'https://via.placeholder.com/400x250?text=Adventure+Awaits'
          } 
          alt={tour.title || tour.name || 'Tour Image'} 
        />
        <div className="tour-price">${tour.price}</div>
      </div>
      
      <div className="tour-info">
        <h3>{tour.title || tour.name}</h3>
        <p className="description">
          {tour.description ? tour.description.substring(0, 100) + '...' : 'No description provided.'}
        </p>
        <div className="tour-footer">
          <span className="duration">⏱ {tour.duration}</span>
          <Link to={`/tour/${tour.id || tour._id}`} className="details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourItem;