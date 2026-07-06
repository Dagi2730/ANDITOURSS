import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  posts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const API_URL = import.meta.env.VITE_API_URL || '';
const baseURL = API_URL || 'http://localhost:8000';

const getConfig = (token, isMultipart = false) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}),
  },
});

export const getBlogPosts = createAsyncThunk(
  'blog/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/api/blog`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch stories');
    }
  }
);

export const createBlogPost = createAsyncThunk(
  'blog/create',
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.post(`${baseURL}/api/blog`, formData, getConfig(token, true));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create story');
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  'blog/update',
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.put(`${baseURL}/api/blog/${id}`, formData, getConfig(token, true));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update story');
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blog/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await axios.delete(`${baseURL}/api/blog/${id}`, getConfig(token));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete story');
    }
  }
);

export const blogSlice = createSlice({
  name: 'blog',
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
      .addCase(getBlogPosts.pending, (state) => { state.isLoading = true; })
      .addCase(getBlogPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getBlogPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.posts = state.posts.map((p) => p.id === action.payload.id ? action.payload : p);
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { reset } = blogSlice.actions;
export default blogSlice.reducer;