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
import AdminDashboard from './pages/AdminDashboard';
import Protected from './components/Protected';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
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
              <Protected>
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
            <Route path="tour/:id" element={<TourDetail />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
export default App;