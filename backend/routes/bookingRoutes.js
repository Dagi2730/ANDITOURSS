import express from 'express';
import {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getBookingStats,
} from '../controllers/bookingController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mybookings', requireAuth, getMyBookings);
router.get('/stats', requireAuth, requireAdmin, getBookingStats);
router.route('/').get(requireAuth, requireAdmin, getBookings).post(requireAuth, createBooking);
router.route('/:id')
  .get(requireAuth, getBookingById)
  .put(requireAuth, updateBooking)
  .delete(requireAuth, cancelBooking);

export default router;
