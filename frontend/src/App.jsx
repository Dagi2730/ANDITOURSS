import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DestinationsPage from './pages/DestinationsPage';
import TourDetail from './pages/TourDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// User Portal Pages
import MyBookings from './pages/MyBookings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import Protected from './components/Protected';

// Styling
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout routes */}
        <Route path="/*" element={
          <div className="main-wrapper">
            <Navbar />
            <div className="content-area">
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/tour/:id" element={<TourDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* --- User Portal Routes --- */}
                <Route path="/my-bookings" element={<MyBookings />} />
              </Routes>
            </div>
            <Footer />
          </div>
        } />
        
        {/* Admin Route - Full Screen Layout */}
        <Route
          path="/admin/*"
          element={
            <Protected>
              <div className="admin-layout-wrapper">
                <AdminDashboard />
              </div>
            </Protected>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;