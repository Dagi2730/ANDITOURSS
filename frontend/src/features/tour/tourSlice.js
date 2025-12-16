import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    tours: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const getConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

// --- THUNKS ---

export const getTours = createAsyncThunk('tours/getAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get('/api/tours');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const createTour = createAsyncThunk('tours/create', async (tourData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await axios.post('/api/tours', tourData, getConfig(token));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const deleteTour = createAsyncThunk('tours/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        await axios.delete(`/api/tours/${id}`, getConfig(token));
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const updateTour = createAsyncThunk('tours/update', async ({ id, tourData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await axios.put(`/api/tours/${id}`, tourData, getConfig(token));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
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
                state.tours = state.tours.filter((t) => t._id !== action.payload);
            })
            .addCase(updateTour.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tours = state.tours.map((t) => t._id === action.payload._id ? action.payload : t);
            });
    },
});

export const { reset } = tourSlice.actions;
export default tourSlice.reducer;