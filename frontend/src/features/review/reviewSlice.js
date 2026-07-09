import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  reviews: [],
  featuredReviews: [],
  eligibility: {
    hasConfirmedBooking: false,
    alreadyReviewed: false,
    eligible: false,
  },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const API_URL = import.meta.env.VITE_API_URL || '';
const baseURL = API_URL || 'http://localhost:8000';

export const getReviewsByTour = createAsyncThunk(
  'reviews/getByTour',
  async (tourId, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/api/reviews/tour/${tourId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch reviews'
      );
    }
  }
);

export const getFeaturedReviews = createAsyncThunk(
  'reviews/getFeatured',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/api/reviews/featured`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch featured reviews'
      );
    }
  }
);

export const checkEligibility = createAsyncThunk(
  'reviews/checkEligibility',
  async (tourId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const response = await axios.get(
        `${baseURL}/api/reviews/eligibility/${tourId}`,
        getConfig(token)
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to check review eligibility'
      );
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ tourId, rating, comment }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const response = await axios.post(
        `${baseURL}/api/reviews`,
        { tourId, rating, comment },
        getConfig(token)
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to submit review'
      );
    }
  }
);

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviewsByTour.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviewsByTour.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviewsByTour.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFeaturedReviews.fulfilled, (state, action) => {
        state.featuredReviews = action.payload;
      })
      .addCase(checkEligibility.fulfilled, (state, action) => {
        state.eligibility = action.payload;
      })
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews.unshift(action.payload);
        state.eligibility.eligible = false;
        state.eligibility.alreadyReviewed = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;