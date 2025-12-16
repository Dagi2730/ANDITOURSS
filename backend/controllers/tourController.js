// backend/controllers/tourController.js (FULL CRUD IMPLEMENTATION)

import asyncHandler from 'express-async-handler'; 
import Tour from '../models/tourModel.js'; 

// --- READ OPERATIONS ---

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
const getTours = asyncHandler(async (req, res) => {
    const tours = await Tour.find({}); 
    res.status(200).json(tours);
});

// @desc    Get single tour by ID
// @route   GET /api/tours/:id
// @access  Public
const getTourById = asyncHandler(async (req, res) => {
    const tour = await Tour.findById(req.params.id);

    if (tour) {
        res.json(tour);
    } else {
        res.status(404);
        throw new Error('Tour not found');
    }
});


// --- WRITE OPERATIONS ---

// @desc    Create a new tour
// @route   POST /api/tours
// @access  Private (Admin only)
const createTour = asyncHandler(async (req, res) => {
    const { title, description, price, duration, image } = req.body; 

    if (!title || !description || !price || !duration) {
        res.status(400);
        throw new Error('Please include all required fields');
    }
    
    const tour = await Tour.create({
        // user: req.user.id, // (Temporarily omitted to avoid 500 error due to schema)
        title, 
        description,
        price,
        duration,
        image,
    });
    
    res.status(201).json(tour); 
});

// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private (Admin only)
const updateTour = asyncHandler(async (req, res) => {
    const { title, description, price, duration, image } = req.body; 

    // Find the tour by ID
    const tour = await Tour.findById(req.params.id);

    if (tour) {
        // Update the fields, defaulting to existing data if new data is not provided
        tour.title = title || tour.title;
        tour.description = description || tour.description;
        tour.price = price || tour.price;
        tour.duration = duration || tour.duration;
        tour.image = image || tour.image;
        
        const updatedTour = await tour.save();
        res.json(updatedTour);
    } else {
        res.status(404);
        throw new Error('Tour not found');
    }
});

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private (Admin only)
const deleteTour = asyncHandler(async (req, res) => {
    const tour = await Tour.findById(req.params.id);

    if (tour) {
        await Tour.deleteOne({ _id: req.params.id }); // Mongoose recommends deleteOne/deleteMany over remove()
        res.json({ message: 'Tour removed' });
    } else {
        res.status(404);
        throw new Error('Tour not found');
    }
});

export { 
    getTours, 
    getTourById, // New export
    createTour, 
    updateTour, // New export
    deleteTour  // New export
};