import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { logout } from './authSlice';

// Async thunk for candidate advanced search
export const performCandidateSearch = createAsyncThunk(
  'candidateSearch/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      // Transform parameters to match backend DTO
      const transformedParams = {
        ...searchParams,
        // Rename skillMatchMode to primarySkillsMatchType
        primarySkillsMatchType: searchParams.skillMatchMode,
        skillMatchMode: undefined
      };
      
      // Only include experience filters if they have meaningful values
      if (searchParams.minExperience != null && searchParams.minExperience > 0) {
        transformedParams.minExperience = String(searchParams.minExperience);
      } else {
        transformedParams.minExperience = undefined;
      }
      
      if (searchParams.maxExperience != null && searchParams.maxExperience > 0) {
        transformedParams.maxExperience = String(searchParams.maxExperience);
      } else {
        transformedParams.maxExperience = undefined;
      }
      
      // Convert numeric values to strings for backend
      if (searchParams.minCurrentPackage != null) {
        transformedParams.minCurrentPackage = String(searchParams.minCurrentPackage);
      }
      if (searchParams.maxCurrentPackage != null) {
        transformedParams.maxCurrentPackage = String(searchParams.maxCurrentPackage);
      }
      if (searchParams.minExpectedCTC != null) {
        transformedParams.minExpectedCTC = String(searchParams.minExpectedCTC);
      }
      if (searchParams.maxExpectedCTC != null) {
        transformedParams.maxExpectedCTC = String(searchParams.maxExpectedCTC);
      }
      
      const response = await apiService.post('/api/candidates/advanced-search', transformedParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

const candidateSearchSlice = createSlice({
  name: 'candidateSearch',
  initialState: {
    filters: {
      textQuery: '',
      primarySkills: [],
      skillMatchMode: 'ANY',
      secondarySkills: [],
      minExperience: null,
      maxExperience: null,
      minCurrentPackage: null,
      maxCurrentPackage: null,
      minExpectedCTC: null,
      maxExpectedCTC: null,
      currentLocations: [],
      statuses: [],
      sources: [],
      createdFrom: null,
      createdTo: null
    },
    pagination: {
      page: 0,
      size: 20,
      sortBy: 'createdAt',
      sortDirection: 'DESC'
    },
    results: {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: false,
      empty: true,
      searchTimeMs: 0
    },
    savedSearches: [],
    isSearching: false,
    error: null
  },
  reducers: {
    updateFilter: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        textQuery: '',
        primarySkills: [],
        skillMatchMode: 'ANY',
        secondarySkills: [],
        minExperience: null,
        maxExperience: null,
        minCurrentPackage: null,
        maxCurrentPackage: null,
        minExpectedCTC: null,
        maxExpectedCTC: null,
        currentLocations: [],
        statuses: [],
        sources: [],
        createdFrom: null,
        createdTo: null
      };
      state.results = {
        content: [],
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: false,
        empty: true,
        searchTimeMs: 0
      };
    },
    changePage: (state, action) => {
      state.pagination.page = action.payload;
    },
    changeSort: (state, action) => {
      const { field, direction } = action.payload;
      state.pagination.sortBy = field;
      state.pagination.sortDirection = direction;
    },
    saveCurrentSearch: (state, action) => {
      const searchName = action.payload;
      const newSearch = {
        id: Date.now(),
        name: searchName,
        filters: { ...state.filters },
        savedAt: new Date().toISOString()
      };
      state.savedSearches.push(newSearch);
      // Save to localStorage
      localStorage.setItem('candidateSavedSearches', JSON.stringify(state.savedSearches));
    },
    loadSavedSearch: (state, action) => {
      const savedSearch = action.payload;
      state.filters = { ...savedSearch.filters };
    },
    deleteSavedSearch: (state, action) => {
      const searchId = action.payload;
      state.savedSearches = state.savedSearches.filter(s => s.id !== searchId);
      // Update localStorage
      localStorage.setItem('candidateSavedSearches', JSON.stringify(state.savedSearches));
    },
    loadSavedSearchesFromStorage: (state) => {
      const saved = localStorage.getItem('candidateSavedSearches');
      if (saved) {
        state.savedSearches = JSON.parse(saved);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performCandidateSearch.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(performCandidateSearch.fulfilled, (state, action) => {
        state.isSearching = false;
        state.results = action.payload;
      })
      .addCase(performCandidateSearch.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      })
      // Reset search state on logout
      .addCase(logout.fulfilled, (state) => {
        state.filters = {
          textQuery: '',
          primarySkills: [],
          skillMatchMode: 'ANY',
          secondarySkills: [],
          minExperience: null,
          maxExperience: null,
          minCurrentPackage: null,
          maxCurrentPackage: null,
          minExpectedCTC: null,
          maxExpectedCTC: null,
          currentLocations: [],
          statuses: [],
          sources: [],
          createdFrom: null,
          createdTo: null
        };
        state.results = {
          content: [],
          page: 0,
          size: 20,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: false,
          empty: true,
          searchTimeMs: 0
        };
        state.isSearching = false;
        state.error = null;
      });
  }
});

export const {
  updateFilter,
  updateFilters,
  resetFilters,
  changePage,
  changeSort,
  saveCurrentSearch,
  loadSavedSearch,
  deleteSavedSearch,
  loadSavedSearchesFromStorage
} = candidateSearchSlice.actions;

export default candidateSearchSlice.reducer;
