// backend/routes/tourRoutes.js (FULL CRUD ROUTING)

import express from 'express';
const router = express.Router();
import { 
    getTours, 
    getTourById,
    createTour,
    updateTour,
    deleteTour 
} from '../controllers/tourController.js';
import { protect } from '../middleware/authMiddleware.js';


// Route for GET all tours (Public) and POST a new tour (Private)
router.route('/')
    .get(getTours)
    .post(protect, createTour); // Requires login (protect)

// Routes for single tour operations: GET by ID, PUT/UPDATE, DELETE
router.route('/:id')
    .get(getTourById) // Public access to view a single tour
    .put(protect, updateTour) // Requires login (protect)
    .delete(protect, deleteTour); // Requires login (protect)


export default router;