// backend/routes/userRoutes.js

import express from 'express';
// We import the controller functions that contain the actual logic
import { authUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

// Route 1: POST /api/users/login
// This is used for authenticating (logging in) an existing user.
router.post('/login', authUser);

// Route 2: POST /api/users
// This is used for registering a new user.
router.post('/', registerUser); 

export default router;