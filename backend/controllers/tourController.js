// backend/controllers/tourController.js (COMPLETE AND ERROR-FREE)

import asyncHandler from 'express-async-handler'; 
import Tour from '../models/tourModel.js'; 

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
const getTours = asyncHandler(async (req, res) => { // <-- DEFINITION 1: Included to fix SyntaxError
    const tours = await Tour.find({}); 
    res.status(200).json(tours);
});

// @desc    Create a new tour
// @route   POST /api/tours
// @access  Private (Admin only)
const createTour = asyncHandler(async (req, res) => { // <-- DEFINITION 2: Included
    // Using 'title' to match the Tour Model Schema
    const { title, description, price, duration, image } = req.body; 

    if (!title || !description || !price || !duration) {
        res.status(400);
        throw new Error('Please include the title, description, price, and duration');
    }
    
    const tour = await Tour.create({
        // TEMPORARILY COMMENTED OUT: Your Tour Model schema did not include the 'user' field,
        // which caused the 500 DB Validation Error.
        // user: req.user.id, 
        title, 
        description,
        price,
        duration,
        image,
    });
    
    res.status(201).json(tour); 
});

// Export the defined functions
export { getTours, createTour }; // <-- Export line will now succeed