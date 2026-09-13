import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

// Public - anyone can submit the contact form
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const newMessage = await prisma.contactMessage.create({
    data: { name, email, subject, message },
  });

  res.status(201).json(newMessage);
});

// Admin only
const getMessages = asyncHandler(async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
});

const markMessageRead = asyncHandler(async (req, res) => {
  const existing = await prisma.contactMessage.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    res.status(404);
    throw new Error('Message not found');
  }

  const updated = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });

  res.json(updated);
});

const deleteMessage = asyncHandler(async (req, res) => {
  const existing = await prisma.contactMessage.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    res.status(404);
    throw new Error('Message not found');
  }

  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.json({ message: 'Message removed' });
});

export { createMessage, getMessages, markMessageRead, deleteMessage };