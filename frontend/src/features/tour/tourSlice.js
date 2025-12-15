// frontend/src/features/tour/tourSlice.js (COMPLETE)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    tours: [], // Array to hold all tour objects
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Helper function to attach the JWT to the request headers (Used for 'createTour')
const getConfig = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// --- Thunk Functions for Backend Interaction ---

// Get All Tours (Public Access)
export const getTours = createAsyncThunk(
    'tours/getAll',
    async (_, thunkAPI) => { 
        try {
            // GET request to /api/tours - No token needed as it's a public route
            const response = await axios.get('/api/tours'); 
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// Create New Tour (Private/Admin Access)
export const createTour = createAsyncThunk(
    'tours/create',
    async (tourData, thunkAPI) => {
        try {
            // Get the user token from the auth state
            const token = thunkAPI.getState().auth.user.token;
            
            // Make POST request to backend, sending tourData and the token in headers
            const response = await axios.post(
                '/api/tours', 
                tourData, 
                getConfig(token) // <-- Using the secure config
            );

            return response.data; 
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// --- State Slice Definition ---

export const tourSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
        // Reset status flags
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // GET ALL TOURS CASES
            .addCase(getTours.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTours.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tours = action.payload; // Set the tours array with fetched data
            })
            .addCase(getTours.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Error message
            })
            // CREATE TOUR CASES
            .addCase(createTour.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTour.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Add the newly created tour to the existing tours array
                state.tours.push(action.payload);
            })
            .addCase(createTour.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Error message
            });
    },
});

export const { reset } = tourSlice.actions;
export default tourSlice.reducer;