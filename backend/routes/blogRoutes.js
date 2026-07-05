import express from 'express';
import {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads/blog directory exists
const uploadsRoot = path.join(path.resolve(), 'uploads');
const blogUploadsDir = path.join(uploadsRoot, 'blog');
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot);
}
if (!fs.existsSync(blogUploadsDir)) {
  fs.mkdirSync(blogUploadsDir);
}

// Multer storage configuration for blog images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, blogUploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and WebP images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Public routes
router.route('/').get(getBlogPosts);
router.route('/:id').get(getBlogPostById);

// Admin CRUD routes with image upload
router
  .route('/')
  .post(requireAuth, requireAdmin, upload.single('image'), createBlogPost);

router
  .route('/:id')
  .put(requireAuth, requireAdmin, upload.single('image'), updateBlogPost)
  .delete(requireAuth, requireAdmin, deleteBlogPost);

export default router;



