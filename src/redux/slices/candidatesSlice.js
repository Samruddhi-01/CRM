// Candidates Slice - Candidate Management State

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { PAGINATION } from '../../utils/constants';
import { logout } from './authSlice';

// Initial State
const initialState = {
  candidates: [],
  currentCandidate: null,
  total: 0,
  page: 0,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  filters: {
    search: '',
    status: '',
    hrId: '',
    skills: [],
    location: '',
    dateFrom: '',
    dateTo: '',
  },
  loading: false,
  error: null,
  bulkUpdateLoading: false,
};

// Async Thunks

// Fetch Candidates (Paginated & Filtered)
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (params = {}, { rejectWithValue }) => {
    try {
      const endpoint = '/api/hr/candidates';
      
      // Default values
      const queryParams = {
        page: params.page ?? 0,
        size: params.size ?? 10,
        sortBy: params.sortBy || 'createdAt',
        sortDir: params.sortDir?.toUpperCase() || 'DESC',
      };
      
      // Add optional filters only if they exist
      if (params.search) queryParams.search = params.search;
      if (params.status) queryParams.status = params.status;
      if (params.hrId) queryParams.sourceHrId = params.hrId; // Backend uses sourceHrId not hrId
      if (params.location) queryParams.location = params.location;
      // Note: dateFrom, dateTo, and dateRange are not currently supported by backend
      // They are filtered client-side if needed
      
      console.log('Fetching candidates with query params:', queryParams);
      
      const response = await apiService.get(endpoint, { params: queryParams });
      console.log('Fetch candidates response:', response.data);
      
      // Backend returns: ApiResponse<PageResponse<CandidateResponse>>
      // Structure: { success: true, data: { content: [...], totalElements: N, ... } }
      const pageData = response.data.data;
      
      if (!pageData) {
        console.error('No data in response:', response.data);
        return { content: [], totalElements: 0 };
      }
      
      console.log('Candidates page data:', pageData);
      return pageData;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to fetch candidates');
    }
  }
);

// Fetch Single Candidate
export const fetchCandidateById = createAsyncThunk(
  'candidates/fetchCandidateById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/api/hr/candidates/${id}`);
      // Returns: ApiResponse<CandidateResponse>
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch candidate');
    }
  }
);

// Create Candidate
export const createCandidate = createAsyncThunk(
  'candidates/createCandidate',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/hr/candidates', candidateData);
      // Returns: ApiResponse<CandidateResponse>
      return response.data.data;
    } catch (error) {
      // Enhanced error handling with detailed information
      const errorData = {
        message: error.message || 'Failed to create candidate',
        data: error.data,
        details: error.details || [],
        status: error.status
      };
      return rejectWithValue(errorData);
    }
  }
);

// Update Candidate
export const updateCandidate = createAsyncThunk(
  'candidates/updateCandidate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/api/hr/candidates/${id}`, data);
      // Returns: ApiResponse<CandidateResponse>
      return response.data.data;
    } catch (error) {
      // Enhanced error handling with detailed information
      const errorData = {
        message: error.message || 'Failed to update candidate',
        data: error.data,
        details: error.details || [],
        status: error.status
      };
      return rejectWithValue(errorData);
    }
  }
);

// Update Candidate Status
export const updateCandidateStatus = createAsyncThunk(
  'candidates/updateCandidateStatus',
  async ({ id, status, comment }, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(`/api/hr/candidates/${id}/status`, { 
        status, 
        comment: comment || '' 
      });
      // Returns: ApiResponse<Void> but we don't need the data
      return { id, status };
    } catch (error) {
      const errorMessage = error.message || 'Failed to update status';
      console.error('Update status error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Bulk Status Update
export const bulkUpdateStatus = createAsyncThunk(
  'candidates/bulkUpdateStatus',
  async ({ ids, status, reason }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/hr/candidates/bulk-status', { candidateIds: ids, status, reason });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Bulk update failed');
    }
  }
);

// Delete Candidate
export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id, { rejectWithValue }) => {
    try {
      await apiService.delete(`/api/hr/candidates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.data?.error || error.message || 'Failed to delete candidate');
    }
  }
);

// Fetch Candidate History
export const fetchCandidateHistory = createAsyncThunk(
  'candidates/fetchCandidateHistory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/api/candidates/${id}/history`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch history');
    }
  }
);

// Upload Resume
export const uploadResume = createAsyncThunk(
  'candidates/uploadResume',
  async ({ candidateId, file, onProgress }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await apiService.upload(`/api/candidates/${candidateId}/resume`, formData, onProgress);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Resume upload failed');
    }
  }
);

// Candidates Slice
const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to first page on filter change
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 0;
    },
    
    // Set page
    setPage: (state, action) => {
      state.page = action.payload;
    },
    
    // Set page size
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 0;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear current candidate
    clearCurrentCandidate: (state) => {
      state.currentCandidate = null;
    },
    
    // Optimistic update for status
    optimisticUpdateStatus: (state, action) => {
      const { id, status } = action.payload;
      const candidate = state.candidates.find(c => c.id === id);
      if (candidate) {
        candidate.status = status;
      }
      if (state.currentCandidate?.id === id) {
        state.currentCandidate.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Candidates
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetch candidates payload:', action.payload);
        
        // Handle PageResponse format
        state.candidates = action.payload.content || action.payload.data || [];
        state.total = action.payload.totalElements || action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch Single Candidate
    builder
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCandidate = action.payload;
        state.error = null;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Create Candidate
    builder
      .addCase(createCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Update Candidate
    builder
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.candidates.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
        if (state.currentCandidate?.id === action.payload.id) {
          state.currentCandidate = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Update Status
    builder
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
          state.candidates[index].status = status;
        }
        if (state.currentCandidate?.id === id) {
          state.currentCandidate.status = status;
        }
      });
    
    // Bulk Update
    builder
      .addCase(bulkUpdateStatus.pending, (state) => {
        state.bulkUpdateLoading = true;
      })
      .addCase(bulkUpdateStatus.fulfilled, (state) => {
        state.bulkUpdateLoading = false;
      })
      .addCase(bulkUpdateStatus.rejected, (state, action) => {
        state.bulkUpdateLoading = false;
        state.error = action.payload;
      });
    
    // Delete Candidate
    builder
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.candidates = state.candidates.filter(c => c.id !== action.payload);
        state.total -= 1;
      });
    
    // Clear all data on logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.candidates = [];
        state.currentCandidate = null;
        state.total = 0;
        state.page = 0;
        state.filters = {
          search: '',
          status: '',
          hrId: '',
          skills: [],
          location: '',
          dateFrom: '',
          dateTo: '',
        };
        state.loading = false;
        state.error = null;
        state.bulkUpdateLoading = false;
      });
  },
});

// Actions
export const {
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  clearError,
  clearCurrentCandidate,
  optimisticUpdateStatus,
} = candidatesSlice.actions;

// Selectors
export const selectCandidates = (state) => state.candidates.candidates;
export const selectCurrentCandidate = (state) => state.candidates.currentCandidate;
export const selectCandidatesTotal = (state) => state.candidates.total;
export const selectCandidatesPage = (state) => state.candidates.page;
export const selectCandidatesPageSize = (state) => state.candidates.pageSize;
export const selectCandidatesFilters = (state) => state.candidates.filters;
export const selectCandidatesLoading = (state) => state.candidates.loading;
export const selectCandidatesError = (state) => state.candidates.error;
export const selectBulkUpdateLoading = (state) => state.candidates.bulkUpdateLoading;

export default candidatesSlice.reducer;
