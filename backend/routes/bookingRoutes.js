import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getBookingStats,
} from '../controllers/bookingController.js';
import { requireAuth, optionalAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/passports'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/mybookings', optionalAuth, getMyBookings);
router.get('/stats', requireAuth, requireAdmin, getBookingStats);
router.route('/')
  .get(requireAuth, requireAdmin, getBookings)
  .post(optionalAuth, upload.single('passport'), createBooking);
router.route('/:id')
  .get(optionalAuth, getBookingById)
  .put(optionalAuth, upload.single('passport'), updateBooking)
  .delete(optionalAuth, cancelBooking);

export default router;