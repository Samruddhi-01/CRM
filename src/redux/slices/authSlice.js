// Auth Slice - Authentication & User State Management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { STORAGE_KEYS } from '../../utils/constants';

// Initial State
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async Thunks

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/auth/login', credentials);
      const data = response.data.data || response.data;
      const { accessToken, refreshToken, user } = data;
      const token = accessToken;
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return { token, refreshToken, user };
    } catch (error) {
      console.log('Login error:', error);
      
      // Handle specific error messages - check multiple possible locations
      const errorMessage = 
        error.message || 
        error.data?.message || 
        error.data?.error || 
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Login failed';
      
      console.log('Extracted error message:', errorMessage);
      
      // Check if account is deactivated
      if (errorMessage.toLowerCase().includes('deactivat')) {
        return rejectWithValue('Your account has been deactivated. Please contact your administrator.');
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Register
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/auth/register', userData);
      const data = response.data.data || response.data;
      const { accessToken, refreshToken, user } = data;
      const token = accessToken;
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return { token, refreshToken, user };
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Registration failed');
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Backend doesn't have logout endpoint yet, just clear local storage
      // await apiService.post('/api/auth/logout');
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      return null;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      return null;
    }
  }
);

// Check Auth - Validate existing session
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      console.log('Checking auth - Token exists:', !!token, 'User data exists:', !!userData);
      
      if (!token || !userData) {
        throw new Error('No session found');
      }
      
      // Validate with backend
      const response = await apiService.get('/api/auth/me');
      const user = response.data.data || response.data;
      
      // Check if user account is deactivated
      if (user && user.active === false) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        throw new Error('Your account has been deactivated. Please contact your administrator.');
      }
      
      console.log('Auth check successful, user:', user?.username);
      
      // Update user data in localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return {
        token,
        refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        user,
      };
    } catch (error) {
      console.error('Auth check failed:', error.message);
      
      // Check if it's a network error (don't clear session on network issues)
      const isNetworkError = error.message && (
        error.message.includes('Network') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('ERR_NETWORK') ||
        !navigator.onLine
      );
      
      // Only clear session for actual authentication errors, not network issues
      if (!isNetworkError) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } else {
        console.warn('⚠️ Network error - maintaining session');
      }
      
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);

updateUser: (state, action) => {
  state.user = action.payload;
}



// Update Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await apiService.put('/auth/profile', profileData);
      const user = response.data;
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // 🔥 ADD THIS
    updateUser: (state, action) => {
      state.user = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});


// Actions
export const { clearError, setUser, updateUser  } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;
export default authSlice.reducer;
