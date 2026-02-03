// HRPerformance.js - Admin HR Performance Analytics Dashboard
// Professional Master-Detail Layout

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchHRPerformanceOverview,
  fetchHRCandidates,
  updateAdminRemark,
  updateCandidateStatusAdmin,
  selectHROverview,
  selectHROverviewLoading,
  selectSelectedHRId,
  selectSelectedHRName,
  selectHRCandidates,
  selectHRCandidatesLoading,
  selectUpdateLoading,
  selectHR as selectHRAction,
  clearSelectedHR,
} from '../redux/slices/hrPerformanceSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Edit2 } from 'lucide-react';
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
import '../styles/components/unified-table.css';
import '../styles/components/professional-pagination.css';
import '../styles/pages/hr-performance.css';
import '../styles/pages/hr-performance-unified.css';
import '../styles/pages/hr-performance-responsive.css';
import '../styles/layout/app-layout.css';

const HRPerformance = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const hrOverview = useSelector(selectHROverview);
  const overviewLoading = useSelector(selectHROverviewLoading);
  const selectedHRId = useSelector(selectSelectedHRId);
  const selectedHRName = useSelector(selectSelectedHRName);
  const hrCandidates = useSelector(selectHRCandidates);
  const candidatesLoading = useSelector(selectHRCandidatesLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingAdminRemark, setEditingAdminRemark] = useState(null);
  const [adminRemarkValue, setAdminRemarkValue] = useState('');
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusValue, setStatusValue] = useState('');
  
  // Text viewer modal state
  const [textViewerModal, setTextViewerModal] = useState({
    isOpen: false,
    title: '',
    content: '',
    type: '' // 'opening', 'hrRemark', 'adminRemark'
  });
  
  // Drag scroll state
  const tableWrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Fetch overview on mount
  useEffect(() => {
    console.log('HRPerformance: Fetching overview...');
    dispatch(fetchHRPerformanceOverview())
      .unwrap()
      .then((data) => {
        console.log('HRPerformance: Overview fetched successfully:', data);
      })
      .catch((error) => {
        console.error('HRPerformance: Error fetching overview:', error);
        toast.error('Failed to load HR performance data');
      });
  }, [dispatch]);
  
  // Fetch HR candidates when HR is selected
  useEffect(() => {
    if (selectedHRId) {
      const params = {
        page: currentPage,
        size: itemsPerPage,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
      };
      dispatch(fetchHRCandidates({ hrId: selectedHRId, params }));
    }
  }, [dispatch, selectedHRId, currentPage, itemsPerPage, searchQuery, statusFilter]);
  
  // Handle HR selection
  const handleSelectHR = (hr) => {
    dispatch(selectHRAction({ hrId: hr.hrId, hrName: hr.fullName }));
    setCurrentPage(0);
    setSearchQuery('');
    setStatusFilter('');
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
  };
  
  // Handle admin remark edit
  const handleEditAdminRemark = (candidate) => {
    setEditingAdminRemark(candidate.id);
    setAdminRemarkValue(candidate.adminRemark || '');
  };
  
  const handleSaveAdminRemark = async (candidateId) => {
    try {
      await dispatch(updateAdminRemark({ candidateId, adminRemark: adminRemarkValue })).unwrap();
      setEditingAdminRemark(null);
    } catch (error) {
      // Error handled by slice
    }
  };
  
  const handleCancelAdminRemark = () => {
    setEditingAdminRemark(null);
    setAdminRemarkValue('');
  };
  
  // Handle status edit
  const handleEditStatus = (candidate) => {
    setEditingStatus(candidate.id);
    setStatusValue(candidate.status);
  };
  
  const handleSaveStatus = async (candidateId) => {
    try {
      await dispatch(updateCandidateStatusAdmin({ candidateId, status: statusValue })).unwrap();
      setEditingStatus(null);
    } catch (error) {
      // Error handled by slice
    }
  };
  
  const handleCancelStatus = () => {
    setEditingStatus(null);
    setStatusValue('');
  };
  
  // Drag scroll handlers
  const handleMouseDown = (e) => {
    if (!tableWrapperRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableWrapperRef.current.offsetLeft);
    setScrollLeft(tableWrapperRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !tableWrapperRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableWrapperRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableWrapperRef.current.scrollLeft = scrollLeft - walk;
  };
  
  // Truncate text helper
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  // Text viewer modal handlers
  const openTextViewer = (title, content, type) => {
    setTextViewerModal({
      isOpen: true,
      title,
      content,
      type
    });
  };
  
  const closeTextViewer = () => {
    setTextViewerModal({
      isOpen: false,
      title: '',
      content: '',
      type: ''
    });
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONTACTED': return 'status-contacted';
      case 'INTERESTED': return 'status-interested';
      case 'HIRED': return 'status-hired';
      case 'OFFERED': return 'status-offered';
      case 'NOT_INTERESTED': return 'status-not-interested';
      case 'PENDING': return 'status-pending';
      case 'TELL_LATER': return 'status-tell-later';
      default: return 'status-default';
    }
  };
  
  // Render status badge
  const renderStatusBadge = (status, statusLabel) => {
    return (
      <span className={`status-badge ${getStatusBadgeClass(status)}`}>
        {statusLabel}
      </span>
    );
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  if (overviewLoading && hrOverview.length === 0) {
    return <LoadingSpinner fullScreen message="Loading HR performance data..." />;
  }
  
  return (
    <>
      <div className="main-wrapper">
        <main className="content">
          <div className="app-ui hr-performance-page">
            {/* Page Header */}
            <div className="page-header">
              <div className="page-header-title">
                <h1>HR Performance Analytics</h1>
                <p>Monitor HR team performance and candidate management</p>
              </div>
              {selectedHRId && (
                <div className="page-header-actions">
                  <button 
                    className="btn-primary-cta"
                    onClick={() => dispatch(clearSelectedHR())}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back to Overview
                  </button>
                </div>
              )}
            </div>
      
      {/* Master-Detail Layout */}
      <div className="hr-performance-container">
        {/* MASTER SECTION - HR Overview */}
        {!selectedHRId && (
          <div className="hr-overview-section">
            <div className="section-header">
              <h2 className="section-title">HR Team Overview</h2>
              <span className="badge badge-primary">{hrOverview.length} HR Users</span>
            </div>
            
            <div className="hr-overview-grid">
              {hrOverview.map((hr) => (
                <div 
                  key={hr.hrId} 
                  className="hr-overview-card"
                  onClick={() => handleSelectHR(hr)}
                >
                  <div className="hr-card-header">
                    <div className="hr-avatar">{hr.fullName.charAt(0)}</div>
                    <div className="hr-info">
                      <h3 className="hr-name">{hr.fullName}</h3>
                      <p className="hr-email">{hr.email}</p>
                    </div>
                  </div>
                  
                  <div className="hr-metrics">
                    <div className="hr-metric">
                      <span className="metric-label">Total Candidates</span>
                      <span className="metric-value">{hr.totalCandidates}</span>
                    </div>
                    <div className="hr-metric">
                      <span className="metric-label">Hired</span>
                      <span className="metric-value metric-success">{hr.hiredCount}</span>
                    </div>
                    <div className="hr-metric">
                      <span className="metric-label">Contacted</span>
                      <span className="metric-value metric-info">{hr.contactedCount}</span>
                    </div>
                    <div className="hr-metric">
                      <span className="metric-label">Pending</span>
                      <span className="metric-value metric-warning">{hr.pendingCount}</span>
                    </div>
                  </div>
                  
                  <div className="hr-card-footer">
                    <span className="last-activity">
                      Last Activity: {formatDate(hr.lastActivity)}
                    </span>
                    <button className="btn-view btn-sm btn-primary">View Candidates →</button>
                  </div>
                </div>
              ))}
            </div>
            
            {hrOverview.length === 0 && !overviewLoading && (
              <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{ color: '#1E293B', marginBottom: '0.5rem' }}>No HR Users Found</h3>
                <p style={{ color: '#64748B', marginBottom: '1rem' }}>
                  There are currently no HR users in the system with assigned candidates.
                </p>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                  Create HR accounts in HR Management or assign candidates to existing HR users.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* DETAIL SECTION - HR Candidates */}
        {selectedHRId && (
          <div className="hr-candidates-section">
            {/* Search and Filters - Matching Job Openings */}
            <div className="filter-card">
              <div className="filter-card-header">
                <h2 className="filter-card-title">Candidates - {selectedHRName}</h2>
                <span className="badge-count">{hrCandidates.totalElements} total</span>
              </div>
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
                      placeholder="Search candidates..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(0);
                      }}
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
                    <option value="HIRED">Hired</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Table Header with Show Entries */}
            <div className="table-header-section">
              <div className="table-header-wrapper">
                <div className="results-info">
                  <p className="results-count">
                    Showing <strong>{hrCandidates.content.length}</strong> of <strong>{hrCandidates.totalElements}</strong> candidates
                  </p>
                </div>
                <div className="show-entries-wrapper">
                  <label className="show-entries-label">Show entries:</label>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(0);
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
            
            {/* Candidates Table */}
            {candidatesLoading ? (
              <LoadingSpinner message="Loading candidates..." />
            ) : (
              <>
                {/* Desktop Table */}
                <div className="unified-table-section">
                  <div className="unified-table-wrapper">
                    <table className="unified-table" role="table" aria-label="HR Performance Candidates">
                      <thead>
                        <tr>
                          <th>CANDIDATE</th>
                          <th>CONTACT</th>
                          <th>PROFILE</th>
                          <th>APPLIED TO</th>
                          <th>STATUS</th>
                          <th>HR REMARK</th>
                          <th>ADMIN REMARK</th>
                          <th>CREATED</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hrCandidates.content.map((candidate) => (
                          <tr key={candidate.id}>
                            <td className="cell-name">{candidate.fullName}</td>
                            <td>
                              <div>{candidate.email}</div>
                              <div className="text-muted">{candidate.phone}</div>
                            </td>
                            <td>
                              <div>{candidate.profile || 'N/A'}</div>
                              <div className="text-muted">{candidate.experience || 'N/A'}</div>
                            </td>
                            <td>
                            {candidate.appliedOpenings && candidate.appliedOpenings.length > 0 ? (
                              <div className="applied-openings">
                                {candidate.appliedOpenings.slice(0, 2).map((opening, idx) => (
                                  <span 
                                    key={idx} 
                                    className="opening-badge opening-badge-clickable" 
                                    onClick={() => openTextViewer('Job Opening', opening, 'opening')}
                                    title="Click to view full text"
                                  >
                                    {truncateText(opening, 20)}
                                  </span>
                                ))}
                                {candidate.appliedOpenings.length > 2 && (
                                  <span 
                                    className="opening-badge opening-badge-clickable opening-badge-count" 
                                    onClick={() => openTextViewer(
                                      'All Applied Openings', 
                                      candidate.appliedOpenings.join('\n• '), 
                                      'opening'
                                    )}
                                    title="Click to view all openings"
                                  >
                                    +{candidate.appliedOpenings.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                          <td>
                          {editingStatus === candidate.id ? (
                            <div className="inline-edit-status">
                              <select
                                value={statusValue}
                                onChange={(e) => setStatusValue(e.target.value)}
                                className="inline-status-select"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="INTERESTED">Interested</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="SHORTLISTED">Shortlisted</option>
                                <option value="OFFERED">Offered</option>
                                <option value="HIRED">Hired</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="TELL_LATER">Tell Later</option>
                              </select>
                              <button 
                                onClick={() => handleSaveStatus(candidate.id)}
                                className="inline-btn inline-btn-save"
                                disabled={updateLoading}
                                title="Save"
                              >
                                ✓
                              </button>
                              <button 
                                onClick={handleCancelStatus}
                                className="inline-btn inline-btn-cancel"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="status-with-edit">
                              <span className={`status-badge status-${candidate.status.toLowerCase()}`}>
                                {candidate.statusLabel || candidate.status}
                              </span>
                              <button
                                onClick={() => handleEditStatus(candidate)}
                                className="inline-edit-btn"
                                title="Edit status"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          )}
                          </td>
                          <td>
                            {candidate.hrRemark ? (
                              <div 
                                className="remark-cell remark-cell-clickable" 
                                onClick={() => openTextViewer('HR Remark', candidate.hrRemark, 'hrRemark')}
                                title="Click to view full remark"
                              >
                                {truncateText(candidate.hrRemark, 30)}
                              </div>
                            ) : (
                              <span className="text-muted">No remark</span>
                            )}
                          </td>
                          <td>
                            {editingAdminRemark === candidate.id ? (
                              <div className="inline-edit-remark">
                                <textarea
                                  value={adminRemarkValue}
                                  onChange={(e) => setAdminRemarkValue(e.target.value)}
                                  className="inline-remark-textarea"
                                  rows="2"
                                  placeholder="Add admin remark..."
                                />
                                <div className="inline-remark-actions">
                                  <button 
                                    onClick={() => handleSaveAdminRemark(candidate.id)}
                                    className="inline-btn inline-btn-save"
                                    disabled={updateLoading}
                                    title="Save"
                                  >
                                    ✓
                                  </button>
                                  <button 
                                    onClick={handleCancelAdminRemark}
                                    className="inline-btn inline-btn-cancel"
                                    title="Cancel"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="remark-with-edit">
                                {candidate.adminRemark ? (
                                  <div 
                                    className="remark-cell remark-cell-clickable" 
                                    onClick={() => openTextViewer('Admin Remark', candidate.adminRemark, 'adminRemark')}
                                    title="Click to view full remark"
                                  >
                                    {truncateText(candidate.adminRemark, 30)}
                                  </div>
                                ) : (
                                  <span className="text-muted">No remark</span>
                                )}
                                <button
                                  onClick={() => handleEditAdminRemark(candidate)}
                                  className="inline-edit-btn"
                                  title="Edit admin remark"
                                >
                                  <Edit2 size={12} />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="cell-date">{formatDate(candidate.createdAt)}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="candidates-cards mobile-only">
                  {hrCandidates.content.map((candidate) => (
                    <div key={candidate.id} className="candidate-card">
                      <div className="card-header">
                        <h3 className="card-name">{candidate.fullName}</h3>
                        {renderStatusBadge(candidate.status, candidate.statusLabel)}
                      </div>
                      
                      <div className="card-body">
                        <div className="card-row">
                          <span className="card-label">Email:</span>
                          <span className="card-value">{candidate.email}</span>
                        </div>
                        <div className="card-row">
                          <span className="card-label">Phone:</span>
                          <span className="card-value">{candidate.phone}</span>
                        </div>
                        <div className="card-row">
                          <span className="card-label">Profile:</span>
                          <span className="card-value">{candidate.profile || 'N/A'}</span>
                        </div>
                        <div className="card-row">
                          <span className="card-label">Experience:</span>
                          <span className="card-value">{candidate.experience || 'N/A'}</span>
                        </div>
                        {candidate.appliedOpenings && candidate.appliedOpenings.length > 0 && (
                          <div className="card-row">
                            <span className="card-label">Applied To:</span>
                            <div className="applied-openings">
                              {candidate.appliedOpenings.map((opening, idx) => (
                                <span key={idx} className="opening-badge">{opening}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="card-row">
                          <span className="card-label">HR Remark:</span>
                          <span className="card-value">{candidate.hrRemark || 'No remark'}</span>
                        </div>
                        <div className="card-row">
                          <span className="card-label">Admin Remark:</span>
                          <span className="card-value">{candidate.adminRemark || 'No remark'}</span>
                        </div>
                        <div className="card-row">
                          <span className="card-label">Created:</span>
                          <span className="card-value">{formatDate(candidate.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="card-actions">
                        <button
                          onClick={() => handleEditStatus(candidate)}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit Status
                        </button>
                        <button
                          onClick={() => handleEditAdminRemark(candidate)}
                          className="btn btn-sm btn-primary"
                        >
                          Edit Remark
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {hrCandidates.content.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No candidates found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                )}
                
                {/* Centered Pagination */}
                {hrCandidates.totalPages > 0 && (
                  <div className="pagination-wrapper-centered">
                    <div className="pagination-container">
                      <button
                        className="pagination-btn pagination-btn-prev"
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        title="Previous Page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        <span>Previous</span>
                      </button>
                      
                      <div className="pagination-numbers">
                        {[...Array(hrCandidates.totalPages)].map((_, index) => {
                          if (
                            index === 0 ||
                            index === hrCandidates.totalPages - 1 ||
                            (index >= currentPage - 1 && index <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={index}
                                className={`pagination-btn pagination-number ${currentPage === index ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index)}
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
                        onClick={() => setCurrentPage(prev => Math.min(hrCandidates.totalPages - 1, prev + 1))}
                        disabled={currentPage >= hrCandidates.totalPages - 1}
                        title="Next Page"
                      >
                        <span>Next</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="pagination-info">
                      <span>Page <strong>{currentPage + 1}</strong> of <strong>{hrCandidates.totalPages}</strong></span>
                      <span className="pagination-separator">•</span>
                      <span>Total <strong>{hrCandidates.totalElements}</strong> entries</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Text Viewer Modal */}
      {textViewerModal.isOpen && (
        <div className="text-viewer-overlay" onClick={closeTextViewer}>
          <div className="text-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="text-viewer-header">
              <h3 className="text-viewer-title">{textViewerModal.title}</h3>
              <button onClick={closeTextViewer} className="text-viewer-close" title="Close">
                ✕
              </button>
            </div>
            <div className="text-viewer-content">
              {textViewerModal.type === 'opening' && textViewerModal.content.includes('\n') ? (
                <ul className="text-viewer-list">
                  {textViewerModal.content.split('\n').filter(item => item.trim()).map((item, idx) => (
                    <li key={idx}>{item.replace('• ', '')}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-viewer-text">{textViewerModal.content}</p>
              )}
            </div>
            <div className="text-viewer-footer">
              <button onClick={closeTextViewer} className="text-viewer-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </main>
      </div>
    </>
  );
};

export default HRPerformance;
