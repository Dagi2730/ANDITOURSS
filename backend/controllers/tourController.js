import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const getTours = asyncHandler(async (req, res) => {
  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(tours);
});

const getTourById = asyncHandler(async (req, res) => {
  const tour = await prisma.tour.findUnique({
    where: { id: req.params.id },
  });

  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  res.json(tour);
});

const createTour = asyncHandler(async (req, res) => {
  const {
    title,
    name,
    price,
    duration,
    location,
    description,
    highlights,
    travelDetails,
    itinerary,
    imageUrl,
  } = req.body;

  const tourTitle = title || name;

  if (!tourTitle || !price || !duration || !description) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const tour = await prisma.tour.create({
    data: {
      title: tourTitle,
      price: Number(price),
      duration,
      location: location || 'Ethiopia',
      description,
      highlights: highlights || '',
      travelDetails: travelDetails || '',
      itinerary: itinerary || [],
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    },
  });

  res.status(201).json(tour);
});

const updateTour = asyncHandler(async (req, res) => {
  const tour = await prisma.tour.findUnique({
    where: { id: req.params.id },
  });

  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  const {
    title,
    name,
    price,
    duration,
    location,
    description,
    highlights,
    travelDetails,
    itinerary,
    imageUrl,
  } = req.body;

  const updated = await prisma.tour.update({
    where: { id: req.params.id },
    data: {
      title: title || name || tour.title,
      price: price !== undefined ? Number(price) : tour.price,
      duration: duration || tour.duration,
      location: location || tour.location,
      description: description || tour.description,
      highlights: highlights !== undefined ? highlights : tour.highlights,
      travelDetails:
        travelDetails !== undefined ? travelDetails : tour.travelDetails,
      itinerary: itinerary || tour.itinerary,
      imageUrl: imageUrl || tour.imageUrl,
    },
  });

  res.json(updated);
});

const deleteTour = asyncHandler(async (req, res) => {
  const tour = await prisma.tour.findUnique({
    where: { id: req.params.id },
  });

  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  await prisma.tour.delete({ where: { id: req.params.id } });
  res.json({ message: 'Tour removed' });
});

export { getTours, getTourById, createTour, updateTour, deleteTour };
