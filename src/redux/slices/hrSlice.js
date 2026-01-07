// HR Slice - HR Management State (Admin Only)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Initial State
const initialState = {
  hrUsers: [],
  currentHR: null,
  total: 0,
  page: 0,
  pageSize: 10,
  loading: false,
  error: null,
};

// Async Thunks

// Fetch All HR Users
export const fetchHRUsers = createAsyncThunk(
  'hr/fetchHRUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/admin/hr');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch HR users');
    }
  }
);

// Fetch HR Users Paginated
export const fetchHRUsersPaginated = createAsyncThunk(
  'hr/fetchHRUsersPaginated',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/admin/hr/paginated', {
        params: { page, size }
      });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch HR users');
    }
  }
);

// Fetch Single HR
export const fetchHRById = createAsyncThunk(
  'hr/fetchHRById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/admin/hr/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch HR user');
    }
  }
);

// Create HR User
export const createHRUser = createAsyncThunk(
  'hr/createHRUser',
  async (hrData, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/admin/hr', hrData);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to create HR user');
    }
  }
);

// Update HR User
export const updateHRUser = createAsyncThunk(
  'hr/updateHRUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/admin/hr/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update HR user');
    }
  }
);

// Update HR Status (Activate/Deactivate)
export const updateHRStatus = createAsyncThunk(
  'hr/updateHRStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      await apiService.patch(`/admin/hr/${id}/status`, null, {
        params: { active }
      });
      return { id, active };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update HR status');
    }
  }
);

// HR Slice
const hrSlice = createSlice({
  name: 'hr',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentHR: (state) => {
      state.currentHR = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch HR Users
    builder
      .addCase(fetchHRUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.hrUsers = action.payload;
        state.total = action.payload.length;
        state.error = null;
      })
      .addCase(fetchHRUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch HR Users Paginated
    builder
      .addCase(fetchHRUsersPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRUsersPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.hrUsers = action.payload.content || action.payload.data || [];
        state.total = action.payload.totalElements || action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchHRUsersPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Single HR
    builder
      .addCase(fetchHRById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHR = action.payload;
        state.error = null;
      })
      .addCase(fetchHRById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create HR User
    builder
      .addCase(createHRUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHRUser.fulfilled, (state, action) => {
        state.loading = false;
        state.hrUsers.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createHRUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update HR User
    builder
      .addCase(updateHRUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHRUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hrUsers.findIndex(hr => hr.id === action.payload.id);
        if (index !== -1) {
          state.hrUsers[index] = action.payload;
        }
        if (state.currentHR?.id === action.payload.id) {
          state.currentHR = action.payload;
        }
        state.error = null;
      })
      .addCase(updateHRUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update HR Status
    builder
      .addCase(updateHRStatus.fulfilled, (state, action) => {
        const { id, active } = action.payload;
        const hr = state.hrUsers.find(hr => hr.id === id);
        if (hr) {
          hr.active = active;
        }
        if (state.currentHR?.id === id) {
          state.currentHR.active = active;
        }
      });
  },
});

// Actions
export const { clearError, clearCurrentHR, setPage } = hrSlice.actions;

// Selectors
export const selectHRUsers = (state) => state.hr.hrUsers;
export const selectCurrentHR = (state) => state.hr.currentHR;
export const selectHRTotal = (state) => state.hr.total;
export const selectHRPage = (state) => state.hr.page;
export const selectHRPageSize = (state) => state.hr.pageSize;
export const selectHRLoading = (state) => state.hr.loading;
export const selectHRError = (state) => state.hr.error;

export default hrSlice.reducer;
