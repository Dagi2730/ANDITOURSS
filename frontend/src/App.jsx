// frontend/src/App.jsx (Final Update for Auth)

import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TourList from './components/TourList';
import Protected from './components/Protected'; // <-- NEW IMPORT
import './App.css'; 

// Import all pages
import AdminDashboard from './pages/AdminDashboard'; // <-- UNCOMMENTED THIS
import LoginPage from './pages/LoginPage'; 
// import RegisterPage from './pages/RegisterPage'; 

function App() {
  return (
    <Router>
        <div className="App">
            <Routes>
                {/* Public Route: The main tour list */}
                <Route path="/" element={<TourList />} /> 
                
                {/* Public Route for Authentication */}
                <Route path="/login" element={<LoginPage />} /> 
                {/* <Route path="/register" element={<RegisterPage />} /> */}

                {/* PROTECTED ROUTE */}
                <Route 
                    path="/admin" 
                    element={
                        <Protected> {/* <-- WRAP THE COMPONENT */}
                            <AdminDashboard />
                        </Protected>
                    } 
                />
            </Routes>
        </div>
    </Router>
  );
}

export default App;