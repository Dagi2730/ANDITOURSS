import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleStartExploring = () => {
    // Navigates the user to the destinations route
    navigate('/destinations');
  };

  return (
    <section className="home-hero">
      <h1>
        Discover the Beauty of <span>Ethiopia</span>
      </h1>

      <p className="hero-subtitle">
        Explore ancient history, stunning landscapes, and vibrant culture with us.
      </p>

      <button 
        className="hero-btn" 
        onClick={handleStartExploring}
      >
        Start Exploring
      </button>
    </section>
  );
}

export default Home;