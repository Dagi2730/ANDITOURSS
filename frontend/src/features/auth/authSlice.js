import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// 1. Helper to ensure Role is consistent
const normalizeRole = (role) => role?.toString().toUpperCase() || 'USER';

// 2. Initialize State
const storedUser = JSON.parse(localStorage.getItem('user'));
const initialState = {
  user: storedUser ? { ...storedUser, role: normalizeRole(storedUser.role) } : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// 3. User Helper: Standardizes the user object shape
const buildUserState = (userData, token) => ({
  id: userData?.id || userData?.user?.id,
  email: userData?.email || userData?.user?.email,
  token: token, // Ensure token is part of the user object
  name: userData?.name || userData?.user?.name || 'User',
  phone: userData?.phone || userData?.user?.phone || null,
  role: normalizeRole(userData?.role || userData?.user?.role),
});

// 4. Async Thunks
export const register = createAsyncThunk(
  'auth/register',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post('/users/register', formData);
      const user = buildUserState(response.data, response.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post('/users/login', formData);
      const user = buildUserState(response.data, response.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  return null;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState().auth;
      const response = await api.put('/users/me', data, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Merge updated data with existing user state
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// 5. Slice
export const authSlice = createSlice({
  name: 'auth',
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
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;