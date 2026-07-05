import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  bookings: [],
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

// Get user's bookings
export const getMyBookings = createAsyncThunk(
  'bookings/getMyBookings',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.get(`${baseURL}/api/bookings/mybookings`, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

// Create booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.post(
        `${baseURL}/api/bookings`,
        bookingData,
        getConfig(token)
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create booking'
      );
    }
  }
);

// Update booking
export const updateBooking = createAsyncThunk(
  'bookings/update',
  async ({ id, bookingData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.put(
        `${baseURL}/api/bookings/${id}`,
        bookingData,
        getConfig(token)
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update booking'
      );
    }
  }
);

// Delete booking
export const deleteBooking = createAsyncThunk(
  'bookings/delete',
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

export const bookingSlice = createSlice({
  name: 'booking',
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
      .addCase(getMyBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.filter((booking) => booking._id !== action.payload);
      });
  },
});

export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;


