import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      password: hashedPassword,
      name: name || null,
      phone: phone || null,
      role: 'USER',
    },
  });

  res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
    token: generateToken(user.id),
  });
});

// @desc    Login user & get token
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  const isMatch = user && (await bcrypt.compare(password, user.password));

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
    token: generateToken(user.id),
  });
});

// @desc    Get current user profile
const getMe = asyncHandler(async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    phone: req.user.phone,
    role: req.user.role,
  });
});

// @desc    Update current user profile
const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (email && email !== req.user.email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== req.user.id) {
      res.status(400);
      throw new Error('Email already in use');
    }
  }

  const updateData = {
    name: name !== undefined ? name : req.user.name,
    phone: phone !== undefined ? phone : req.user.phone,
  };

  if (email !== undefined) {
    updateData.email = email;
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
  });

  res.json({ id: updated.id, email: updated.email, name: updated.name, phone: updated.phone, role: updated.role });
});

// @desc    Get all users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { bookings: true } } },
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

// @desc    Update user role (Admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['USER', 'ADMIN'].includes(role)) {
    res.status(400);
    throw new Error('Role must be USER or ADMIN');
  }

  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
  });

  res.json({ id: updated.id, email: updated.email, name: updated.name, phone: updated.phone, role: updated.role });
});

// @desc    Delete a user (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await prisma.user.delete({ where: { id: req.params.id } });

  res.json({ message: 'User deleted successfully' });
});

// Corrected export statement
export { register, login, getMe, updateMe, getAllUsers, updateUserRole, deleteUser };