// HR Performance Analytics API Service

import api from './api';

/**
 * Admin HR Performance Analytics APIs
 */
export const hrPerformanceAPI = {
  /**
   * Get HR Performance Overview
   * ADMIN ONLY
   */
  getHRPerformanceOverview: async () => {
    const response = await api.get('/api/admin/hr-performance/overview');
    return response.data;
  },

  /**
   * Get candidates for a specific HR
   * ADMIN ONLY
   */
  getHRCandidates: async (hrId, params = {}) => {
    const response = await api.get(`/api/admin/hr-performance/${hrId}/candidates`, { params });
    return response.data;
  },

  /**
   * Update admin remark
   * ADMIN ONLY
   */
  updateAdminRemark: async (candidateId, adminRemark) => {
    const response = await api.put(`/api/admin/hr-performance/candidates/${candidateId}/admin-remark`, {
      adminRemark,
    });
    return response.data;
  },

  /**
   * Update candidate status (Admin context)
   * ADMIN ONLY
   */
  updateCandidateStatusAdmin: async (candidateId, status) => {
    const response = await api.put(`/api/admin/hr-performance/candidates/${candidateId}/status`, {
      status,
    });
    return response.data;
  },
};

/**
 * HR Candidate Management APIs
 */
export const hrCandidatesAPI = {
  /**
   * Get my candidates (HR's own)
   * HR ONLY
   */
  getMyCandidates: async (params = {}) => {
    const response = await api.get('/api/hr/my-candidates', { params });
    return response.data;
  },

  /**
   * Update HR remark
   * HR ONLY - own candidates
   */
  updateHRRemark: async (candidateId, hrRemark) => {
    const response = await api.put(`/api/hr/my-candidates/${candidateId}/hr-remark`, {
      hrRemark,
    });
    return response.data;
  },

  /**
   * Update candidate status (HR context)
   * HR ONLY - own candidates
   */
  updateCandidateStatusHR: async (candidateId, status) => {
    const response = await api.put(`/api/hr/my-candidates/${candidateId}/status`, {
      status,
    });
    return response.data;
  },
};
