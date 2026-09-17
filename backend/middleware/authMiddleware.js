import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const requireAuth = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token || token === 'undefined' || token === 'null') {
    res.status(401);
    throw new Error('Not authorized, no valid token provided');
  }

  try {
    const secret = process.env.JWT_SECRET || 'anditours_secure_jwt_secret_key_2026';

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

const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (token && token !== 'undefined' && token !== 'null') {
    try {
      const secret = process.env.JWT_SECRET || 'anditours_secure_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, phone: true, role: true }
      });
      if (user) req.user = user;
    } catch (error) {
      // Token invalid or expired, continue as guest
    }
  }
  next();
});

const requireAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
});

export { requireAuth, optionalAuth, requireAdmin };