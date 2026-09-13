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
        const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
        const response = await axios.get(`${baseURL}/api/tours`);
        setTours(response.data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const filteredTours = tours.filter((tour) =>
    tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="destinations-container">
      {/* HEADER & SEARCH */}
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

      {/* TOURS GRID */}
      <div className="destinations-grid">
        {loading ? (
          <div className="loading-placeholder">
            <p>Connecting to backend...</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="loading-placeholder">
            <p>No tours found matching your search.</p>
          </div>
        ) : (
          filteredTours.map((tour) => (
            <TourItem key={tour.id || tour._id} tour={tour} />
          ))
        )}
      </div>

      <style>{`
        .destinations-container {
          min-height: 100vh;
          width: 100%;
          max-width: 100%;
          padding: 0 16px 40px;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .destinations-hero-transparent {
          text-align: center;
          padding: 150px 10px 30px !important;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .hero-title-white {
          font-size: clamp(1.8rem, 5.5vw, 3.2rem);
          line-height: 1.25;
          color: #ffffff !important;
          margin: 0 auto 20px;
          font-weight: 800;
          text-shadow: 0 4px 12px rgba(0,0,0,0.4);
          word-break: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }

        .search-bar {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .search-bar input {
          width: 100%;
          max-width: 100%;
          padding: 14px 22px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          color: #ffffff !important;
          font-size: 1rem;
          font-weight: 700;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
          caret-color: #ffffff;
          -webkit-text-fill-color: #ffffff;
        }

        .search-bar input::placeholder {
          color: rgba(255,255,255,0.85);
          -webkit-text-fill-color: rgba(255,255,255,0.85);
          font-weight: 500;
        }

        .search-bar input:focus {
          background: rgba(255,255,255,0.3);
          border-color: #C0CA33;
          box-shadow: 0 0 15px rgba(192, 202, 51, 0.3);
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
          max-width: 1200px;
          width: 100%;
          margin: 30px auto;
          box-sizing: border-box;
        }

        .loading-placeholder {
          grid-column: 1 / -1;
          text-align: center;
          color: rgba(255,255,255,0.85);
          font-size: 1.1rem;
          font-weight: 600;
          padding: 60px 20px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 600px) {
          .destinations-hero-transparent {
            padding: 135px 8px 20px !important;
          }

          .destinations-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            margin: 20px auto;
          }

          .hero-title-white {
            font-size: clamp(1.6rem, 7vw, 2.2rem);
            margin-bottom: 15px;
          }

          .search-bar input {
            padding: 12px 18px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationsPage;