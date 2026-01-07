// Reports Slice - Admin Reports State Management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Initial State
const initialState = {
  // Candidate Report
  candidateReport: null,
  candidateReportLoading: false,
  candidateReportError: null,
  candidateFilters: {
    dateFrom: '',
    dateTo: '',
    active: null,
    hrId: '',
    openingId: '',
  },

  // Job Opening Report
  jobOpeningReport: null,
  jobOpeningReportLoading: false,
  jobOpeningReportError: null,
  openingFilters: {
    dateFrom: '',
    dateTo: '',
    status: '',
    hrId: '',
  },

  // HR Activity Report
  hrActivityReport: null,
  hrActivityReportLoading: false,
  hrActivityReportError: null,
  activityFilters: {
    hrId: '',
    dateFrom: '',
    dateTo: '',
  },
};

// Async Thunks

// Fetch Candidate Report
export const fetchCandidateReport = createAsyncThunk(
  'reports/fetchCandidateReport',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom && filters.dateFrom.trim() !== '') params.append('dateFrom', `${filters.dateFrom}T00:00:00`);
      if (filters.dateTo && filters.dateTo.trim() !== '') params.append('dateTo', `${filters.dateTo}T23:59:59`);
      if (filters.active !== null && filters.active !== undefined && filters.active !== '') params.append('active', filters.active);
      if (filters.hrId && filters.hrId !== '') params.append('hrId', filters.hrId);
      if (filters.openingId && filters.openingId !== '') params.append('openingId', filters.openingId);

      const response = await apiService.get(`/admin/reports/candidates?${params}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch candidate report');
    }
  }
);

// Fetch Job Opening Report
export const fetchJobOpeningReport = createAsyncThunk(
  'reports/fetchJobOpeningReport',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom && filters.dateFrom.trim() !== '') params.append('dateFrom', `${filters.dateFrom}T00:00:00`);
      if (filters.dateTo && filters.dateTo.trim() !== '') params.append('dateTo', `${filters.dateTo}T23:59:59`);
      if (filters.status && filters.status !== '') params.append('status', filters.status);
      if (filters.hrId && filters.hrId !== '') params.append('hrId', filters.hrId);

      const response = await apiService.get(`/admin/reports/openings?${params}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch job opening report');
    }
  }
);

// Fetch HR Activity Report
export const fetchHrActivityReport = createAsyncThunk(
  'reports/fetchHrActivityReport',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.hrId && filters.hrId !== '') params.append('hrId', filters.hrId);
      if (filters.dateFrom && filters.dateFrom.trim() !== '') params.append('dateFrom', `${filters.dateFrom}T00:00:00`);
      if (filters.dateTo && filters.dateTo.trim() !== '') params.append('dateTo', `${filters.dateTo}T23:59:59`);

      const response = await apiService.get(`/admin/reports/hr-activity?${params}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch HR activity report');
    }
  }
);

// Export Reports
export const exportCandidateReport = createAsyncThunk(
  'reports/exportCandidateReport',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', `${filters.dateFrom}T00:00:00`);
      if (filters.dateTo) params.append('dateTo', `${filters.dateTo}T23:59:59`);
      if (filters.active !== null && filters.active !== undefined) params.append('active', filters.active);
      if (filters.hrId) params.append('hrId', filters.hrId);
      if (filters.openingId) params.append('openingId', filters.openingId);

      const { api } = await import('../../services/api');
      const response = await api.get(`/admin/reports/candidates/export?${params}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `candidate-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return 'exported';
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to export candidate report');
    }
  }
);

export const exportJobOpeningReport = createAsyncThunk(
  'reports/exportJobOpeningReport',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', `${filters.dateFrom}T00:00:00`);
      if (filters.dateTo) params.append('dateTo', `${filters.dateTo}T23:59:59`);
      if (filters.status) params.append('status', filters.status);
      if (filters.hrId) params.append('hrId', filters.hrId);

      const { api } = await import('../../services/api');
      const response = await api.get(`/admin/reports/openings/export?${params}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `job-opening-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return 'exported';
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to export job opening report');
    }
  }
);

export const exportHrActivityReport = createAsyncThunk(
  'reports/exportHrActivityReport',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.hrId) params.append('hrId', filters.hrId);
      if (filters.dateFrom) params.append('dateFrom', `${filters.dateFrom}T00:00:00`);
      if (filters.dateTo) params.append('dateTo', `${filters.dateTo}T23:59:59`);

      const { api } = await import('../../services/api');
      const response = await api.get(`/admin/reports/hr-activity/export?${params}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hr-activity-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return 'exported';
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to export HR activity report');
    }
  }
);

