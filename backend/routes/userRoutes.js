import express from 'express';
import { register, login, getMe, updateMe, getAllUsers, updateUserRole } from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.get('/', requireAuth, requireAdmin, getAllUsers);
router.put('/:id/role', requireAuth, requireAdmin, updateUserRole);

export default router;
