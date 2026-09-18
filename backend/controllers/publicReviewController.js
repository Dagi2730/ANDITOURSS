import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';
import { uploadFile } from '../utils/storageHelper.js';

// GET /api/public-reviews — fetch all APPROVED reviews (public display on Reviews page)
const getApprovedReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      include: {
        user: { select: { name: true } },
        tour: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      user_name: r.user?.name || 'Guest Traveler',
      user_country: 'Ethiopia',
      tour_name: r.tour?.title || 'Ethiopia Tour',
      rating: r.rating,
      comment: r.comment,
      created_at: r.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    res.json([]);
  }
});

// POST /api/public-reviews — submit a new review (status: PENDING until Admin approves)
const submitReview = asyncHandler(async (req, res) => {
  const { tour_name, user_name, user_country, rating, comment, travel_date } = req.body;

  if (!tour_name || !user_name || !rating || !comment) {
    res.status(400);
    throw new Error('Please provide tour_name, user_name, rating, and comment');
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  let image_url = null;
  if (req.file) {
    image_url = await uploadFile(req.file, 'reviews');
  }

  let tour = await prisma.tour.findFirst({
    where: { title: { contains: tour_name } },
  });

  if (!tour) {
    tour = await prisma.tour.findFirst();
  }

  const reviewerName = (user_name || '').trim() || 'Guest Traveler';
  const reviewerEmail = (req.body.email || req.body.user_email || `${reviewerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@guest.com`).trim().toLowerCase();

  let user = await prisma.user.findUnique({ where: { email: reviewerEmail } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: reviewerEmail,
        name: reviewerName,
        password: 'guest_pwd_' + Math.random().toString(36).slice(-8),
        role: 'USER',
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: reviewerName },
    });
  }

  if (tour) {
    try {
      const existing = await prisma.review.findUnique({
        where: { userId_tourId: { userId: user.id, tourId: tour.id } },
      });

      if (existing) {
        await prisma.review.update({
          where: { id: existing.id },
          data: { rating: numericRating, comment: comment, status: 'PENDING' },
        });
      } else {
        await prisma.review.create({
          data: {
            userId: user.id,
            tourId: tour.id,
            rating: numericRating,
            comment: comment,
            status: 'PENDING',
          },
        });
      }
    } catch (err) {
      console.error('Review saving error:', err);
    }
  }

  res.status(201).json({
    message: 'Thank you! Your review has been submitted for admin approval.',
    review: {
      id: String(Date.now()),
      user_name,
      user_country,
      tour_name,
      rating: numericRating,
      comment,
      image_url,
      status: 'PENDING',
    },
  });
});

export { getApprovedReviews, submitReview };
