import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DestinationsPage from './pages/DestinationsPage';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import TourDetail from './pages/TourDetail';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import ReviewsRecommendationsPage from './pages/ReviewsRecommendationsPage';
import Protected from './components/Protected';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import FAQAssistant from './components/FAQAssistant';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <FAQAssistant />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="main-wrapper">
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Protected adminOnly={true}>
                <AdminDashboard />
              </Protected>
            }
          />

          <Route path="/*" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="contact" element={<Contact />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="reviews" element={<ReviewsRecommendationsPage />} />
            <Route path="tour/:id" element={<TourDetail />} />
            <Route
              path="my-bookings"
              element={
                <Protected>
                  <MyBookings />
                </Protected>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
export default App;