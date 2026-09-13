import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const parseTourData = (tour) => {
  if (!tour) return tour;
  let itinerary = tour.itinerary;
  if (typeof itinerary === 'string') {
    try {
      itinerary = JSON.parse(itinerary);
    } catch (e) {
      itinerary = [];
    }
  }

  let images = [];
  if (tour.imageUrl) {
    try {
      const parsed = JSON.parse(tour.imageUrl);
      if (Array.isArray(parsed)) {
        images = parsed;
      } else {
        images = [tour.imageUrl];
      }
    } catch (e) {
      images = [tour.imageUrl];
    }
  }

  return {
    ...tour,
    itinerary,
    images,
    imageUrl: images[0] || tour.imageUrl,
  };
};

const getImagesFromReq = (req, existingImageUrl = null) => {
  const fileArray = [];
  if (req.files) {
    if (Array.isArray(req.files.images)) {
      req.files.images.forEach((f) => fileArray.push(`/uploads/tours/${f.filename}`));
    }
    if (Array.isArray(req.files.image)) {
      req.files.image.forEach((f) => fileArray.push(`/uploads/tours/${f.filename}`));
    }
  } else if (req.file) {
    fileArray.push(`/uploads/tours/${req.file.filename}`);
  }

  if (fileArray.length > 0) {
    return JSON.stringify(fileArray);
  }

  if (req.body.imageUrl) {
    return req.body.imageUrl;
  }

  return existingImageUrl;
};

const getTours = asyncHandler(async (req, res) => {
  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(tours.map(parseTourData));
});

const getTourById = asyncHandler(async (req, res) => {
  const tour = await prisma.tour.findUnique({
    where: { id: req.params.id },
  });

  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  res.json(parseTourData(tour));
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
  } = req.body;

  const tourTitle = title || name;

  if (!tourTitle || !duration || !description) {
    res.status(400);
    throw new Error('Please fill in all required fields (Title, Duration, Description)');
  }

  const parsedPrice = Number(price);
  const tourPrice = !isNaN(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;
  const formattedItinerary = typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || []);
  const finalImageUrl =
    getImagesFromReq(req) ||
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80';

  const tour = await prisma.tour.create({
    data: {
      title: tourTitle,
      price: tourPrice,
      duration,
      location: location || 'Ethiopia',
      description,
      highlights: highlights || '',
      travelDetails: travelDetails || '',
      itinerary: formattedItinerary,
      imageUrl: finalImageUrl,
    },
  });

  res.status(201).json(parseTourData(tour));
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
  } = req.body;

  const formattedItinerary = itinerary !== undefined
    ? (typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary))
    : tour.itinerary;
  const finalImageUrl = getImagesFromReq(req, tour.imageUrl);

  const updateData = {
    title: title || name || tour.title,
    duration: duration || tour.duration,
    location: location || tour.location,
    description: description || tour.description,
    highlights: highlights !== undefined ? highlights : tour.highlights,
    travelDetails:
      travelDetails !== undefined ? travelDetails : tour.travelDetails,
    itinerary: formattedItinerary,
    imageUrl: finalImageUrl,
  };

  if (price !== undefined && price !== '') {
    const p = Number(price);
    if (!isNaN(p)) {
      updateData.price = p;
    }
  }

  const updated = await prisma.tour.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.json(parseTourData(updated));
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
