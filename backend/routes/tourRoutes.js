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

const uploadMiddleware = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Image upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    }
    next();
  });
};

router.route('/')
  .get(getTours)
  .post(requireAuth, requireAdmin, uploadMiddleware, createTour);

router.route('/:id')
  .get(getTourById)
  .put(requireAuth, requireAdmin, uploadMiddleware, updateTour)
  .delete(requireAuth, requireAdmin, deleteTour);

export default router;
