import axios from 'axios';

const API_URL = '/api/tours/';

// Create new tour
const createTour = async (tourData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, tourData, config);
  return response.data;
};

// Get all tours
const getTours = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update an existing tour
const updateTour = async (tourId, tourData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + tourId, tourData, config);
  return response.data;
};

// DELETE TOUR
const deleteTour = async (tourId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + tourId, config);
  return response.data;
};

const tourService = {
  createTour,
  getTours,
  updateTour,
  deleteTour,
};

export default tourService;