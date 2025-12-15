// frontend/src/pages/AdminDashboard.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // <-- 1. IMPORT useSelector
import TourForm from '../components/TourForm';

function AdminDashboard() {
    const navigate = useNavigate();

    // 2. RETRIEVE 'user' FROM REDUX STATE
    const { user } = useSelector((state) => state.auth); 

    // 3. RETRIEVE 'tours' state to check creation success
    const { tours } = useSelector((state) => state.tour); 


    useEffect(() => {
        // Redirection logic if user is not logged in or is not an admin
        if (!user) {
            navigate('/login');
        } 
        
        // This is the line that was crashing, check if user exists before accessing properties
        // You might have a line here checking user.isAdmin or user.role
        
        // Example check for admin role (if you have one in your user object)
        // if (user && user.role !== 'admin') {
        //     navigate('/'); 
        // }
        
    }, [user, navigate]); // Depend on user state and navigate function

    // Check if user is still loading or if there's no user, show a loading/redirect message
    if (!user) {
        return <h1>Redirecting...</h1>; 
    }

    return (
        <>
            <section className='heading'>
                {/* Now 'user' is defined, and this line will work */}
                <h1>Welcome {user.name}</h1> 
                <p>Tour Management Dashboard</p>
            </section>

            {/* Render the TourForm component */}
            <TourForm /> 

            <section className='content'>
                {/* You can list the tours here if needed */}
                <h3>Current Tours ({tours.length})</h3>
                {/* Add a list or table of tours */}
            </section>
        </>
    );
}

export default AdminDashboard;