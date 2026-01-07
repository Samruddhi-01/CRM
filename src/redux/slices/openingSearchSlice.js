import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { logout } from './authSlice';

// Async thunk for opening advanced search
export const performOpeningSearch = createAsyncThunk(
  'openingSearch/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      // Transform parameters to match backend DTO
      const transformedParams = {
        ...searchParams,
        // Convert numeric values to strings for backend
        minExperience: searchParams.minExperience != null ? String(searchParams.minExperience) : null,
        maxExperience: searchParams.maxExperience != null ? String(searchParams.maxExperience) : null,
        minSalary: searchParams.minSalary != null ? String(searchParams.minSalary) : null,
        maxSalary: searchParams.maxSalary != null ? String(searchParams.maxSalary) : null
      };
      
      const response = await apiService.post('/api/openings/advanced-search', transformedParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

const openingSearchSlice = createSlice({
  name: 'openingSearch',
  initialState: {
    filters: {
      textQuery: '',
      departments: [],
      types: [],
      locations: [],
      skills: [],
      minExperience: null,
      maxExperience: null,
      minSalary: null,
      maxSalary: null,
      statuses: [],
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
        departments: [],
        types: [],
        locations: [],
        skills: [],
        minExperience: null,
        maxExperience: null,
        minSalary: null,
        maxSalary: null,
        statuses: [],
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
      localStorage.setItem('openingSavedSearches', JSON.stringify(state.savedSearches));
    },
    loadSavedSearch: (state, action) => {
      const savedSearch = action.payload;
      state.filters = { ...savedSearch.filters };
    },
    deleteSavedSearch: (state, action) => {
      const searchId = action.payload;
      state.savedSearches = state.savedSearches.filter(s => s.id !== searchId);
      localStorage.setItem('openingSavedSearches', JSON.stringify(state.savedSearches));
    },
    loadSavedSearchesFromStorage: (state) => {
      const saved = localStorage.getItem('openingSavedSearches');
      if (saved) {
        state.savedSearches = JSON.parse(saved);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performOpeningSearch.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(performOpeningSearch.fulfilled, (state, action) => {
        state.isSearching = false;
        state.results = action.payload;
      })
      .addCase(performOpeningSearch.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      })
      // Reset search state on logout
      .addCase(logout.fulfilled, (state) => {
        state.filters = {
          textQuery: '',
          departments: [],
          types: [],
          locations: [],
          skills: [],
          minExperience: null,
          maxExperience: null,
          minSalary: null,
          maxSalary: null,
          statuses: [],
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
} = openingSearchSlice.actions;

export default openingSearchSlice.reducer;
