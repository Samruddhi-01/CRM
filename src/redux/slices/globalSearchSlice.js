import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { logout } from './authSlice';

// Async thunk for global search
export const performGlobalSearch = createAsyncThunk(
  'globalSearch/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/search/global', searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

const globalSearchSlice = createSlice({
  name: 'globalSearch',
  initialState: {
    query: '',
    results: {
      candidateResults: [],
      jobOpeningResults: [],
      hrUserResults: [],
      totalCandidates: 0,
      totalJobOpenings: 0,
      totalHRUsers: 0,
      searchTimeMs: 0
    },
    isSearching: false,
    error: null,
    searchCandidates: true,
    searchJobOpenings: true,
    searchHRUsers: false
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    toggleSearchCandidates: (state) => {
      state.searchCandidates = !state.searchCandidates;
    },
    toggleSearchJobOpenings: (state) => {
      state.searchJobOpenings = !state.searchJobOpenings;
    },
    toggleSearchHRUsers: (state) => {
      state.searchHRUsers = !state.searchHRUsers;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = {
        candidateResults: [],
        jobOpeningResults: [],
        hrUserResults: [],
        totalCandidates: 0,
        totalJobOpenings: 0,
        totalHRUsers: 0,
        searchTimeMs: 0
      };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performGlobalSearch.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(performGlobalSearch.fulfilled, (state, action) => {
        state.isSearching = false;
        state.results = action.payload;
      })
      .addCase(performGlobalSearch.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      })
      // Clear search results on logout
      .addCase(logout.fulfilled, (state) => {
        state.query = '';
        state.results = {
          candidateResults: [],
          jobOpeningResults: [],
          hrUserResults: [],
          totalCandidates: 0,
          totalJobOpenings: 0,
          totalHRUsers: 0,
          searchTimeMs: 0
        };
        state.isSearching = false;
        state.error = null;
      });
  }
});

export const {
  setQuery,
  toggleSearchCandidates,
  toggleSearchJobOpenings,
  toggleSearchHRUsers,
  clearSearch
} = globalSearchSlice.actions;

export default globalSearchSlice.reducer;
