// HRCandidateRemarks.js - HR Candidate Remarks Management
// For HR users to view and add remarks to their candidates

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Edit2 } from 'lucide-react';
import {
  fetchMyCandidates,
  updateHRRemark,
  updateCandidateStatusHR,
  selectMyCandidates,
  selectMyCandidatesLoading,
  selectMyCandidatesError,
  selectUpdateLoading,
} from '../redux/slices/hrPerformanceSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
import '../styles/components/unified-table.css';
import '../styles/components/professional-pagination.css';
import '../styles/pages/hr-candidate-remarks.css';
import '../styles/pages/hr-candidate-remarks-unified.css';
import '../styles/pages/hr-candidate-remarks-responsive.css';

const HRCandidateRemarks = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const myCandidates = useSelector(selectMyCandidates);
  const loading = useSelector(selectMyCandidatesLoading);
  const error = useSelector(selectMyCandidatesError);
  const updateLoading = useSelector(selectUpdateLoading);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [editingRemark, setEditingRemark] = useState(null);
  const [remarkValue, setRemarkValue] = useState('');
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusValue, setStatusValue] = useState('');
  
  // Fetch candidates on mount and when filters change
  useEffect(() => {
    loadCandidates();
  }, [currentPage, searchQuery, statusFilter]);
  
  const loadCandidates = () => {
    const params = {
      page: currentPage,
      size: 10,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
    };
    console.log('HRCandidateRemarks: Loading candidates with params:', params);
    console.log('HRCandidateRemarks: Current page:', currentPage);
    
    dispatch(fetchMyCandidates(params))
      .unwrap()
      .then((data) => {
        console.log('HRCandidateRemarks: Raw response data:', JSON.stringify(data, null, 2));
        console.log('HRCandidateRemarks: Data structure:', {
          hasContent: !!data.content,
          hasData: !!data.data,
          isArray: Array.isArray(data),
          totalElements: data.totalElements || data.data?.totalElements || 0,
          contentLength: data.content?.length || data.data?.content?.length || 0
        });
        
        if (data.totalElements === 0 || data.data?.totalElements === 0) {
          console.warn('HRCandidateRemarks: No candidates found. Check if sourceHrId is set in database.');
        }
      })
      .catch((error) => {
        console.error('HRCandidateRemarks: Error loading candidates:', error);
        console.error('HRCandidateRemarks: Error details:', {
          message: error.message,
          response: error.response,
          status: error.status
        });
        toast.error(error.message || 'Failed to load candidates. Please try again.');
      });
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadCandidates();
  };
  
  // Handle remark edit
  const handleEditRemark = (candidate) => {
    setEditingRemark(candidate.id);
    setRemarkValue(candidate.hrRemark || '');
  };
  
  const handleSaveRemark = async (candidateId) => {
    try {
      await dispatch(updateHRRemark({ candidateId, hrRemark: remarkValue })).unwrap();
      setEditingRemark(null);
      setRemarkValue('');
      loadCandidates();
    } catch (error) {
      console.error('Error updating remark:', error);
    }
  };
  
  const handleCancelRemark = () => {
    setEditingRemark(null);
    setRemarkValue('');
  };
  
  // Handle status edit
  const handleEditStatus = (candidate) => {
    setEditingStatus(candidate.id);
    setStatusValue(candidate.status);
  };
  
  const handleSaveStatus = async (candidateId) => {
    try {
      await dispatch(updateCandidateStatusHR({ candidateId, status: statusValue })).unwrap();
      setEditingStatus(null);
      loadCandidates();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const handleCancelStatus = () => {
    setEditingStatus(null);
    setStatusValue('');
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    const candidatesData = myCandidates.content ? myCandidates : (myCandidates.data || myCandidates);
    if (candidatesData.content && !candidatesData.last) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Render pagination buttons with ellipsis
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            className={`pagination-btn pagination-number ${currentPage === i ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {pageNum}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(<span key={i} className="pagination-ellipsis">...</span>);
      }
    }
    return buttons;
  };
  
  if (loading && (!myCandidates || !myCandidates.content)) {
    return <LoadingSpinner />;
  }
  
  // Debug: Log the structure of myCandidates
  console.log('HRCandidateRemarks: myCandidates structure:', JSON.stringify(myCandidates, null, 2));
  
  // Handle both possible structures: direct Page object or nested in data
  const candidatesData = myCandidates?.content ? myCandidates : (myCandidates?.data || myCandidates || {});
  const candidates = candidatesData.content || [];
  const totalElements = candidatesData.totalElements || 0;
  const totalPages = candidatesData.totalPages || 0;
  const isLast = candidatesData.last || false;
  
  console.log('HRCandidateRemarks: Extracted data:', {
    candidatesCount: candidates.length,
    totalElements,
    totalPages,
    isLast,
    firstCandidate: candidates[0]
  });
  
  return (
    <>
      <div className="main-wrapper">
        <main className="content">
          <div className="app-ui hr-candidate-remarks-page">
            {/* Page Header */}
            <div className="page-header">
              <div className="page-header-title">
                <h1>My Candidate Remarks</h1>
                <p>Manage remarks and status for your candidates</p>
              </div>
            </div>
      
      {/* Error Message */}
      {error && (
        <div className="alert alert-error" style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '1rem',
          color: '#c33'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
            {/* Search and Filters - Unified Style */}
            <div className="filter-card">
              <div className="filter-grid">
                <div className="form-group">
                  <label className="form-label">Search</label>
                  <div className="search-input-wrapper">
                    <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Status Filter</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="form-select"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="OFFERED">Offered</option>
                    <option value="HIRED">Hired</option>
                    <option value="TELL_LATER">Tell Later</option>
                  </select>
                </div>
              </div>
              
              {(searchQuery || statusFilter) && (
                <div className="filter-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                      setCurrentPage(0);
                    }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
      
            {/* Candidates Table */}
            <div className="table-card">
              <div className="table-header">
                <h3 className="table-title">{totalElements} Candidates</h3>
                <div className="pagination-info">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>📋</div>
            <h3>No Candidates Found</h3>
            {searchQuery || statusFilter ? (
              <p>No candidates match your search criteria. Try adjusting your filters.</p>
            ) : (
              <>
                <p>You don't have any candidates assigned to you yet.</p>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  Candidates you create will appear here automatically.
                </p>
                <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem', fontStyle: 'italic' }}>
                  Note: If you recently created a candidate and don't see it here, 
                  please contact your administrator to ensure the candidate is linked to your account.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
              {/* Unified Table System */}
              <div className="unified-table-section">
                <div className="unified-table-wrapper">
                  <table className="unified-table" role="table" aria-label="My Candidates">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Applied Openings</th>
                    <th>HR Remark</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>
                        <div className="candidate-name">
                          <strong>{candidate.firstName} {candidate.lastName}</strong>
                        </div>
                      </td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phone}</td>
                      <td>
                        {editingStatus === candidate.id ? (
                          <div className="status-edit">
                            <select
                              value={statusValue}
                              onChange={(e) => setStatusValue(e.target.value)}
                              className="status-select-inline"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="INTERESTED">Interested</option>
                              <option value="NOT_INTERESTED">Not Interested</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="OFFERED">Offered</option>
                              <option value="HIRED">Hired</option>
                              <option value="TELL_LATER">Tell Later</option>
                            </select>
                            <button
                              onClick={() => handleSaveStatus(candidate.id)}
                              className="save-btn-mini"
                              disabled={updateLoading}
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancelStatus}
                              className="cancel-btn-mini"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`status-badge status-${candidate.status.toLowerCase()}`}
                            onClick={() => handleEditStatus(candidate)}
                            style={{ cursor: 'pointer' }}
                          >
                            {candidate.statusLabel}
                          </span>
                        )}
                      </td>
                      <td>
                        {candidate.appliedOpenings && candidate.appliedOpenings.length > 0 ? (
                          <div className="applied-openings">
                            {candidate.appliedOpenings.map((opening, index) => (
                              <span key={index} className="opening-tag">
                                {opening}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">No openings</span>
                        )}
                      </td>
                      <td>
                        {editingRemark === candidate.id ? (
                          <div className="remark-edit">
                            <textarea
                              value={remarkValue}
                              onChange={(e) => setRemarkValue(e.target.value)}
                              className="remark-textarea"
                              rows="3"
                              placeholder="Add your remark..."
                            />
                            <div className="remark-actions">
                              <button
                                onClick={() => handleSaveRemark(candidate.id)}
                                className="save-btn"
                                disabled={updateLoading}
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelRemark}
                                className="cancel-btn"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="remark-cell"
                            onClick={() => handleEditRemark(candidate)}
                            title="Click to edit"
                          >
                            {candidate.hrRemark ? (
                              <p className="remark-text">{candidate.hrRemark}</p>
                            ) : (
                              <span className="text-muted">Click to add remark</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleEditRemark(candidate)}
                          className="action-btn action-btn-edit"
                        >
                          Edit Remark
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                  </table>
                </div>
              </div>
            
              {/* Professional Pagination - Matching Job Openings */}
              {totalPages > 1 && (
                <div className="pagination-wrapper-centered">
                  <div className="pagination-container">
                    <button
                      className="pagination-btn pagination-btn-prev"
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      title="Previous Page"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      <span>Previous</span>
                    </button>
                    
                    <div className="pagination-numbers">
                      {renderPaginationButtons()}
                    </div>
                    
                    <button
                      className="pagination-btn pagination-btn-next"
                      onClick={handleNextPage}
                      disabled={isLast}
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
                    <span>Total <strong>{totalElements}</strong> candidates</span>
                  </div>
                </div>
              )}
          </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HRCandidateRemarks;
