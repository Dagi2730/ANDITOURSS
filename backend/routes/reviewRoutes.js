import express from 'express';
import {
  createReview,
  getReviewsByTour,
  getFeaturedReviews,
  checkEligibility,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from '../controllers/reviewController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/featured', getFeaturedReviews);
router.get('/tour/:tourId', getReviewsByTour);

// Logged-in customer
router.get('/eligibility/:tourId', requireAuth, checkEligibility);
router.post('/', requireAuth, createReview);

// Admin only
router.get('/', requireAuth, requireAdmin, getAllReviews);
router.put('/:id/status', requireAuth, requireAdmin, updateReviewStatus);
router.delete('/:id', requireAuth, requireAdmin, deleteReview);

export default router;