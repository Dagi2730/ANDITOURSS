// frontend/src/components/TourList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API calls

const TourList = () => {
    // 1. State to hold the array of tours
    const [tours, setTours] = useState([]);
    // 2. State to handle loading status
    const [loading, setLoading] = useState(true);
    // 3. State to handle any errors
    const [error, setError] = useState(null);

    // useEffect runs once after the component mounts
    useEffect(() => {
        const fetchTours = async () => {
            try {
                // The proxy in vite.config.js directs this to http://localhost:8000/api/tours
                const response = await axios.get('/api/tours'); 
                
                // If the backend returns [], response.data will be []
                setTours(response.data); 
                setLoading(false);      
            } catch (err) {
                // Catches network errors or bad response codes (4xx, 5xx)
                console.error(err);
                setError('Failed to fetch tours. Check your backend server is running on port 8000.');
                setLoading(false);
            }
        };

        fetchTours();
    }, []); // Runs only once

    // --- Rendering Logic ---

    if (loading) {
        return <div className="loading">Loading Tours...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }
    
    // Defensive check: Must be an array, AND must have data to map over.
    if (!Array.isArray(tours) || tours.length === 0) { 
        return (
            <div className="no-tours">
                <h1>ANDI TOURS Available Trips</h1>
                <h2>No Tours Found</h2>
                <p>The database is currently empty. Try creating one using POST /api/tours in Postman!</p>
            </div>
        );
    }

    // This block only runs if tours is confirmed to be a non-empty array
    return (
        <div className="tour-list">
            <h1>ANDI TOURS Available Trips</h1>
            <div className="tours-grid">
                {tours.map(tour => (
                    <div key={tour._id} className="tour-card">
                        <h2>{tour.title}</h2>
                        <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <p>{tour.description.substring(0, 100)}...</p>
                        <p><strong>Duration:</strong> {tour.duration}</p>
                        <p className="price"><strong>Price:</strong> ${tour.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TourList;