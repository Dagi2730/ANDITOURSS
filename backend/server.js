// backend/server.js

// 1. Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from './config/db.js'; 

// Import all route files
import tourRoutes from './routes/tourRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; // <-- NEW IMPORT

// Load environment variables from .env file
dotenv.config();

// 2. Initialize the Express app
const app = express();
// Ensure you call the connectDB function here, if it wasn't called already
connectDB(); // Moved here for clarity

const PORT = process.env.PORT || 8000;

// 3. Middlewares
app.use(cors());
app.use(express.json()); // Allows server to accept JSON data in the body

// 4. Basic Route (Test)
app.get('/', (req, res) => {
    res.send('ANDI TOURS API is running...');
});

// 5. Mount the Route Handlers
// Tour Routes
app.use('/api/tours', tourRoutes);

// User/Auth Routes
app.use('/api/users', userRoutes); // <-- NEW LINE TO ACTIVATE USER ROUTES

// 6. Start the server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});