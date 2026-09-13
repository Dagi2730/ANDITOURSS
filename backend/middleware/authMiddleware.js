import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'undefined' || token === 'null') {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');

    const decoded = jwt.verify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, phone: true, role: true }
    });

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user account not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, session expired. Please log in again.');
  }
});

const requireAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
});

export { requireAuth, requireAdmin };