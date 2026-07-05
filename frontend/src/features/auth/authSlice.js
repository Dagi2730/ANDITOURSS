import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../lib/api';

const normalizeRole = (role) => role?.toString().toUpperCase() || 'USER';

let storedUser = null;
try {
  storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    storedUser = { ...storedUser, role: normalizeRole(storedUser.role) };
  }
} catch {
  storedUser = null;
}

const initialState = {
  user: storedUser || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const fetchProfile = async (token) => {
  const response = await axios.get(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const buildUserState = (user, token) => ({
  id: user?.id || user?.user?.id,
  email: user?.email || user?.user?.email,
  token,
  name: user?.name || user?.user?.name || user?.email || 'User',
  phone: user?.phone || user?.user?.phone || null,
  role: normalizeRole(user?.role || user?.user?.role),
});

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, phone, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        phone,
        password,
      });

      const user = buildUserState(response.data.user, response.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      const user = buildUserState(response.data.user, response.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  return null;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, phone }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.put(
        `${API_URL}/api/users/me`,
        { name, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const current = thunkAPI.getState().auth.user;
      const user = { ...current, ...response.data, token: current.token };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Update failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
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
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
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
      .addCase(logout.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
