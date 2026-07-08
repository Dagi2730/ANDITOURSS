// frontend/src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tourReducer from '../features/tour/tourSlice';
import bookingReducer from '../features/booking/bookingSlice';
import adminBookingReducer from '../features/booking/adminBookingSlice';
import blogReducer from '../features/blog/blogSlice';
import adminMessageReducer from '../features/message/adminMessageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    tour: tourReducer,
    booking: bookingReducer,
    adminBooking: adminBookingReducer,
    blog: blogReducer,
    adminMessage: adminMessageReducer,
  },
});