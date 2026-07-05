import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourItem from '../components/TourItem';
import '../styles/Destinations.css';

const DestinationsPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const baseURL = 'http://localhost:8000';
        const response = await axios.get(`${baseURL}/api/tours/active`);
        setTours(response.data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const filteredTours = tours.filter(tour =>
    tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="destinations-container">
      {/* HEADER & SEARCH: Appears instantly */}
      <div className="destinations-hero-transparent">
        <h1 className="hero-title-white">Find Your Next Adventure</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by destination..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TOURS GRID: Cleaned to remove the "No Tours Found" box */}
      <div className="destinations-grid">
        {loading ? (
          <div className="loading-placeholder">
            <p>Connecting...</p>
          </div>
        ) : (
          filteredTours.map(tour => (
            <TourItem key={tour._id} tour={tour} />
          ))
        )}
      </div>

      <style>{`
        .destinations-container {
          min-height: 100vh;
          padding: 20px;
        }

        .destinations-hero-transparent {
          text-align: center;
          padding: 80px 20px 40px;
        }

        .hero-title-white {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 25px;
          font-weight: 800;
          text-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .search-bar input {
          width: 100%;
          max-width: 550px;
          padding: 16px 25px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          color: white;
          font-size: 1.1rem;
          outline: none;
          transition: 0.3s;
        }

        .search-bar input::placeholder {
          color: rgba(255,255,255,0.9);
        }

        .search-bar input:focus {
          background: rgba(255,255,255,0.25);
          border-color: #C0CA33;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 35px;
          max-width: 1300px;
          margin: 40px auto;
        }

        .loading-placeholder {
          grid-column: 1 / -1;
          text-align: center;
          color: rgba(255,255,255,0.6);
          font-size: 1.2rem;
          padding: 100px;
        }
      `}</style>
    </div>
  );
};

export default DestinationsPage;