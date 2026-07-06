import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/blog'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.route('/')
  .get(getBlogPosts)
  .post(requireAuth, requireAdmin, upload.single('image'), createBlogPost);

router.route('/:id')
  .get(getBlogPostById)
  .put(requireAuth, requireAdmin, upload.single('image'), updateBlogPost)
  .delete(requireAuth, requireAdmin, deleteBlogPost);

export default router;