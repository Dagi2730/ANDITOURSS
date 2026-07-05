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

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'anditours-local-secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
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
