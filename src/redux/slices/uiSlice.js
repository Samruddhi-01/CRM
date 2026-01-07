// UI Slice - Global UI State (Modals, Notifications, Loading)

import { createSlice } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';

// Initial State
const initialState = {
  // Global loading indicator
  globalLoading: false,
  
  // Toast notifications
  toasts: [],
  
  // Modals
  modals: {
    confirmDialog: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
    },
    candidateForm: {
      isOpen: false,
      mode: 'create', // 'create' | 'edit'
      candidateId: null,
    },
    hrForm: {
      isOpen: false,
      mode: 'create',
      hrId: null,
    },
    statusUpdate: {
      isOpen: false,
      candidateId: null,
      currentStatus: null,
    },
  },
  
  // Sidebar
  sidebarCollapsed: false,
  
  // Theme
  theme: 'light',
};

// UI Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Global Loading
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    // Toast Notifications
    addToast: (state, action) => {
      const { message, type = 'info', duration = 5000 } = action.payload;
      state.toasts.push({
        id: generateId(),
        message,
        type, // 'success' | 'error' | 'warning' | 'info'
        duration,
        timestamp: Date.now(),
      });
    },
    
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    
    // Confirm Dialog
    openConfirmDialog: (state, action) => {
      state.modals.confirmDialog = {
        isOpen: true,
        ...action.payload,
      };
    },
    
    closeConfirmDialog: (state) => {
      state.modals.confirmDialog = initialState.modals.confirmDialog;
    },
    
    // Candidate Form Modal
    openCandidateForm: (state, action) => {
      const { mode = 'create', candidateId = null } = action.payload || {};
      state.modals.candidateForm = {
        isOpen: true,
        mode,
        candidateId,
      };
    },
    
    closeCandidateForm: (state) => {
      state.modals.candidateForm = initialState.modals.candidateForm;
    },
    
    // HR Form Modal
    openHRForm: (state, action) => {
      const { mode = 'create', hrId = null } = action.payload || {};
      state.modals.hrForm = {
        isOpen: true,
        mode,
        hrId,
      };
    },
    
    closeHRForm: (state) => {
      state.modals.hrForm = initialState.modals.hrForm;
    },
    
    // Status Update Modal
    openStatusUpdateModal: (state, action) => {
      const { candidateId, currentStatus } = action.payload;
      state.modals.statusUpdate = {
        isOpen: true,
        candidateId,
        currentStatus,
      };
    },
    
    closeStatusUpdateModal: (state) => {
      state.modals.statusUpdate = initialState.modals.statusUpdate;
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    closeSidebar: (state) => {
      state.sidebarCollapsed = true;
    },
    
    openSidebar: (state) => {
      state.sidebarCollapsed = false;
    },
    
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

// Actions
export const {
  setGlobalLoading,
  addToast,
  removeToast,
  clearAllToasts,
  openConfirmDialog,
  closeConfirmDialog,
  openCandidateForm,
  closeCandidateForm,
  openHRForm,
  closeHRForm,
  openStatusUpdateModal,
  closeStatusUpdateModal,
  toggleSidebar,
  setSidebarCollapsed,
  closeSidebar,
  openSidebar,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

// Selectors
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectToasts = (state) => state.ui.toasts;
export const selectConfirmDialog = (state) => state.ui.modals.confirmDialog;
export const selectCandidateFormModal = (state) => state.ui.modals.candidateForm;
export const selectHRFormModal = (state) => state.ui.modals.hrForm;
export const selectStatusUpdateModal = (state) => state.ui.modals.statusUpdate;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;