// Reports Slice
const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // Set candidate filters
    setCandidateFilters: (state, action) => {
      state.candidateFilters = { ...state.candidateFilters, ...action.payload };
    },
    // Set opening filters
    setOpeningFilters: (state, action) => {
      state.openingFilters = { ...state.openingFilters, ...action.payload };
    },
    // Set activity filters
    setActivityFilters: (state, action) => {
      state.activityFilters = { ...state.activityFilters, ...action.payload };
    },
    // Clear candidate report and filters
    clearCandidateReport: (state) => {
      state.candidateReport = null;
      state.candidateReportError = null;
    },
    // Clear opening report and filters
    clearJobOpeningReport: (state) => {
      state.jobOpeningReport = null;
      state.jobOpeningReportError = null;
    },
    // Clear activity report and filters
    clearHrActivityReport: (state) => {
      state.hrActivityReport = null;
      state.hrActivityReportError = null;
    },
    // Clear errors
    clearCandidateReportError: (state) => {
      state.candidateReportError = null;
    },
    clearJobOpeningReportError: (state) => {
      state.jobOpeningReportError = null;
    },
    clearHrActivityReportError: (state) => {
      state.hrActivityReportError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Candidate Report
    builder
      .addCase(fetchCandidateReport.pending, (state) => {
        state.candidateReportLoading = true;
        state.candidateReportError = null;
      })
      .addCase(fetchCandidateReport.fulfilled, (state, action) => {
        state.candidateReportLoading = false;
        state.candidateReport = action.payload;
      })
      .addCase(fetchCandidateReport.rejected, (state, action) => {
        state.candidateReportLoading = false;
        state.candidateReportError = action.payload;
      });

    // Fetch Job Opening Report
    builder
      .addCase(fetchJobOpeningReport.pending, (state) => {
        state.jobOpeningReportLoading = true;
        state.jobOpeningReportError = null;
      })
      .addCase(fetchJobOpeningReport.fulfilled, (state, action) => {
        state.jobOpeningReportLoading = false;
        state.jobOpeningReport = action.payload;
      })
      .addCase(fetchJobOpeningReport.rejected, (state, action) => {
        state.jobOpeningReportLoading = false;
        state.jobOpeningReportError = action.payload;
      });

    // Fetch HR Activity Report
    builder
      .addCase(fetchHrActivityReport.pending, (state) => {
        state.hrActivityReportLoading = true;
        state.hrActivityReportError = null;
      })
      .addCase(fetchHrActivityReport.fulfilled, (state, action) => {
        state.hrActivityReportLoading = false;
        state.hrActivityReport = action.payload;
      })
      .addCase(fetchHrActivityReport.rejected, (state, action) => {
        state.hrActivityReportLoading = false;
        state.hrActivityReportError = action.payload;
      });
  },
});

// Actions
export const {
  setCandidateFilters,
  setOpeningFilters,
  setActivityFilters,
  clearCandidateReport,
  clearJobOpeningReport,
  clearHrActivityReport,
  clearCandidateReportError,
  clearJobOpeningReportError,
  clearHrActivityReportError,
} = reportsSlice.actions;

// Selectors
export const selectCandidateReport = (state) => state.reports.candidateReport;
export const selectCandidateReportLoading = (state) => state.reports.candidateReportLoading;
export const selectCandidateReportError = (state) => state.reports.candidateReportError;
export const selectCandidateFilters = (state) => state.reports.candidateFilters;

export const selectJobOpeningReport = (state) => state.reports.jobOpeningReport;
export const selectJobOpeningReportLoading = (state) => state.reports.jobOpeningReportLoading;
export const selectJobOpeningReportError = (state) => state.reports.jobOpeningReportError;
export const selectOpeningFilters = (state) => state.reports.openingFilters;

export const selectHrActivityReport = (state) => state.reports.hrActivityReport;
export const selectHrActivityReportLoading = (state) => state.reports.hrActivityReportLoading;
export const selectHrActivityReportError = (state) => state.reports.hrActivityReportError;
export const selectActivityFilters = (state) => state.reports.activityFilters;

export default reportsSlice.reducer;
