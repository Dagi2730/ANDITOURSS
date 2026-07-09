import express from 'express';
import {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} from '../controllers/messageController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createMessage)
  .get(requireAuth, requireAdmin, getMessages);

router.put('/:id/read', requireAuth, requireAdmin, markMessageRead);
router.delete('/:id', requireAuth, requireAdmin, deleteMessage);

export default router;
