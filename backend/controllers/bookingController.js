import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const validateAndParseDate = (dateStr) => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  const year = parsed.getFullYear();
  if (year < 2000 || year > 2100) return null;
  return parsed;
};

const attachOrderNumbers = async (bookingsData) => {
  try {
    const allBookings = await prisma.booking.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    const idMap = new Map();
    allBookings.forEach((b, idx) => {
      idMap.set(b.id, '#' + String(idx + 1).padStart(5, '0'));
    });

    if (Array.isArray(bookingsData)) {
      return bookingsData.map((b) => ({
        ...b,
        orderNumber: idMap.get(b.id) || '#00001',
      }));
    } else if (bookingsData && bookingsData.id) {
      return {
        ...bookingsData,
        orderNumber: idMap.get(bookingsData.id) || '#00001',
      };
    }
  } catch (err) {
    console.error('Error mapping order numbers:', err);
  }
  return bookingsData;
};

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
    fullName,
    email,
    phone,
  } = req.body;

  const resolvedTourId = tourId;
  const resolvedTravelDate = travelDate || dateFrom;
  const resolvedTravelDateEnd = travelDateEnd || dateTo || null;
  const resolvedGuests = guests || numberOfTourists;
  const parsedGuests = parseInt(resolvedGuests, 10);

  if (!resolvedTourId || !resolvedTravelDate || !resolvedGuests || isNaN(parsedGuests) || parsedGuests < 1) {
    res.status(400);
    throw new Error('Please fill in all required fields with a valid number of tourists');
  }

  const startDate = validateAndParseDate(resolvedTravelDate);
  const endDate = resolvedTravelDateEnd ? validateAndParseDate(resolvedTravelDateEnd) : null;

  if (!startDate) {
    res.status(400);
    throw new Error('Please provide a valid travel start date');
  }

  const tour = await prisma.tour.findUnique({ where: { id: resolvedTourId } });
  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  let targetUserId;
  const targetEmail = (email || '').trim().toLowerCase();
  const targetName = (fullName || '').trim() || 'Guest Customer';
  const targetPhone = (phone || '').trim();

  if (targetEmail) {
    let existingUser = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          email: targetEmail,
          name: targetName,
          phone: targetPhone,
          password: 'guest_pwd_' + Math.random().toString(36).slice(-8),
          role: 'USER',
        },
      });
    } else {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: targetName || existingUser.name,
          phone: targetPhone || existingUser.phone,
        },
      });
    }
    targetUserId = existingUser.id;
  } else if (req.user) {
    targetUserId = req.user.id;
  } else {
    res.status(400);
    throw new Error('Please provide your email address to complete your booking');
  }

  let passportUrl = null;
  if (req.file) {
    passportUrl = `/uploads/passports/${req.file.filename}`;
  }

  const booking = await prisma.booking.create({
    data: {
      userId: targetUserId,
      tourId: resolvedTourId,
      travelDate: startDate,
      travelDateEnd: endDate,
      guests: parsedGuests,
      comments: comments || '',
      passportUrl,
      status: 'PENDING',
    },
    include: {
      tour: {
        select: { id: true, title: true, price: true, duration: true, imageUrl: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  res.status(201).json(await attachOrderNumbers(booking));
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

  res.json(await attachOrderNumbers(bookings));
});

const getMyBookings = asyncHandler(async (req, res) => {
  let userId = req.user?.id;
  const emailQuery = req.query.email ? req.query.email.trim().toLowerCase() : null;

  if (!userId && emailQuery) {
    const userObj = await prisma.user.findUnique({ where: { email: emailQuery } });
    if (userObj) {
      userId = userObj.id;
    }
  }

  if (!userId) {
    return res.json([]);
  }

  const bookings = await prisma.booking.findMany({
    where: { userId },
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
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(await attachOrderNumbers(bookings));
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

  res.json(await attachOrderNumbers(booking));
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
    const parsedG = parseInt(guests ?? numberOfTourists, 10);
    if (!isNaN(parsedG) && parsedG > 0) {
      data.guests = parsedG;
    }
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

  res.json(await attachOrderNumbers(updated));
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

  res.json(await attachOrderNumbers(updated));
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
