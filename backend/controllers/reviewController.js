import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

// POST /api/reviews - customer creates a review (must have a CONFIRMED booking for the tour)
const createReview = asyncHandler(async (req, res) => {
  const { tourId, rating, comment } = req.body;

  if (!tourId || !rating || !comment) {
    res.status(400);
    throw new Error('Please provide a rating and comment');
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const confirmedBooking = await prisma.booking.findFirst({
    where: {
      userId: req.user.id,
      tourId,
      status: 'CONFIRMED',
    },
  });

  if (!confirmedBooking) {
    res.status(403);
    throw new Error('You can only review tours you have a confirmed booking for');
  }

  const existingReview = await prisma.review.findUnique({
    where: { userId_tourId: { userId: req.user.id, tourId } },
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this tour');
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      tourId,
      rating: numericRating,
      comment,
    },
    include: {
      user: { select: { id: true, name: true } },
      tour: { select: { id: true, title: true } },
    },
  });

  res.status(201).json(review);
});

// GET /api/reviews/tour/:tourId - public, all reviews for one tour
const getReviewsByTour = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { tourId: req.params.tourId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
});

// GET /api/reviews/featured - public, top-rated reviews across all tours for marketing display
const getFeaturedReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { rating: { gte: 4 } },
    include: {
      user: { select: { name: true } },
      tour: { select: { id: true, title: true, imageUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  res.json(reviews);
});

// GET /api/reviews/eligibility/:tourId - logged-in user only, tells frontend whether to show the review form
const checkEligibility = asyncHandler(async (req, res) => {
  const { tourId } = req.params;

  const confirmedBooking = await prisma.booking.findFirst({
    where: { userId: req.user.id, tourId, status: 'CONFIRMED' },
  });

  const existingReview = await prisma.review.findUnique({
    where: { userId_tourId: { userId: req.user.id, tourId } },
  });

  res.json({
    hasConfirmedBooking: !!confirmedBooking,
    alreadyReviewed: !!existingReview,
    eligible: !!confirmedBooking && !existingReview,
  });
});

// GET /api/reviews - admin only, all reviews across the site for moderation
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
  deleteReview,
};