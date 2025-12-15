// backend/routes/tourRoutes.js (Full Content)

import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js'; 
import { getTours, createTour } from '../controllers/tourController.js'; 

// Route for /api/tours 
router.route('/')
    .get(getTours)                  // GET /api/tours (Public)
    .post(protect, createTour);    // POST /api/tours (Admin/Private)

// We will skip the :id routes for now.

export default router;