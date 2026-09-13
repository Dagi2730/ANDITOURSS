import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

const initialState = {
  reviews: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getAllReviews = createAsyncThunk(
  'adminReviews/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/reviews');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch reviews'
      );
    }
  }
);

export const updateReviewStatus = createAsyncThunk(
  'adminReviews/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await api.put(`/reviews/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update review status'
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  'adminReviews/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete review'
      );
    }
  }
);

export const adminReviewSlice = createSlice({
  name: 'adminReview',
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
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        state.reviews = state.reviews.map((r) => r.id === action.payload.id ? action.payload : r);
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
      });
  },
});

export const { reset } = adminReviewSlice.actions;
export default adminReviewSlice.reducer;