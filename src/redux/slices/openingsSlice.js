import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { logout } from './authSlice';

// Async thunks
export const fetchOpenings = createAsyncThunk(
  'openings/fetchOpenings',
  async ({ search = '', status = '', department = '', page = 0, size = 10, sortBy = 'createdAt', sortDir = 'DESC' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      // Only append non-empty filter values
      if (search && search.trim() !== '') params.append('search', search.trim());
      if (status && status !== '') params.append('status', status);
      if (department && department !== '') params.append('department', department);
      params.append('page', page.toString());
      params.append('size', size.toString());
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);
      
      console.log('🔍 Fetching openings with params:', Object.fromEntries(params));
      
      const response = await api.get(`/hr/openings?${params}`);
      console.log('✅ Openings fetched:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to fetch openings:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch openings');
    }
  }
);

export const fetchOpeningById = createAsyncThunk(
  'openings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hr/openings/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch opening');
    }
  }
);

export const createOpening = createAsyncThunk(
  'openings/create',
  async (openingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/hr/openings', openingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create opening');
    }
  }
);

export const updateOpening = createAsyncThunk(
  'openings/update',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hr/openings/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update opening');
    }
  }
);

export const deleteOpening = createAsyncThunk(
  'openings/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/hr/openings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete opening');
    }
  }
);

export const updateOpeningStatus = createAsyncThunk(
  'openings/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/hr/openings/${id}/status?status=${status}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const applyToOpening = createAsyncThunk(
  'openings/apply',
  async ({ openingId, candidateId, notes = '', status = 'APPLIED' }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hr/openings/${openingId}/apply`, {
        candidateId,
        notes,
        applicationStatus: status
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply candidate');
    }
  }
);

export const fetchOpeningApplications = createAsyncThunk(
  'openings/fetchApplications',
  async ({ openingId, page = 0, size = 10, sortBy = 'appliedAt', sortDir = 'DESC' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir
      });
      const response = await api.get(`/hr/openings/${openingId}/applications?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'openings/updateApplicationStatus',
  async ({ openingId, candidateId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/hr/openings/${openingId}/candidates/${candidateId}/status?status=${status}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
    }
  }
);

export const removeApplication = createAsyncThunk(
  'openings/removeApplication',
  async ({ openingId, candidateId }, { rejectWithValue }) => {
    try {
      await api.delete(`/hr/openings/${openingId}/candidates/${candidateId}`);
      return { openingId, candidateId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove application');
    }
  }
);

// Initial state
const initialState = {
  openings: [],
  currentOpening: null,
  applications: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    department: ''
  },
  sort: {
    sortBy: 'createdAt',
    sortDir: 'DESC'
  }
};

// Slice
const openingsSlice = createSlice({
  name: 'openings',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearCurrentOpening: (state) => {
      state.currentOpening = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch openings
      .addCase(fetchOpenings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenings.fulfilled, (state, action) => {
        state.loading = false;
        state.openings = action.payload.content;
        state.total = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchOpenings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch opening by id
      .addCase(fetchOpeningById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpeningById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOpening = action.payload;
      })
      .addCase(fetchOpeningById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create opening
      .addCase(createOpening.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOpening.fulfilled, (state, action) => {
        state.loading = false;
        state.openings.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createOpening.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update opening
      .addCase(updateOpening.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOpening.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.openings.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.openings[index] = action.payload;
        }
        if (state.currentOpening && state.currentOpening.id === action.payload.id) {
          state.currentOpening = action.payload;
        }
      })
      .addCase(updateOpening.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete opening
      .addCase(deleteOpening.fulfilled, (state, action) => {
        state.openings = state.openings.filter(o => o.id !== action.payload);
        state.total -= 1;
        if (state.currentOpening && state.currentOpening.id === action.payload) {
          state.currentOpening = null;
        }
      })
      
      // Update status
      .addCase(updateOpeningStatus.fulfilled, (state, action) => {
        const index = state.openings.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.openings[index] = action.payload;
        }
        if (state.currentOpening && state.currentOpening.id === action.payload.id) {
          state.currentOpening = action.payload;
        }
      })
      
      // Fetch applications
      .addCase(fetchOpeningApplications.fulfilled, (state, action) => {
        state.applications = action.payload.content;
      })
      
      // Apply to opening
      .addCase(applyToOpening.fulfilled, (state, action) => {
        state.applications.unshift(action.payload);
      })
      
      // Update application status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(a => 
          a.openingId === action.payload.openingId && 
          a.candidateId === action.payload.candidateId
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      
      // Remove application
      .addCase(removeApplication.fulfilled, (state, action) => {
        const { openingId, candidateId } = action.payload;
        state.applications = state.applications.filter(a => 
          !(a.openingId === openingId && a.candidateId === candidateId)
        );
      })
      
      // Clear all data on logout
      .addCase(logout.fulfilled, (state) => {
        state.openings = [];
        state.currentOpening = null;
        state.applications = [];
        state.total = 0;
        state.totalPages = 0;
        state.currentPage = 0;
        state.pageSize = 10;
        state.filters = {
          search: '',
          status: '',
          department: '',
        };
        state.sort = {
          field: 'createdAt',
          direction: 'DESC',
        };
        state.loading = false;
        state.error = null;
      });
  }
});

// Actions
export const { 
  setFilters, 
  setSort, 
  setPage, 
  setPageSize, 
  clearCurrentOpening, 
  clearError,
  clearApplications 
} = openingsSlice.actions;

// Selectors
export const selectOpenings = (state) => state.openings.openings;
export const selectCurrentOpening = (state) => state.openings.currentOpening;
export const selectApplications = (state) => state.openings.applications;
export const selectOpeningsLoading = (state) => state.openings.loading;
export const selectOpeningsError = (state) => state.openings.error;
export const selectOpeningsTotal = (state) => state.openings.total;
export const selectOpeningsPagination = (state) => ({
  currentPage: state.openings.currentPage,
  totalPages: state.openings.totalPages,
  pageSize: state.openings.pageSize,
  total: state.openings.total
});
export const selectOpeningsFilters = (state) => state.openings.filters;
export const selectOpeningsSort = (state) => state.openings.sort;

export default openingsSlice.reducer;