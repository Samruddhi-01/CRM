// Admin Slice - Admin Dashboard, HR Management, Audit Logs

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Initial State
const initialState = {
  // Metrics
  metrics: {
    totalCandidates: 0,
    interested: 0,
    notInterested: 0,
    pending: 0,
    totalHRs: 0,
    newThisMonth: 0,
  },
  monthlyData: [],
  weeklyData: [],
  statusDistribution: [],
  hrDistribution: [],
  
  // HR Management
  hrs: [],
  totalHRs: 0,
  currentHR: null,
  
  // Audit Logs
  auditLogs: [],
  totalLogs: 0,
  auditPage: 1,
  auditPageSize: 20,
  
  // Loading states
  metricsLoading: false,
  hrsLoading: false,
  auditLoading: false,
  
  error: null,
};

// Async Thunks

// Fetch Dashboard Metrics
export const fetchMetrics = createAsyncThunk(
  'admin/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/admin/metrics/overview');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch metrics');
    }
  }
);

// Fetch Monthly Data (for charts)
export const fetchMonthlyData = createAsyncThunk(
  'admin/fetchMonthlyData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/admin/metrics/monthly');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch monthly data');
    }
  }
);

// Fetch Weekly Data (for charts)
export const fetchWeeklyData = createAsyncThunk(
  'admin/fetchWeeklyData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/admin/metrics/weekly');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch weekly data');
    }
  }
);

// Fetch User Stats
export const fetchUserStats = createAsyncThunk(
  'admin/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/admin/stats');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch user stats');
    }
  }
);

// Fetch All Users
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/admin/users');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch users');
    }
  }
);

// Fetch Dashboard Summary
export const fetchDashboardSummary = createAsyncThunk(
  'admin/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/admin/dashboard');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch dashboard');
    }
  }
);

// Fetch HR Metrics (for HR users)
export const fetchHRMetrics = createAsyncThunk(
  'admin/fetchHRMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/hr/metrics');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch HR metrics');
    }
  }
);

// Fetch HRs
export const fetchHRs = createAsyncThunk(
  'admin/fetchHRs',
  async ({ page, pageSize, search }, { rejectWithValue }) => {
    try {
      const params = { page, size: pageSize, search };
      const response = await apiService.get('/api/admin/hr', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch HRs');
    }
  }
);

// Create HR
export const createHR = createAsyncThunk(
  'admin/createHR',
  async (hrData, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/admin/hr', hrData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create HR');
    }
  }
);

// Update HR
export const updateHR = createAsyncThunk(
  'admin/updateHR',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/api/admin/hr/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update HR');
    }
  }
);

// Toggle HR Active Status
export const toggleHRStatus = createAsyncThunk(
  'admin/toggleHRStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(`/api/admin/hr/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle HR status');
    }
  }
);

// Fetch Audit Logs
export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async ({ page, pageSize, filters }, { rejectWithValue }) => {
    try {
      const params = { page, size: pageSize, ...filters };
      const response = await apiService.get('/api/admin/audit', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch audit logs');
    }
  }
);

// Export Candidates
export const exportCandidates = createAsyncThunk(
  'admin/exportCandidates',
  async ({ format, filters }, { rejectWithValue }) => {
    try {
      const filename = `candidates_export_${Date.now()}.${format}`;
      await apiService.download(`/api/admin/export?format=${format}`, filename);
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || 'Export failed');
    }
  }
);

// Admin Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    setAuditPage: (state, action) => {
      state.auditPage = action.payload;
    },
    
    clearCurrentHR: (state) => {
      state.currentHR = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Metrics
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = action.payload;
        state.error = null;
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.error = action.payload;
      });
    
    // Fetch Monthly Data
    builder
      .addCase(fetchMonthlyData.fulfilled, (state, action) => {
        state.monthlyData = action.payload;
      });
    
    // Fetch Weekly Data
    builder
      .addCase(fetchWeeklyData.fulfilled, (state, action) => {
        state.weeklyData = action.payload;
      });
    
    // Fetch User Stats
    builder
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.metrics.totalUsers = action.payload.totalUsers;
        state.metrics.adminCount = action.payload.adminCount;
        state.metrics.hrCount = action.payload.hrCount;
      });
    
    // Fetch All Users
    builder
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.hrs = action.payload;
        state.totalHRs = action.payload.length;
      });
    
    // Fetch Dashboard Summary
    builder
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.metrics = { ...state.metrics, ...action.payload };
      });
    
    // Fetch HR Metrics (for HR users)
    builder
      .addCase(fetchHRMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.error = null;
      })
      .addCase(fetchHRMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = action.payload;
        state.error = null;
      })
      .addCase(fetchHRMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.error = action.payload;
      });
    
    // Fetch HRs
    builder
      .addCase(fetchHRs.pending, (state) => {
        state.hrsLoading = true;
        state.error = null;
      })
      .addCase(fetchHRs.fulfilled, (state, action) => {
        state.hrsLoading = false;
        state.hrs = action.payload.content || action.payload.data || [];
        state.totalHRs = action.payload.totalElements || action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchHRs.rejected, (state, action) => {
        state.hrsLoading = false;
        state.error = action.payload;
      });
    
    // Create HR
    builder
      .addCase(createHR.fulfilled, (state, action) => {
        state.hrs.unshift(action.payload);
        state.totalHRs += 1;
      });
    
    // Update HR
    builder
      .addCase(updateHR.fulfilled, (state, action) => {
        const index = state.hrs.findIndex(hr => hr.id === action.payload.id);
        if (index !== -1) {
          state.hrs[index] = action.payload;
        }
      });
    
    // Toggle HR Status
    builder
      .addCase(toggleHRStatus.fulfilled, (state, action) => {
        const index = state.hrs.findIndex(hr => hr.id === action.payload.id);
        if (index !== -1) {
          state.hrs[index] = action.payload;
        }
      });
    
    // Fetch Audit Logs
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.auditLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLoading = false;
        state.auditLogs = action.payload.content || action.payload.data || [];
        state.totalLogs = action.payload.totalElements || action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.auditLoading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const { clearError, setAuditPage, clearCurrentHR } = adminSlice.actions;

// Selectors
export const selectMetrics = (state) => state.admin.metrics;
export const selectMonthlyData = (state) => state.admin.monthlyData;
export const selectWeeklyData = (state) => state.admin.weeklyData;
export const selectStatusDistribution = (state) => state.admin.statusDistribution;
export const selectHRDistribution = (state) => state.admin.hrDistribution;
export const selectHRs = (state) => state.admin.hrs;
export const selectAuditLogs = (state) => state.admin.auditLogs;
export const selectMetricsLoading = (state) => state.admin.metricsLoading;
export const selectHRsLoading = (state) => state.admin.hrsLoading;
export const selectAuditLoading = (state) => state.admin.auditLoading;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;
