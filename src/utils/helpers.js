// Helper Utilities

import { VALIDATION, DATE_FORMATS, STATUS_LABELS } from './constants';

/**
 * Format date to display format
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  const d = new Date(date);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const month = months[d.getMonth()];
  const monthFull = monthsFull[d.getMonth()];
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  if (format === DATE_FORMATS.DISPLAY) {
    return `${month} ${day}, ${year}`;
  } else if (format === DATE_FORMATS.DISPLAY_WITH_TIME) {
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  } else if (format === DATE_FORMATS.FULL) {
    return `${monthFull} ${day}, ${year}`;
  } else if (format === DATE_FORMATS.API) {
    return `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${day}`;
  }
  
  return date;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

// Alias for backward compatibility
export const validateEmail = isValidEmail;

/**
 * Validate phone format
 */
export const isValidPhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }
  
  return true;
};

/**
 * Get status label
 */
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Sort array by property
 */
export const sortBy = (array, property, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

/**
 * Group array by property
 */
export const groupBy = (array, property) => {
  return array.reduce((acc, item) => {
    const key = item[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Parse JWT token
 */
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

export default {
  formatDate,
  isValidEmail,
  isValidPhone,
  validatePassword,
  getStatusLabel,
  truncate,
  debounce,
  formatFileSize,
  generateId,
  deepClone,
  isEmpty,
  capitalize,
  getInitials,
  calculatePercentage,
  sortBy,
  groupBy,
  parseJwt,
  isTokenExpired,
};
