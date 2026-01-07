// Redux Store Configuration

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import candidatesReducer from './slices/candidatesSlice';
import adminReducer from './slices/adminSlice';
import hrReducer from './slices/hrSlice';
import uiReducer from './slices/uiSlice';
import openingsReducer from './slices/openingsSlice';
import reportsReducer from './slices/reportsSlice';
import analyticsReducer from './slices/analyticsSlice';
import globalSearchReducer from './slices/globalSearchSlice';
import candidateSearchReducer from './slices/candidateSearchSlice';
import openingSearchReducer from './slices/openingSearchSlice';
import hrPerformanceReducer from './slices/hrPerformanceSlice';

// Error Logging Middleware
const errorLoggingMiddleware = (storeAPI) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux Error:', error);
    storeAPI.dispatch({
      type: 'ui/addToast',
      payload: {
        message: 'An unexpected error occurred',
        type: 'error',
      },
    });
    throw error;
  }
};

// Toast Notification Middleware - Auto-dispatch toasts on async rejections
const toastMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  
  // Handle rejected async actions (exclude auth/checkAuth - handled silently)
  if (action.type.endsWith('/rejected') && action.payload && action.type !== 'auth/checkAuth/rejected') {
    storeAPI.dispatch({
      type: 'ui/addToast',
      payload: {
        message: action.payload,
        type: 'error',
        duration: 5000,
      },
    });
  }
  
  // Handle fulfilled async actions that indicate success
  if (action.type.endsWith('/fulfilled')) {
    if (action.type.includes('create') || action.type.includes('update') || action.type.includes('delete')) {
      let message = 'Operation completed successfully';
      
      if (action.type.includes('createCandidate')) {
        message = 'Candidate created successfully';
      } else if (action.type.includes('updateCandidate')) {
        message = 'Candidate updated successfully';
      } else if (action.type.includes('deleteCandidate')) {
        message = 'Candidate deleted successfully';
      } else if (action.type.includes('createHR')) {
        message = 'HR created successfully';
      } else if (action.type.includes('updateHR')) {
        message = 'HR updated successfully';
      } else if (action.type.includes('createOpening')) {
        message = 'Job opening created successfully';
      } else if (action.type.includes('updateOpening')) {
        message = 'Job opening updated successfully';
      } else if (action.type.includes('deleteOpening')) {
        message = 'Job opening deleted successfully';
      } else if (action.type.includes('applyToOpening')) {
        message = 'Candidate applied successfully';
      } else if (action.type.includes('bulkUpdateStatus')) {
        message = 'Status updated successfully';
      }
      
      storeAPI.dispatch({
        type: 'ui/addToast',
        payload: {
          message,
          type: 'success',
          duration: 3000,
        },
      });
    }
  }
  
  return result;
};

// Configure Store
const store = configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidatesReducer,
    admin: adminReducer,
    hr: hrReducer,
    ui: uiReducer,
    openings: openingsReducer,
    reports: reportsReducer,
    analytics: analyticsReducer,
    globalSearch: globalSearchReducer,
    candidateSearch: candidateSearchReducer,
    openingSearch: openingSearchReducer,
    hrPerformance: hrPerformanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['ui/openConfirmDialog'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.modals.confirmDialog.onConfirm'],
      },
    }).concat(errorLoggingMiddleware, toastMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
