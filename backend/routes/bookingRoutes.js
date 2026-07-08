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
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/passports'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/mybookings', requireAuth, getMyBookings);
router.get('/stats', requireAuth, requireAdmin, getBookingStats);
router.route('/')
  .get(requireAuth, requireAdmin, getBookings)
  .post(requireAuth, upload.single('passport'), createBooking);
router.route('/:id')
  .get(requireAuth, getBookingById)
  .put(requireAuth, upload.single('passport'), updateBooking)
  .delete(requireAuth, cancelBooking);

export default router;