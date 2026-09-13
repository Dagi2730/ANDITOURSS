import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

const initialState = {
  bookings: [],
  stats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all bookings (Admin)
export const getBookings = createAsyncThunk(
  'adminBookings/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/bookings');
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
      const response = await api.get('/bookings/stats');
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
      const response = await api.put(`/bookings/${id}`, { status });
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
      await api.delete(`/bookings/${id}`);
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
          booking.id === action.payload.id ? action.payload : booking
        );
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
      });
  },
});

export const { reset } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;