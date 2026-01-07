// HR Performance Analytics Redux Slice

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hrPerformanceAPI, hrCandidatesAPI } from '../../services/hrPerformanceService';
import toast from 'react-hot-toast';

// ==================== ADMIN THUNKS ====================

/**
 * Fetch HR Performance Overview
 * ADMIN ONLY
 */
export const fetchHRPerformanceOverview = createAsyncThunk(
  'hrPerformance/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await hrPerformanceAPI.getHRPerformanceOverview();
      // Extract data from ApiResponse wrapper
      return response.data || response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch HR performance overview';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch HR Candidates (Admin viewing specific HR)
 * ADMIN ONLY
 */
export const fetchHRCandidates = createAsyncThunk(
  'hrPerformance/fetchHRCandidates',
  async ({ hrId, params }, { rejectWithValue }) => {
    try {
      const response = await hrPerformanceAPI.getHRCandidates(hrId, params);
      // Extract data from ApiResponse wrapper
      return response.data || response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch HR candidates';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update Admin Remark
 * ADMIN ONLY
 */
export const updateAdminRemark = createAsyncThunk(
  'hrPerformance/updateAdminRemark',
  async ({ candidateId, adminRemark }, { rejectWithValue }) => {
    try {
      const response = await hrPerformanceAPI.updateAdminRemark(candidateId, adminRemark);
      toast.success('Admin remark updated successfully');
      // Extract data from ApiResponse wrapper
      return response.data || response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update admin remark';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Update Candidate Status (Admin)
 * ADMIN ONLY
 */
export const updateCandidateStatusAdmin = createAsyncThunk(
  'hrPerformance/updateCandidateStatusAdmin',
  async ({ candidateId, status }, { rejectWithValue }) => {
    try {
      const response = await hrPerformanceAPI.updateCandidateStatusAdmin(candidateId, status);
      toast.success('Candidate status updated successfully');
      // Extract data from ApiResponse wrapper
      return response.data || response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update candidate status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==================== HR THUNKS ====================

/**
 * Fetch My Candidates (HR's own)
 * HR ONLY
 */
export const fetchMyCandidates = createAsyncThunk(
  'hrPerformance/fetchMyCandidates',
  async (params, { rejectWithValue }) => {
    try {
      const response = await hrCandidatesAPI.getMyCandidates(params);
      // Extract data from ApiResponse wrapper
      return response.data || response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch your candidates';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update HR Remark
 * HR ONLY
 */
export const updateHRRemark = createAsyncThunk(
  'hrPerformance/updateHRRemark',
  async ({ candidateId, hrRemark }, { rejectWithValue }) => {
    try {
      const response = await hrCandidatesAPI.updateHRRemark(candidateId, hrRemark);
      toast.success('HR remark updated successfully');
      // Extract data from ApiResponse wrapper
      return response.data || response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update HR remark';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Update Candidate Status (HR)
 * HR ONLY
 */
export const updateCandidateStatusHR = createAsyncThunk(
  'hrPerformance/updateCandidateStatusHR',
  async ({ candidateId, status }, { rejectWithValue }) => {
    try {
      const response = await hrCandidatesAPI.updateCandidateStatusHR(candidateId, status);
      toast.success('Candidate status updated successfully');
      // Extract data from ApiResponse wrapper
      return response.data || response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update candidate status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Admin: HR Overview
  hrOverview: [],
  hrOverviewLoading: false,
  hrOverviewError: null,
  
  // Admin: Selected HR's Candidates
  selectedHRId: null,
  selectedHRName: null,
  hrCandidates: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  hrCandidatesLoading: false,
  hrCandidatesError: null,
  
  // HR: My Candidates
  myCandidates: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  myCandidatesLoading: false,
  myCandidatesError: null,
  
  // UI State
  updateLoading: false,
};

const hrPerformanceSlice = createSlice({
  name: 'hrPerformance',
  initialState,
  reducers: {
    selectHR: (state, action) => {
      state.selectedHRId = action.payload.hrId;
      state.selectedHRName = action.payload.hrName;
    },
    clearSelectedHR: (state) => {
      state.selectedHRId = null;
      state.selectedHRName = null;
      state.hrCandidates = initialState.hrCandidates;
    },
    resetHRPerformance: () => initialState,
  },
  extraReducers: (builder) => {
    // HR Performance Overview
    builder
      .addCase(fetchHRPerformanceOverview.pending, (state) => {
        state.hrOverviewLoading = true;
        state.hrOverviewError = null;
      })
      .addCase(fetchHRPerformanceOverview.fulfilled, (state, action) => {
        state.hrOverviewLoading = false;
        state.hrOverview = action.payload;
      })
      .addCase(fetchHRPerformanceOverview.rejected, (state, action) => {
        state.hrOverviewLoading = false;
        state.hrOverviewError = action.payload;
      });

    // HR Candidates (Admin view)
    builder
      .addCase(fetchHRCandidates.pending, (state) => {
        state.hrCandidatesLoading = true;
        state.hrCandidatesError = null;
      })
      .addCase(fetchHRCandidates.fulfilled, (state, action) => {
        state.hrCandidatesLoading = false;
        state.hrCandidates = action.payload;
      })
      .addCase(fetchHRCandidates.rejected, (state, action) => {
        state.hrCandidatesLoading = false;
        state.hrCandidatesError = action.payload;
      });

    // Update Admin Remark
    builder
      .addCase(updateAdminRemark.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateAdminRemark.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update in hrCandidates list
        const index = state.hrCandidates.content.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.hrCandidates.content[index] = action.payload;
        }
      })
      .addCase(updateAdminRemark.rejected, (state) => {
        state.updateLoading = false;
      });

    // Update Candidate Status (Admin)
    builder
      .addCase(updateCandidateStatusAdmin.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateCandidateStatusAdmin.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update in hrCandidates list
        const index = state.hrCandidates.content.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.hrCandidates.content[index] = action.payload;
        }
      })
      .addCase(updateCandidateStatusAdmin.rejected, (state) => {
        state.updateLoading = false;
      });

    // My Candidates (HR view)
    builder
      .addCase(fetchMyCandidates.pending, (state) => {
        state.myCandidatesLoading = true;
        state.myCandidatesError = null;
      })
      .addCase(fetchMyCandidates.fulfilled, (state, action) => {
        state.myCandidatesLoading = false;
        state.myCandidates = action.payload;
      })
      .addCase(fetchMyCandidates.rejected, (state, action) => {
        state.myCandidatesLoading = false;
        state.myCandidatesError = action.payload;
      });

    // Update HR Remark
    builder
      .addCase(updateHRRemark.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateHRRemark.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update in myCandidates list
        const index = state.myCandidates.content.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.myCandidates.content[index] = action.payload;
        }
      })
      .addCase(updateHRRemark.rejected, (state) => {
        state.updateLoading = false;
      });

    // Update Candidate Status (HR)
    builder
      .addCase(updateCandidateStatusHR.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateCandidateStatusHR.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update in myCandidates list
        const index = state.myCandidates.content.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.myCandidates.content[index] = action.payload;
        }
      })
      .addCase(updateCandidateStatusHR.rejected, (state) => {
        state.updateLoading = false;
      });
  },
});

// Actions
export const { selectHR, clearSelectedHR, resetHRPerformance } = hrPerformanceSlice.actions;

// Selectors
export const selectHROverview = (state) => state.hrPerformance.hrOverview;
export const selectHROverviewLoading = (state) => state.hrPerformance.hrOverviewLoading;
export const selectHROverviewError = (state) => state.hrPerformance.hrOverviewError;

export const selectSelectedHRId = (state) => state.hrPerformance.selectedHRId;
export const selectSelectedHRName = (state) => state.hrPerformance.selectedHRName;
export const selectHRCandidates = (state) => state.hrPerformance.hrCandidates;
export const selectHRCandidatesLoading = (state) => state.hrPerformance.hrCandidatesLoading;
export const selectHRCandidatesError = (state) => state.hrPerformance.hrCandidatesError;

export const selectMyCandidates = (state) => state.hrPerformance.myCandidates;
export const selectMyCandidatesLoading = (state) => state.hrPerformance.myCandidatesLoading;
export const selectMyCandidatesError = (state) => state.hrPerformance.myCandidatesError;

export const selectUpdateLoading = (state) => state.hrPerformance.updateLoading;

export default hrPerformanceSlice.reducer;
