import { randomUUID, createHash } from 'crypto';
import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';
import generateToken from '../utils/generateToken.js';

const hashPassword = (password) => createHash('sha256').update(password).digest('hex');

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      password: hashPassword(password),
      name: name || null,
      phone: phone || null,
      role: 'USER',
    },
  });

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
    token: generateToken(user.id),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== hashPassword(password)) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
    token: generateToken(user.id),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    phone: req.user.phone,
    role: req.user.role,
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name: name !== undefined ? name : req.user.name,
      phone: phone !== undefined ? phone : req.user.phone,
    },
  });

  res.json({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    phone: updated.phone,
    role: updated.role,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  res.json(
    users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      bookingsCount: user._count.bookings,
    }))
  );
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['USER', 'ADMIN'].includes(role)) {
    res.status(400);
    throw new Error('Role must be USER or ADMIN');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
  });

  res.json({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    phone: updated.phone,
    role: updated.role,
  });
});

export { register, login, getMe, updateMe, getAllUsers, updateUserRole };
