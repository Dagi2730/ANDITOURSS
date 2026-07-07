import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    tours: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const API_URL = import.meta.env.VITE_API_URL || '';
// Default to localhost:8000 if no env var is set (for development)
const baseURL = API_URL || 'http://localhost:8000';

const getConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

// --- THUNKS ---

export const getTours = createAsyncThunk('tours/getAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${baseURL}/api/tours`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tours');
    }
});

export const createTour = createAsyncThunk('tours/create', async (tourData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await axios.post(`${baseURL}/api/tours`, tourData, getConfig(token));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create tour');
    }
});

export const deleteTour = createAsyncThunk('tours/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        await axios.delete(`${baseURL}/api/tours/${id}`, getConfig(token));
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete tour');
    }
});

export const updateTour = createAsyncThunk('tours/update', async ({ id, tourData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await axios.put(`${baseURL}/api/tours/${id}`, tourData, getConfig(token));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update tour');
    }
});

export const tourSlice = createSlice({
    name: 'tour',
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
            .addCase(getTours.pending, (state) => { state.isLoading = true })
            .addCase(getTours.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tours = action.payload;
            })
            .addCase(createTour.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tours.push(action.payload);
            })
            .addCase(deleteTour.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tours = state.tours.filter((t) => t.id !== action.payload);
            })
            .addCase(updateTour.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tours = state.tours.map((t) => t.id === action.payload.id ? action.payload : t);
            });
    },
});

export const { reset } = tourSlice.actions;
export default tourSlice.reducer;