import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
import '../styles/components/unified-table.css';
import '../styles/pages/candidates-unified.css';
import {
  fetchCandidates,
  deleteCandidate,
  updateCandidateStatus,
  selectCandidates,
  selectCandidatesLoading,
  selectCandidatesTotal,
  selectCandidatesPage,
  setPage,
} from '../redux/slices/candidatesSlice';
import { selectUserRole, selectUser } from '../redux/slices/authSlice';
import { CANDIDATE_STATUS, ROLES } from '../utils/constants';
import '../styles/pages/candidates.css';

/**
 * Opens WhatsApp chat for a given phone number
 * @param {string} phone - Phone number (may contain non-digits)
 * @param {string} name - Candidate name for logging
 * @returns {void}
 * 
 * Test cases:
 * - '+91-8411900207' -> https://wa.me/918411900207
 * - '8411900207' -> https://wa.me/8411900207
 * - '(841)190-0207' -> https://wa.me/8411900207
 */
const openWhatsApp = (phone, name) => {
  if (!phone) {
    toast.error('Phone number not available');
    return;
  }
  
  const cleaned = String(phone).replace(/\D/g, '');
  
  if (cleaned.length < 6) {
    toast.error('Invalid phone number');
    return;
  }
  
  const url = `https://wa.me/${cleaned}`;
  window.open(url, '_blank');
};

