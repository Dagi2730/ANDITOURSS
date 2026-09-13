import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const uploadDir = 'uploads/tours';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadFields = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'image', maxCount: 5 },
]);

router.route('/')
  .get(getTours)
  .post(requireAuth, requireAdmin, uploadFields, createTour);

router.route('/:id')
  .get(getTourById)
  .put(requireAuth, requireAdmin, uploadFields, updateTour)
  .delete(requireAuth, requireAdmin, deleteTour);

export default router;
