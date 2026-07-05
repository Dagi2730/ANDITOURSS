import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const createBooking = asyncHandler(async (req, res) => {
  const {
    tourId,
    travelDate,
    dateFrom,
    travelDateEnd,
    dateTo,
    guests,
    numberOfTourists,
    comments,
  } = req.body;

  const resolvedTourId = tourId;
  const resolvedTravelDate = travelDate || dateFrom;
  const resolvedTravelDateEnd = travelDateEnd || dateTo || null;
  const resolvedGuests = guests || numberOfTourists;

  if (!resolvedTourId || !resolvedTravelDate || !resolvedGuests) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const tour = await prisma.tour.findUnique({ where: { id: resolvedTourId } });
  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  const booking = await prisma.booking.create({
    data: {
      userId: req.user.id,
      tourId: resolvedTourId,
      travelDate: new Date(resolvedTravelDate),
      travelDateEnd: resolvedTravelDateEnd
        ? new Date(resolvedTravelDateEnd)
        : null,
      guests: Number(resolvedGuests),
      comments: comments || '',
      status: 'PENDING',
    },
    include: {
      tour: {
        select: { id: true, title: true, price: true, duration: true, imageUrl: true },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(201).json(booking);
});

const getBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: {
      tour: {
        select: { id: true, title: true, price: true, duration: true, imageUrl: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(bookings);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: {
      tour: {
        select: {
          id: true,
          title: true,
          price: true,
          duration: true,
          imageUrl: true,
          description: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(bookings);
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: {
      tour: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Not authorized to access this booking');
  }

  res.json(booking);
});

const updateBooking = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const isOwner = booking.userId === req.user.id;
  const isAdmin = req.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  const {
    travelDate,
    dateFrom,
    travelDateEnd,
    dateTo,
    guests,
    numberOfTourists,
    comments,
    status,
  } = req.body;

  const data = {};

  if (travelDate || dateFrom) {
    data.travelDate = new Date(travelDate || dateFrom);
  }
  if (travelDateEnd || dateTo) {
    data.travelDateEnd = new Date(travelDateEnd || dateTo);
  }
  if (guests !== undefined || numberOfTourists !== undefined) {
    data.guests = Number(guests ?? numberOfTourists);
  }
  if (comments !== undefined) {
    data.comments = comments;
  }
  if (status !== undefined && isAdmin) {
    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    data.status = status;
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data,
    include: {
      tour: {
        select: { id: true, title: true, price: true, duration: true, imageUrl: true },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  res.json(updated);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' },
    include: {
      tour: {
        select: { id: true, title: true, price: true, duration: true, imageUrl: true },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  res.json(updated);
});

const getBookingStats = asyncHandler(async (req, res) => {
  const [total, pending, confirmed, cancelled] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'CANCELLED' } }),
  ]);

  res.json({ total, pending, confirmed, cancelled });
});

export {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getBookingStats,
};
