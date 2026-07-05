import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  bookings: [],
  stats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    new: 0,
    updated: 0
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

// Get all bookings (Admin)
export const getBookings = createAsyncThunk(
  'adminBookings/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.get(`${baseURL}/api/bookings`, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

// Get booking stats
export const getBookingStats = createAsyncThunk(
  'adminBookings/getStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.get(`${baseURL}/api/bookings/stats`, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stats'
      );
    }
  }
);

// Update booking status
export const updateBookingStatus = createAsyncThunk(
  'adminBookings/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.put(
        `${baseURL}/api/bookings/${id}`,
        { status },
        getConfig(token)
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update booking status'
      );
    }
  }
);

// Delete booking
export const deleteBooking = createAsyncThunk(
  'adminBookings/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await axios.delete(`${baseURL}/api/bookings/${id}`, getConfig(token));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete booking'
      );
    }
  }
);

export const adminBookingSlice = createSlice({
  name: 'adminBooking',
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
      .addCase(getBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBookingStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
        // Update stats
        if (action.payload.status === 'confirmed') {
          state.stats.confirmed += 1;
          state.stats.pending -= 1;
        }
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((booking) => booking._id !== action.payload);
        state.stats.total -= 1;
      });
  },
});

export const { reset } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;


