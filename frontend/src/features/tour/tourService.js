import api from '../../lib/api';

// Create new tour
const createTour = async (tourData) => {
  const response = await api.post('/tours', tourData);
  return response.data;
};

// Get all tours
const getTours = async () => {
  const response = await api.get('/tours');
  return response.data;
};

// Update an existing tour
const updateTour = async (tourId, tourData) => {
  const response = await api.put(`/tours/${tourId}`, tourData);
  return response.data;
};

// DELETE TOUR
const deleteTour = async (tourId) => {
  const response = await api.delete(`/tours/${tourId}`);
  return response.data;
};

const tourService = {
  createTour,
  getTours,
  updateTour,
  deleteTour,
};

export default tourService;