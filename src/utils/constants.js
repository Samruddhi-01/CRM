// Application Constants

// API Base URL - Updated to match backend structure
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// User Roles - Must match backend Role enum exactly
export const ROLES = {
  ADMIN: 'ADMIN',
  HR: 'HR',
};

// Candidate Status Enum
export const CANDIDATE_STATUS = {
  PENDING: 'PENDING',
  INTERESTED: 'INTERESTED',
  NOT_INTERESTED: 'NOT_INTERESTED',
  TELL_LATER: 'TELL_LATER',
  CONTACTED: 'CONTACTED',
  OFFERED: 'OFFERED',
  HIRED: 'HIRED',
};

// Status Display Labels
export const STATUS_LABELS = {
  [CANDIDATE_STATUS.PENDING]: 'Pending',
  [CANDIDATE_STATUS.INTERESTED]: 'Interested',
  [CANDIDATE_STATUS.NOT_INTERESTED]: 'Not Interested',
  [CANDIDATE_STATUS.TELL_LATER]: 'Tell Later',
  [CANDIDATE_STATUS.CONTACTED]: 'Contacted',
  [CANDIDATE_STATUS.OFFERED]: 'Offered',
  [CANDIDATE_STATUS.HIRED]: 'Hired',
};

// Audit Actions
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
};

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s()+-]+$/,
  PASSWORD_MIN_LENGTH: 8,
};

// Job Opening Status Enum
export const OPENING_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  ON_HOLD: 'ON_HOLD',
  DRAFT: 'DRAFT',
};

// Application Status Enum
export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  REVIEWING: 'REVIEWING',
  SHORTLISTED: 'SHORTLISTED',
  REJECTED: 'REJECTED',
  HIRED: 'HIRED',
};

// Opening Status Display Labels
export const OPENING_STATUS_LABELS = {
  [OPENING_STATUS.ACTIVE]: 'Active',
  [OPENING_STATUS.CLOSED]: 'Closed',
  [OPENING_STATUS.ON_HOLD]: 'On Hold',
  [OPENING_STATUS.DRAFT]: 'Draft',
};

// Application Status Display Labels
export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.APPLIED]: 'Applied',
  [APPLICATION_STATUS.REVIEWING]: 'Reviewing',
  [APPLICATION_STATUS.SHORTLISTED]: 'Shortlisted',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
  [APPLICATION_STATUS.HIRED]: 'Hired',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  FULL: 'MMMM DD, YYYY',
};

// Toast Notification Duration
export const TOAST_DURATION = 5000; // 5 seconds

// JWT Token Expiry
export const TOKEN_EXPIRY = {
  ACCESS: 60 * 60, // 1 hour in seconds
  REFRESH: 7 * 24 * 60 * 60, // 7 days in seconds
};

const constants = {
  API_BASE_URL,
  ROLES,
  CANDIDATE_STATUS,
  STATUS_LABELS,
  OPENING_STATUS,
  APPLICATION_STATUS,
  OPENING_STATUS_LABELS,
  APPLICATION_STATUS_LABELS,
  AUDIT_ACTIONS,
  PAGINATION,
  STORAGE_KEYS,
  FILE_UPLOAD,
  VALIDATION,
  DATE_FORMATS,
  TOAST_DURATION,
  TOKEN_EXPIRY,
};

export default constants;
