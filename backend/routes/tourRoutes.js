import express from 'express';
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getTours).post(requireAuth, requireAdmin, createTour);
router.route('/:id')
  .get(getTourById)
  .put(requireAuth, requireAdmin, updateTour)
  .delete(requireAuth, requireAdmin, deleteTour);

export default router;