const Candidates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const candidates = useSelector(selectCandidates);
  const loading = useSelector(selectCandidatesLoading);
  const total = useSelector(selectCandidatesTotal);
  const currentPage = useSelector(selectCandidatesPage);
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Calculate total pages using itemsPerPage (not Redux pageSize)
  const totalPages = Math.ceil(total / itemsPerPage);
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [remarkValue, setRemarkValue] = useState('');
  const [showRemarkPopup, setShowRemarkPopup] = useState(false);
  const [popupRemarkText, setPopupRemarkText] = useState('');
  
  useEffect(() => {
    console.log('Remark Popup State Changed:', showRemarkPopup);
    console.log('Popup Text:', popupRemarkText);
  }, [showRemarkPopup, popupRemarkText]);
  
  useEffect(() => {
    loadCandidates();
  }, [currentPage, itemsPerPage, filters.search, filters.status, filters.sortBy, filters.sortDir]);
  
  const loadCandidates = () => {
    const params = {
      page: currentPage,
      size: itemsPerPage,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
    };
    
    // Only add search and status if they have values
    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.status) {
      params.status = filters.status;
    }
    
    console.log('Loading candidates with params:', params);
    
    dispatch(fetchCandidates(params));
  };
  
  // Log when candidates change
  useEffect(() => {
    console.log('Candidates updated:', candidates);
    console.log('Total candidates:', total);
    console.log('Current page:', currentPage);
  }, [candidates, total, currentPage]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    if (currentPage !== 0) {
      dispatch(setPage(0));
    } else {
      loadCandidates();
    }
  };
  
  const handleRemarkEdit = (candidateId, currentRemark) => {
    setEditingRemarkId(candidateId);
    setRemarkValue(currentRemark || '');
  };

  const handleRemarkSave = async (candidateId) => {
    try {
      // Get token from correct storage key
      const token = localStorage.getItem('auth_token');
      
      console.log('🔧 Updating admin remark for candidate:', candidateId);
      console.log('📝 Remark value:', remarkValue);
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await fetch(`https://crmapi.zerlak.com/api/hr/candidates/${candidateId}/admin-remark`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ adminRemark: remarkValue })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      // Get response text first
      const responseText = await response.text();
      console.log('📦 Response text:', responseText);
      
      // Try to parse as JSON
      let data = null;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log('📦 Parsed data:', data);
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          console.error('Response was:', responseText);
        }
      }

      if (!response.ok) {
        const errorMessage = data?.message || `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      toast.success('Remark updated successfully!', {
        duration: 3000,
        position: 'top-center',
      });
      setEditingRemarkId(null);
      loadCandidates();
    } catch (error) {
      console.error('❌ Error updating remark:', error);
      toast.error(error.message || 'Failed to update remark', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const handleRemarkCancel = () => {
    setEditingRemarkId(null);
    setRemarkValue('');
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      console.log('🔄 Updating status:', { candidateId, newStatus });
      
      // Prepare the request with comment
      const request = { 
        id: candidateId, 
        status: newStatus,
        comment: newStatus === 'NOT_INTERESTED' || newStatus === 'TELL_LATER' 
          ? 'Status updated from candidates list' 
          : ''
      };
      
      console.log('📤 Status update request:', request);
      
      await dispatch(updateCandidateStatus(request)).unwrap();
      
      toast.success('Candidate status updated successfully!', {
        duration: 3000,
        position: 'top-center',
      });
      loadCandidates();
      console.log('✅ Status updated successfully');
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      
      // Extract error message
      let errorMessage = 'Failed to update status!';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
      
      // Reload candidates to reset the select value
      loadCandidates();
    }
  };
  
  const handleDelete = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await dispatch(deleteCandidate(candidateId)).unwrap();
        toast.success('Candidate deleted successfully');
        loadCandidates();
      } catch (error) {
        console.error('Failed to delete candidate:', error);
        toast.error(error || 'Failed to delete candidate');
      }
    }
  };
  
  const handleEdit = (candidateId) => {
    navigate(`/candidates/${candidateId}`);
  };
  
  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetailsModal(true);
  };
  
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCandidate(null);
  };
  
  const getStatusBadgeVariant = (status) => {
    const variants = {
      [CANDIDATE_STATUS.INTERESTED]: 'success',
      [CANDIDATE_STATUS.NOT_INTERESTED]: 'danger',
      [CANDIDATE_STATUS.PENDING]: 'warning',
      [CANDIDATE_STATUS.CONTACTED]: 'info',
      [CANDIDATE_STATUS.OFFERED]: 'primary',
      [CANDIDATE_STATUS.HIRED]: 'success',
      [CANDIDATE_STATUS.TELL_LATER]: 'secondary',
    };
    return variants[status] || 'secondary';
  };
  
  return (
    <div className="app-ui candidates-page">
      <Toaster />
      
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            Candidates
            {userRole === ROLES.HR && (
              <span className="status-badge info" style={{marginLeft: '12px', fontSize: '11px'}}>
                Your Candidates Only
              </span>
            )}
          </h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn-primary-cta"
            onClick={() => navigate('/candidates/new')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Candidate
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-card">
        <form onSubmit={handleSearch}>
          <div className="filter-grid">
            <div className="form-group col-1">
              <label className="form-label">Search</label>
              <div className="search-input-wrapper">
                <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Name, email, phone..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group col-1">
              <label className="form-label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="form-select"
              >
              <option value="">All Status</option>
              <option value={CANDIDATE_STATUS.PENDING}>Pending</option>
              <option value={CANDIDATE_STATUS.INTERESTED}>Interested</option>
              <option value={CANDIDATE_STATUS.NOT_INTERESTED}>Not Interested</option>
              <option value={CANDIDATE_STATUS.CONTACTED}>Contacted</option>
              <option value={CANDIDATE_STATUS.OFFERED}>Offered</option>
              <option value={CANDIDATE_STATUS.HIRED}>Hired</option>
              <option value={CANDIDATE_STATUS.TELL_LATER}>Tell Later</option>
            </select>
            </div>

            <div className="form-group col-1">
              <label className="form-label">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="form-select"
              >
                <option value="createdAt">Date Added</option>
                <option value="firstName">Name</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="form-group col-1">
              <label className="form-label">Order</label>
              <select
                value={filters.sortDir}
                onChange={(e) => setFilters({ ...filters, sortDir: e.target.value })}
                className="form-select"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            {(filters.search || filters.status) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFilters({
                    search: '',
                    status: '',
                    sortBy: 'createdAt',
                    sortDir: 'desc',
                  });
                  dispatch(setPage(0));
                }}
              >
                Clear Filters
              </button>
            )}
            <button type="submit" className="btn btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Candidates Table */}
      <div className="candidates-table-card">
        {/* Table Header with Show Entries */}
        <div className="table-header-section">
          <div className="table-header-wrapper">
            <div className="results-info">
              <p className="results-count">
                Showing <strong>{candidates.length}</strong> of <strong>{total}</strong> candidates
              </p>
            </div>
            <div className="show-entries-wrapper">
              <label className="show-entries-label">Show entries:</label>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  dispatch(setPage(0));
                }}
                className="show-entries-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading candidates...</div>
          </div>
        ) : candidates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No candidates found</div>
            <button className="btn-base btn-primary btn-md" onClick={() => navigate('/candidates/new')}>
              Add First Candidate
            </button>
          </div>
        ) : (
          <>
            {/* Unified Table System */}
            <div className="unified-table-section">
              <div className="unified-table-wrapper">
                <table className="unified-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>REMARKS</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate) => (
                      <tr key={candidate.id}>
                        <td className="cell-name">
                          {candidate.firstName} {candidate.lastName}
                        </td>
                        <td className="cell-email">{candidate.email}</td>
                        <td className="cell-phone">{candidate.phone}</td>
                        <td className="remarks-cell">
                        {editingRemarkId === candidate.id ? (
                          <div className="remark-edit-container">
                            <input
                              type="text"
                              value={remarkValue}
                              onChange={(e) => setRemarkValue(e.target.value)}
                              className="remark-input"
                              placeholder="Enter remark..."
                              autoFocus
                            />
                            <div className="remark-actions">
                              <button
                                className="btn-base btn-primary btn-sm"
                                onClick={() => handleRemarkSave(candidate.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn-base btn-neutral btn-sm"
                                onClick={handleRemarkCancel}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="remark-display">
                            <span 
                              className={`remark-text ${candidate.adminRemark && candidate.adminRemark !== '-' ? 'clickable-remark' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                const remarkText = candidate.adminRemark;
                                console.log('Clicked remark:', remarkText);
                                if (remarkText && remarkText !== '-') {
                                  console.log('Opening popup with text:', remarkText);
                                  setPopupRemarkText(remarkText);
                                  setShowRemarkPopup(true);
                                }
                              }}
                              title={candidate.adminRemark && candidate.adminRemark !== '-' ? 'Click to view full remark' : '-'}
                            >
                              {candidate.adminRemark || '-'}
                            </span>
                            {userRole === 'ADMIN' && (
                              <button
                                className="icon-button icon-edit-remark"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemarkEdit(candidate.id, candidate.adminRemark);
                                }}
                                aria-label="Edit remark"
                                title="Edit remark"
                              />
                            )}
                          </div>
                        )}
                      </td>
                      <td className="status-cell">
                        <select
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                          className={`status-select status-${candidate.status?.toLowerCase().replace(/_/g, '-')}`}
                        >
                          <option value={CANDIDATE_STATUS.PENDING}>Pending</option>
                          <option value={CANDIDATE_STATUS.INTERESTED}>Interested</option>
                          <option value={CANDIDATE_STATUS.NOT_INTERESTED}>Not Interested</option>
                          <option value={CANDIDATE_STATUS.CONTACTED}>Contacted</option>
                          <option value={CANDIDATE_STATUS.OFFERED}>Offered</option>
                          <option value={CANDIDATE_STATUS.HIRED}>Hired</option>
                          <option value={CANDIDATE_STATUS.TELL_LATER}>Tell Later</option>
                        </select>
                      </td>
                      <td className="cell-actions">
                        <div className="unified-action-buttons">
                          <button
                            className="unified-action-btn unified-btn-edit"
                            onClick={() => handleEdit(candidate.id)}
                            title="Edit candidate"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="unified-action-btn unified-btn-view"
                            onClick={() => handleViewDetails(candidate)}
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="unified-action-btn whatsapp-btn"
                            onClick={() => openWhatsApp(candidate.phone, `${candidate.firstName} ${candidate.lastName}`)}
                            title="Message on WhatsApp"
                            aria-label={`Message ${candidate.firstName} ${candidate.lastName} on WhatsApp`}
                            disabled={!candidate.phone}
                          >
                            <svg className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                          </button>
                          {userRole === 'ADMIN' && (
                            <button
                              className="unified-action-btn unified-btn-delete"
                              onClick={() => handleDelete(candidate.id)}
                              title="Delete candidate"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

            {/* Responsive Card List for mobile */}
            <div className="table-mobile-cards">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="table-mobile-card">
                  <div className="table-mobile-row">
                    <span className="table-mobile-label">Name</span>
                    <span className="table-mobile-value">
                      <strong>{candidate.firstName} {candidate.lastName}</strong>
                    </span>
                  </div>
                  
                  <div className="table-mobile-row">
                    <span className="table-mobile-label">Email</span>
                    <span className="table-mobile-value">{candidate.email}</span>
                  </div>
                  
                  <div className="table-mobile-row">
                    <span className="table-mobile-label">Phone</span>
                    <span className="table-mobile-value">{candidate.phone || '-'}</span>
                  </div>
                  
                  <div className="table-mobile-row">
                    <span className="table-mobile-label">Remarks</span>
                    <span className="table-mobile-value">{candidate.adminRemark || '-'}</span>
                  </div>
                  
                  <div className="table-mobile-row">
                    <span className="table-mobile-label">Status</span>
                    <span className="table-mobile-value">
                      <select
                        value={candidate.status}
                        onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                        className="form-select"
                        style={{fontSize: '13px', padding: '6px 10px', minWidth: '140px'}}
                      >
                        <option value={CANDIDATE_STATUS.PENDING}>Pending</option>
                        <option value={CANDIDATE_STATUS.INTERESTED}>Interested</option>
                        <option value={CANDIDATE_STATUS.NOT_INTERESTED}>Not Interested</option>
                        <option value={CANDIDATE_STATUS.CONTACTED}>Contacted</option>
                        <option value={CANDIDATE_STATUS.OFFERED}>Offered</option>
                        <option value={CANDIDATE_STATUS.HIRED}>Hired</option>
                        <option value={CANDIDATE_STATUS.TELL_LATER}>Tell Later</option>
                      </select>
                    </span>
                  </div>

                  <div className="table-mobile-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetails(candidate)}>
                      <Eye size={16} /> View
                    </button>
                    <button className="btn btn-accent btn-sm" onClick={() => handleEdit(candidate.id)}>
                      <Edit2 size={16} /> Edit
                    </button>
                    <button 
                      className="btn btn-whatsapp btn-sm" 
                      onClick={() => openWhatsApp(candidate.phone, `${candidate.firstName} ${candidate.lastName}`)}
                      disabled={!candidate.phone}
                      title="Message on WhatsApp"
                    >
                      <svg className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </button>
                    {userRole === 'ADMIN' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(candidate.id)}>
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Centered Pagination */}
            {total > 0 && (
              <div className="pagination-wrapper-centered">
                <div className="pagination-container">
                  <button
                    className="pagination-btn pagination-btn-prev"
                    onClick={() => dispatch(setPage(currentPage - 1))}
                    disabled={currentPage === 0}
                    title="Previous Page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <span>Previous</span>
                  </button>
                  
                  <div className="pagination-numbers">
                    {[...Array(totalPages)].map((_, index) => {
                      if (
                        index === 0 ||
                        index === totalPages - 1 ||
                        (index >= currentPage - 1 && index <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={index}
                            className={`pagination-btn pagination-number ${currentPage === index ? 'active' : ''}`}
                            onClick={() => dispatch(setPage(index))}
                          >
                            {index + 1}
                          </button>
                        );
                      } else if (index === currentPage - 2 || index === currentPage + 2) {
                        return <span key={index} className="pagination-ellipsis">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    className="pagination-btn pagination-btn-next"
                    onClick={() => dispatch(setPage(currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    title="Next Page"
                  >
                    <span>Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
                
                <div className="pagination-info">
                  <span>Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong></span>
                  <span className="pagination-separator">•</span>
                  <span>Total <strong>{total}</strong> entries</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Remark Popup Modal */}
      {showRemarkPopup && (
        <div className="remark-popup-overlay" onClick={() => setShowRemarkPopup(false)}>
          <div className="remark-popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="remark-popup-header">
              <h3 className="remark-popup-title">Full Remark</h3>
              <button className="remark-popup-close" onClick={() => setShowRemarkPopup(false)}>
                ✕
              </button>
            </div>
            <div className="remark-popup-body">
              <p className="remark-popup-text">{popupRemarkText}</p>
            </div>
            <div className="remark-popup-footer">
              <button className="btn-base btn-primary btn-md" onClick={() => setShowRemarkPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Details Modal */}
      {showDetailsModal && selectedCandidate && (
        <div className="candidates-modal-overlay" onClick={closeDetailsModal}>
          <div className="candidates-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="candidates-modal-header">
              <h2 className="candidates-modal-title">Candidate Profile</h2>
              <button className="candidates-modal-close" onClick={closeDetailsModal}>
                ✕
              </button>
            </div>
            <div className="candidates-modal-body">
              {/* Personal Information */}
              <div className="detail-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">First Name</span>
                    <span className="detail-value">{selectedCandidate.firstName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Name</span>
                    <span className="detail-value">{selectedCandidate.lastName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{selectedCandidate.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{selectedCandidate.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Admin Remarks</span>
                    <span className={`detail-value ${!selectedCandidate.adminRemark ? 'empty' : ''}`}>
                      {selectedCandidate.adminRemark || 'No remarks'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current Status</span>
                    <span className={`status-badge-modal ${selectedCandidate.status.toLowerCase()}`}>
                      {selectedCandidate.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="detail-section">
                <h3 className="section-title">
                  Professional Information
                  {(() => {
                    const expLevel = selectedCandidate.experienceLevel || selectedCandidate.experience || '';
                    const isFresher = expLevel.toLowerCase().includes('fresher') || expLevel.includes('0-1');
                    return isFresher ? <span className="section-badge-inline fresher-badge-inline">🌱 Fresher</span> : null;
                  })()}
                </h3>
                <div className="detail-grid">
                  {(() => {
                    const expLevel = selectedCandidate.experienceLevel || selectedCandidate.experience || '';
                    const isFresher = expLevel.toLowerCase().includes('fresher') || expLevel.includes('0-1');
                    
                    const getExperienceBadge = (experience) => {
                      if (!experience) return 'Not provided';
                      const exp = experience.toLowerCase();
                      let badgeClass = 'exp-badge-small';
                      let icon = '💼';
                      
                      if (exp.includes('fresher') || exp.includes('0-1')) {
                        badgeClass += ' exp-fresher';
                        icon = '🌱';
                      } else if (exp.includes('entry') || exp.includes('1-2')) {
                        badgeClass += ' exp-entry';
                        icon = '📝';
                      } else if (exp.includes('junior') || exp.includes('2-4')) {
                        badgeClass += ' exp-junior';
                        icon = '🎯';
                      } else if (exp.includes('mid') || exp.includes('4-6')) {
                        badgeClass += ' exp-mid';
                        icon = '💼';
                      } else if (exp.includes('senior') || exp.includes('6-10')) {
                        badgeClass += ' exp-senior';
                        icon = '🏆';
                      } else if (exp.includes('lead') || exp.includes('10+')) {
                        badgeClass += ' exp-lead';
                        icon = '⭐';
                      } else if (exp.includes('expert') || exp.includes('15+')) {
                        badgeClass += ' exp-expert';
                        icon = '👑';
                      }
                      
                      return <span className={badgeClass}>{icon} {experience}</span>;
                    };
                    
                    return (
                      <>
                        {!isFresher && (
                          <div className="detail-item">
                            <span className="detail-label">Current Company</span>
                            <span className={`detail-value ${!selectedCandidate.company ? 'empty' : ''}`}>
                              {selectedCandidate.company || 'Not provided'}
                            </span>
                          </div>
                        )}
                        <div className="detail-item">
                          <span className="detail-label">{isFresher ? 'Desired Profile' : 'Profile/Designation'}</span>
                          <span className={`detail-value ${!selectedCandidate.profile ? 'empty' : ''}`}>
                            {selectedCandidate.profile || 'Not provided'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Experience Level</span>
                          <span className="detail-value">
                            {getExperienceBadge(expLevel)}
                          </span>
                        </div>
                        {!isFresher && (
                          <div className="detail-item">
                            <span className="detail-label">Current Package</span>
                            <span className={`detail-value ${!selectedCandidate.currentPackage ? 'empty' : ''}`}>
                              {selectedCandidate.currentPackage ? `${selectedCandidate.currentPackage} LPA` : 'Not provided'}
                            </span>
                          </div>
                        )}
                        <div className="detail-item">
                          <span className="detail-label">{isFresher ? 'Expected Starting Salary' : 'Expected CTC'}</span>
                          <span className={`detail-value ${!selectedCandidate.expectedCTC ? 'empty' : ''}`}>
                            {selectedCandidate.expectedCTC ? `${selectedCandidate.expectedCTC} LPA` : 'Not provided'}
                          </span>
                        </div>
                        {!isFresher && selectedCandidate.noticePeriod && (
                          <div className="detail-item">
                            <span className="detail-label">Notice Period</span>
                            <span className="detail-value">
                              {selectedCandidate.noticePeriod}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Employment History */}
              {(() => {
                const expLevel = selectedCandidate.experienceLevel || selectedCandidate.experience || '';
                const isFresher = expLevel.toLowerCase().includes('fresher') || expLevel.includes('0-1');
                
                if (selectedCandidate.employmentHistory) {
                  try {
                    const parsedHistory = JSON.parse(selectedCandidate.employmentHistory);
                    if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                      return (
                        <div className="detail-section">
                          <h3 className="section-title">
                            💼 Employment History
                            <span className="section-count">({parsedHistory.length} {parsedHistory.length === 1 ? 'entry' : 'entries'})</span>
                          </h3>
                          {parsedHistory.map((entry, index) => (
                            <div key={index} className="employment-history-card">
                              <div className="employment-card-header">
                                <h4 className="employment-company">{entry.company || 'Company not specified'}</h4>
                                <span className="employment-duration-badge">
                                  {entry.duration || 'Duration not specified'}
                                </span>
                              </div>
                              <div className="employment-card-body">
                                <div className="employment-detail">
                                  <span className="employment-label">Designation:</span>
                                  <span className="employment-text">{entry.designation || 'Not specified'}</span>
                                </div>
                                <div className="employment-detail">
                                  <span className="employment-label">Period:</span>
                                  <span className="employment-text">
                                    {entry.startYear || 'N/A'} - {entry.isCurrent ? 'Present' : (entry.endYear || 'N/A')}
                                    {entry.isCurrent && <span className="current-job-badge">Current</span>}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    } else if (selectedCandidate.employmentHistory === 'yes' || selectedCandidate.employmentHistory === 'no') {
                      // Handle yes/no format
                      return (
                        <div className="detail-section">
                          <h3 className="section-title">Employment History</h3>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span className="detail-label">Has Employment History?</span>
                              <span className={`pf-history-badge ${selectedCandidate.employmentHistory === 'yes' ? 'pf-yes' : 'pf-no'}`}>
                                {selectedCandidate.employmentHistory === 'yes' ? '✓ Yes' : '✗ No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  } catch (e) {
                    // If parsing fails, show yes/no format
                    if (selectedCandidate.employmentHistory === 'yes' || selectedCandidate.employmentHistory === 'no') {
                      return (
                        <div className="detail-section">
                          <h3 className="section-title">Employment History</h3>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span className="detail-label">Has Employment History?</span>
                              <span className={`pf-history-badge ${selectedCandidate.employmentHistory === 'yes' ? 'pf-yes' : 'pf-no'}`}>
                                {selectedCandidate.employmentHistory === 'yes' ? '✓ Yes' : '✗ No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  }
                }
                return null;
              })()}

              {/* Education Details */}
              <div className="detail-section">
                <h3 className="section-title">📚 Education Details</h3>
                {(() => {
                  let educationEntries = [];
                  
                  // Try to parse education JSON
                  if (selectedCandidate.education) {
                    try {
                      const parsed = JSON.parse(selectedCandidate.education);
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        educationEntries = parsed;
                      }
                    } catch (e) {
                      // If parsing fails, use old format
                      if (selectedCandidate.degree) {
                        educationEntries = [{
                          degree: selectedCandidate.degree,
                          specialization: '',
                          institution: '',
                          passingYear: selectedCandidate.passingYear || '',
                          percentage: ''
                        }];
                      }
                    }
                  } else if (selectedCandidate.degree) {
                    // Fallback to old single degree format
                    educationEntries = [{
                      degree: selectedCandidate.degree,
                      specialization: '',
                      institution: '',
                      passingYear: selectedCandidate.passingYear || '',
                      percentage: ''
                    }];
                  }
                  
                  if (educationEntries.length > 0) {
                    return (
                      <>
                        <div className="section-subtitle-text">
                          {educationEntries.length} {educationEntries.length === 1 ? 'qualification' : 'qualifications'} on record
                        </div>
                        {educationEntries.map((entry, index) => (
                          <div key={index} className="education-card">
                            <div className="education-card-header">
                              <h4 className="education-degree">{entry.degree || 'Degree not specified'}</h4>
                              {entry.passingYear && (
                                <span className="education-year-badge">{entry.passingYear}</span>
                              )}
                            </div>
                            <div className="education-card-body">
                              {entry.specialization && (
                                <div className="education-detail">
                                  <span className="education-label">Specialization:</span>
                                  <span className="education-text">{entry.specialization}</span>
                                </div>
                              )}
                              {entry.institution && (
                                <div className="education-detail">
                                  <span className="education-label">Institution:</span>
                                  <span className="education-text">{entry.institution}</span>
                                </div>
                              )}
                              {entry.percentage && (
                                <div className="education-detail">
                                  <span className="education-label">Score:</span>
                                  <span className="education-text">{entry.percentage}</span>
                                </div>
                              )}
                              {!entry.specialization && !entry.institution && !entry.percentage && entry.passingYear && (
                                <div className="education-detail">
                                  <span className="education-text-subtle">Year of Passing: {entry.passingYear}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  } else {
                    return (
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-value empty">No education details provided</span>
                        </div>
                      </div>
                    );
                  }
                })()}
                
                {selectedCandidate.gap && (
                  <div className="detail-grid" style={{ marginTop: '1rem' }}>
                    <div className="detail-item">
                      <span className="detail-label">Career Gap</span>
                      <span className="detail-value">{selectedCandidate.gap}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills & Expertise */}
              {selectedCandidate.skills && (
                <div className="detail-section">
                  <h3 className="section-title">Skills & Expertise</h3>
                  <div className="skills-container">
                    {selectedCandidate.skills.split(',').map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Comments */}
              {selectedCandidate.comment && (
                <div className="detail-section">
                  <h3 className="section-title">Additional Comments</h3>
                  <div className="comments-box">
                    {selectedCandidate.comment}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
