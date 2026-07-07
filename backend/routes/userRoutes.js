import express from 'express';
import { register, login, getMe, updateMe, getAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.get('/profile', requireAuth, getMe);
router.put('/profile', requireAuth, updateMe);
router.get('/', requireAuth, requireAdmin, getAllUsers);
router.put('/:id/role', requireAuth, requireAdmin, updateUserRole);
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

export default router;
