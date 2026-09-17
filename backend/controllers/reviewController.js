import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

// POST /api/reviews - customer creates a review (supports guest and logged-in users)
const createReview = asyncHandler(async (req, res) => {
  const { tourId, rating, comment, name, email } = req.body;

  if (!tourId || !rating || !comment) {
    res.status(400);
    throw new Error('Please select a star rating and enter your comment');
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  let targetUserId;

  if (req.user) {
    targetUserId = req.user.id;
    if (name) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { name },
      });
    }
  } else {
    const reviewerName = (name || '').trim() || 'Guest Reviewer';
    const reviewerEmail = (email || `${reviewerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@guest.com`).trim().toLowerCase();

    let existingUser = await prisma.user.findUnique({ where: { email: reviewerEmail } });
    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          email: reviewerEmail,
          name: reviewerName,
          password: 'guest_pwd_' + Math.random().toString(36).slice(-8),
          role: 'USER',
        },
      });
    } else {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { name: reviewerName },
      });
    }

    targetUserId = existingUser.id;
  }

  const existingReview = await prisma.review.findUnique({
    where: { userId_tourId: { userId: targetUserId, tourId } },
  });

  let review;
  if (existingReview) {
    review = await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating: numericRating,
        comment,
        status: 'PENDING',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tour: { select: { id: true, title: true } },
      },
    });
  } else {
    review = await prisma.review.create({
      data: {
        userId: targetUserId,
        tourId,
        rating: numericRating,
        comment,
        status: 'PENDING',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tour: { select: { id: true, title: true } },
      },
    });
  }

  res.status(201).json(review);
});

// GET /api/reviews/tour/:tourId - public, only APPROVED reviews for one tour
const getReviewsByTour = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { tourId: req.params.tourId, status: 'APPROVED' },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
});

// GET /api/reviews/featured - public, top-rated APPROVED reviews across all tours
const getFeaturedReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { rating: { gte: 4 }, status: 'APPROVED' },
    include: {
      user: { select: { name: true } },
      tour: { select: { id: true, title: true, imageUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  res.json(reviews);
});

// GET /api/reviews/eligibility/:tourId - guest and logged in users can write reviews
const checkEligibility = asyncHandler(async (req, res) => {
  res.json({
    hasConfirmedBooking: true,
    alreadyReviewed: false,
    eligible: true,
  });
});

// GET /api/reviews - admin only, all reviews across the site
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
});

// PUT /api/reviews/:id/status - admin only, update approval status
const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || !['PENDING', 'APPROVED'].includes(status)) {
    res.status(400);
    throw new Error('Status must be PENDING or APPROVED');
  }

  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const updated = await prisma.review.update({
    where: { id: req.params.id },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true, title: true } },
    },
  });

  res.json(updated);
});

// DELETE /api/reviews/:id - admin only
const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ message: 'Review removed' });
});

export {
  createReview,
  getReviewsByTour,
  getFeaturedReviews,
  checkEligibility,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};