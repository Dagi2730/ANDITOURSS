import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

const initialState = {
    tours: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// --- THUNKS ---

export const getTours = createAsyncThunk('tours/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/tours');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tours');
    }
});

export const createTour = createAsyncThunk('tours/create', async (tourData, thunkAPI) => {
    try {
        const response = await api.post('/tours', tourData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create tour');
    }
});

export const deleteTour = createAsyncThunk('tours/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`/tours/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete tour');
    }
});

export const updateTour = createAsyncThunk('tours/update', async ({ id, tourData }, thunkAPI) => {
    try {
        const response = await api.put(`/tours/${id}`, tourData);
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