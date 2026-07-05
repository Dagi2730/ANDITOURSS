import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const getTourReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { tourId: req.params.tourId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
});

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

const createReview = asyncHandler(async (req, res) => {
  const { tourId, rating, comment } = req.body;

  if (!tourId || !rating || !comment) {
    res.status(400);
    throw new Error('Please provide tourId, rating, and comment');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  const existing = await prisma.review.findUnique({
    where: {
      userId_tourId: { userId: req.user.id, tourId },
    },
  });

  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this tour');
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      tourId,
      rating: Number(rating),
      comment,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true, title: true } },
    },
  });

  res.status(201).json(review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({
    where: { id: req.params.id },
  });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ message: 'Review removed' });
});

export { getTourReviews, getAllReviews, createReview, deleteReview };
