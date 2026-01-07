// Analytics Slice - Real Analytics Data Management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Initial State
const initialState = {
  overviewMetrics: null,
  monthlyStatistics: null,
  hrPerformance: null,
  loading: false,
  error: null,
};

// Async Thunks

// Fetch Overview Metrics
export const fetchOverviewMetrics = createAsyncThunk(
  'analytics/fetchOverviewMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/admin/metrics/overview');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch overview metrics');
    }
  }
);

// Fetch Monthly Statistics
export const fetchMonthlyStatistics = createAsyncThunk(
  'analytics/fetchMonthlyStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/admin/metrics/monthly');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch monthly statistics');
    }
  }
);

// Fetch HR Performance
export const fetchHRPerformance = createAsyncThunk(
  'analytics/fetchHRPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/admin/metrics/hr-performance');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch HR performance');
    }
  }
);

// Fetch HR-Specific Metrics (for HR users)
export const fetchHRMetrics = createAsyncThunk(
  'analytics/fetchHRMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/hr/metrics');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch HR metrics');
    }
  }
);

// Analytics Slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.overviewMetrics = null;
      state.monthlyStatistics = null;
      state.hrPerformance = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Overview Metrics
    builder
      .addCase(fetchOverviewMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.overviewMetrics = action.payload;
        state.error = null;
      })
      .addCase(fetchOverviewMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Monthly Statistics
    builder
      .addCase(fetchMonthlyStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyStatistics = action.payload;
        state.error = null;
      })
      .addCase(fetchMonthlyStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch HR Performance
    builder
      .addCase(fetchHRPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.hrPerformance = action.payload;
        state.error = null;
      })
      .addCase(fetchHRPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch HR Metrics
    builder
      .addCase(fetchHRMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.overviewMetrics = action.payload;
        state.error = null;
      })
      .addCase(fetchHRMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const { clearError, clearAnalytics } = analyticsSlice.actions;

// Selectors
export const selectOverviewMetrics = (state) => state.analytics.overviewMetrics;
export const selectMonthlyStatistics = (state) => state.analytics.monthlyStatistics;
export const selectHRPerformance = (state) => state.analytics.hrPerformance;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;

export default analyticsSlice.reducer;
