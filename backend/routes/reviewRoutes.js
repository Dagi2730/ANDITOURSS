import express from 'express';
import {
  getTourReviews,
  getAllReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tour/:tourId', getTourReviews);
router.route('/')
  .get(requireAuth, requireAdmin, getAllReviews)
  .post(requireAuth, createReview);
router.route('/:id').delete(requireAuth, requireAdmin, deleteReview);

export default router;
