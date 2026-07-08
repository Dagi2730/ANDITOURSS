import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  messages: [],
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

export const getMessages = createAsyncThunk(
  'adminMessages/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.get(`${baseURL}/api/messages`, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages'
      );
    }
  }
);

export const markMessageRead = createAsyncThunk(
  'adminMessages/markRead',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.put(`${baseURL}/api/messages/${id}/read`, {}, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to mark message as read'
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'adminMessages/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await axios.delete(`${baseURL}/api/messages/${id}`, getConfig(token));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete message'
      );
    }
  }
);

export const adminMessageSlice = createSlice({
  name: 'adminMessage',
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
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markMessageRead.fulfilled, (state, action) => {
        state.messages = state.messages.map((m) =>
          m.id === action.payload.id ? action.payload : m
        );
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m.id !== action.payload);
      });
  },
});

export const { reset } = adminMessageSlice.actions;
export default adminMessageSlice.reducer;