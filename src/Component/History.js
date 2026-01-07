// History.js - Professional Candidate History Component

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye } from 'lucide-react';
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
import '../styles/components/unified-table.css';
import '../styles/components/professional-pagination.css';
import '../styles/pages/history-unified.css';
import AppTableLayout from '../components/common/AppTableLayout';
import { 
  fetchCandidates, 
  setFilters, 
  setPage, 
  setPageSize,
  clearFilters,
  selectCandidates,
  selectCandidatesTotal,
  selectCandidatesPage,
  selectCandidatesPageSize,
  selectCandidatesFilters,
  selectCandidatesLoading,
  updateCandidateStatus
} from '../redux/slices/candidatesSlice';
import { selectUserRole } from '../redux/slices/authSlice';
import { CANDIDATE_STATUS, ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const candidates = useSelector(selectCandidates);
  const total = useSelector(selectCandidatesTotal);
  const page = useSelector(selectCandidatesPage);
  const pageSize = useSelector(selectCandidatesPageSize);
  const filters = useSelector(selectCandidatesFilters);
  const loading = useSelector(selectCandidatesLoading);
  const userRole = useSelector(selectUserRole);
  
  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: '',
    dateRange: '',
  });
  
  // Use pageSize from Redux instead of local state
  const itemsPerPage = pageSize;
  
  // Define table columns for unified system
  const tableColumns = [
    {
      header: 'Name',
      field: 'name',
      cellClassName: 'cell-name',
      render: (candidate) => `${candidate.firstName} ${candidate.lastName}`
    },
    {
      header: 'Email',
      field: 'email',
      cellClassName: 'cell-email',
      render: (candidate) => candidate.email
    },
    {
      header: 'Phone',
      field: 'phone',
      cellClassName: 'cell-phone',
      render: (candidate) => candidate.phone
    },
    {
      header: 'Status',
      field: 'status',
      type: 'status',
      render: (candidate) => (
        <span className={`unified-status-badge status-${candidate.status?.toLowerCase().replace('_', '-')}`}>
          {candidate.status?.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Company',
      field: 'company',
      hideOnTablet: true,
      render: (candidate) => candidate.company || '-'
    },
    {
      header: 'Profile',
      field: 'profile',
      hideOnTablet: true,
      render: (candidate) => candidate.profile || '-'
    },
    {
      header: 'Location',
      field: 'location',
      hideOnTablet: true,
      render: (candidate) => candidate.location || '-'
    },
    {
      header: 'Experience',
      field: 'experience',
      hideOnTablet: true,
      render: (candidate) => candidate.experience || '-'
    },
    {
      header: 'Expected CTC',
      field: 'expectedCTC',
      hideOnTablet: true,
      render: (candidate) => candidate.expectedCTC || '-'
    },
    {
      header: 'Created',
      field: 'createdAt',
      cellClassName: 'cell-date',
      hideOnTablet: true,
      render: (candidate) => formatDate(candidate.createdAt)
    },
    {
      header: 'Actions',
      type: 'actions',
      cellClassName: 'cell-actions',
      render: (candidate) => (
        <div className="unified-action-buttons">
          <button 
            className="unified-action-btn unified-btn-edit"
            onClick={() => handleEdit(candidate.id)}
            title="Edit Candidate"
          >
            <Edit2 size={18} />
          </button>
          <button 
            className="unified-action-btn unified-btn-view"
            onClick={() => handleView(candidate.id)}
            title="View Candidate"
          >
            <Eye size={18} />
          </button>
        </div>
      )
    }
  ];
  
  // Sync local filters with Redux filters on mount
  useEffect(() => {
    if (filters.search || filters.status) {
      setLocalFilters(prev => ({
        ...prev,
        search: filters.search || '',
        status: filters.status || '',
      }));
    }
  }, []);
  
  // Use candidates directly from Redux (no client-side filtering)
  const filteredCandidates = candidates;
  const filteredTotal = total;
  
  useEffect(() => {
    console.log('History: Fetching candidates with filters:', filters);
    dispatch(fetchCandidates({ 
      page, 
      size: pageSize, // Use pageSize from Redux
      ...filters // Spread filters so they're at the top level
    }));
  }, [dispatch, page, pageSize, filters]);
  
  const handleLocalFilterChange = (name, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleApplyFilters = () => {
    console.log('History: Applying filters:', localFilters);
    dispatch(setFilters(localFilters));
    dispatch(setPage(0));
  };
  
  const handleClearFilters = () => {
    console.log('History: Clearing filters');
    setLocalFilters({
      search: '',
      status: '',
      dateRange: '',
    });
    dispatch(clearFilters());
  };
  
  const handlePageSizeChange = (newSize) => {
    dispatch(setPageSize(Number(newSize)));
    dispatch(setPage(0));
  };
  
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };
  
  const handleEdit = (id) => {
    navigate(`/candidates/${id}`);
  };
  
  const handleView = (id) => {
    navigate(`/candidates/${id}`);
  };
  
  const totalPages = Math.ceil(total / pageSize);
  
  const getStatusClass = (status) => {
    switch (status) {
      case CANDIDATE_STATUS.INTERESTED:
      case CANDIDATE_STATUS.HIRED:
        return 'status-interested';
      case CANDIDATE_STATUS.NOT_INTERESTED:
      case CANDIDATE_STATUS.REJECTED:
        return 'status-not_interested';
      case CANDIDATE_STATUS.PENDING:
        return 'status-pending';
      case CANDIDATE_STATUS.SCHEDULED:
        return 'status-scheduled';
      default:
        return 'status-pending';
    }
  };
  
  if (loading && candidates.length === 0) {
    return (
      <>
        <Sidebar />
        <div className="main-wrapper">
          <main className="content">
            <div className="app-ui">
              <div style={{ padding: '80px 24px', textAlign: 'center', background: 'white', borderRadius: '8px', margin: '24px' }}>
                <LoadingSpinner />
                <p style={{ marginTop: '16px', color: '#666' }}>Loading candidate history...</p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Sidebar />
      <div className="main-wrapper">
        <main className="content">
          <div className="app-ui">
            
            {/* Page Header */}
            <div className="page-header">
              <h1 className="page-header-title">Candidate History</h1>
              <div className="page-header-actions">
                <button className="btn-primary-cta" onClick={() => navigate('/candidates/new')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Candidate
                </button>
              </div>
            </div>

            {/* Filters Section */}
            <div className="filter-card">
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
                      value={localFilters.search}
                      onChange={(e) => handleLocalFilterChange('search', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group col-1">
                  <label className="form-label">Status</label>
                  <select
                    value={localFilters.status}
                    onChange={(e) => handleLocalFilterChange('status', e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(CANDIDATE_STATUS).map(([key, value]) => (
                      <option key={value} value={value}>{value.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-1">
                  <label className="form-label">Date Range</label>
                  <select
                    value={localFilters.dateRange}
                    onChange={(e) => handleLocalFilterChange('dateRange', e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Show Entries</label>
                  <select 
                    value={pageSize}
                    onChange={(e) => {
                      handlePageSizeChange(e.target.value);
                    }}
                    className="form-select"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="filter-actions">
                <button className="btn btn-secondary" onClick={handleClearFilters}>
                  Clear Filters
                </button>
                <button className="btn btn-accent" onClick={handleApplyFilters}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  Apply Filters
                </button>
              </div>
            </div>
            
            {/* Table Section */}
            <div className="table-card">
              <div className="table-header">
                <div className="table-title">
                  {(localFilters.search || localFilters.status || localFilters.dateRange) && (
                    <span className="status-badge info">
                      {filteredTotal} filtered result{filteredTotal !== 1 ? 's' : ''}
                    </span>
                  )}
                  {!localFilters.search && !localFilters.status && !localFilters.dateRange && (
                    <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                      Showing all candidates
                    </span>
                  )}
                </div>
                <div className="table-actions">
                  <button className="btn btn-secondary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    Export CSV
                  </button>
                </div>
              </div>
              
              {filteredCandidates.length === 0 ? (
                <div className="table-empty">
                  <svg className="table-empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <h3 className="table-empty-title">No candidates found</h3>
                  {(localFilters.search || localFilters.status || localFilters.dateRange) ? (
                    <>
                      <p className="table-empty-text">No candidates match your current filters. Try adjusting your search criteria.</p>
                      <div className="table-empty-action">
                        <button className="btn btn-secondary" onClick={handleClearFilters}>
                          Clear Filters
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="table-empty-text">Start by adding your first candidate to the system.</p>
                      <div className="table-empty-action">
                        <button className="btn btn-accent" onClick={() => navigate('/candidates/new')}>
                          Add First Candidate
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                    {/* Unified Responsive Table System */}
                    <AppTableLayout
                      columns={tableColumns}
                      data={filteredCandidates}
                      loading={loading}
                      emptyMessage="No candidates found matching your filters"
                      emptyIcon="👥"
                      renderMobileCard={(candidate) => (
                        <div className="unified-mobile-card">
                          <div className="unified-card-header">
                            <div className="unified-card-title">
                              <div className="unified-card-name">
                                {candidate.firstName} {candidate.lastName}
                              </div>
                              <div className="unified-card-subtitle">{candidate.email}</div>
                            </div>
                            <span className={`unified-status-badge status-${candidate.status?.toLowerCase().replace('_', '-')}`}>
                              {candidate.status?.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="unified-card-body">
                            <div className="unified-card-row">
                              <span className="unified-card-label">Phone:</span>
                              <span className="unified-card-value">{candidate.phone}</span>
                            </div>
                            <div className="unified-card-row">
                              <span className="unified-card-label">Company:</span>
                              <span className="unified-card-value">{candidate.company || '-'}</span>
                            </div>
                            <div className="unified-card-row">
                              <span className="unified-card-label">Profile:</span>
                              <span className="unified-card-value">{candidate.profile || '-'}</span>
                            </div>
                            <div className="unified-card-row">
                              <span className="unified-card-label">Location:</span>
                              <span className="unified-card-value">{candidate.location || '-'}</span>
                            </div>
                            <div className="unified-card-row">
                              <span className="unified-card-label">Experience:</span>
                              <span className="unified-card-value">{candidate.experience || '-'}</span>
                            </div>
                            <div className="unified-card-row">
                              <span className="unified-card-label">Expected CTC:</span>
                              <span className="unified-card-value">{candidate.expectedCTC || '-'}</span>
                            </div>
                            <div className="unified-card-row">
                              <span className="unified-card-label">Created:</span>
                              <span className="unified-card-value">{formatDate(candidate.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="unified-card-footer">
                            <button 
                              className="unified-action-btn unified-btn-edit"
                              onClick={() => handleEdit(candidate.id)}
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              className="unified-action-btn unified-btn-view"
                              onClick={() => handleView(candidate.id)}
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    />
                  
                  {/* Pagination */}
                  {filteredTotal > itemsPerPage && (
                    <div className="pagination-wrapper-centered">
                      <div className="pagination-container">
                        <button
                          className="pagination-btn pagination-btn-prev"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 0}
                          title="Previous Page"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                          <span>Previous</span>
                        </button>
                        
                        <div className="pagination-numbers">
                          {[...Array(Math.ceil(filteredTotal / itemsPerPage))].map((_, index) => {
                            const totalPgs = Math.ceil(filteredTotal / itemsPerPage);
                            // Show current page ± 1, but don't always show first/last
                            if (index >= page - 1 && index <= page + 1) {
                              return (
                                <button
                                  key={index}
                                  className={`pagination-btn pagination-number ${page === index ? 'active' : ''}`}
                                  onClick={() => handlePageChange(index)}
                                >
                                  {index + 1}
                                </button>
                              );
                            }
                            return null;
                          })}
                        </div>
                        
                        <button
                          className="pagination-btn pagination-btn-next"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page >= Math.ceil(filteredTotal / itemsPerPage) - 1}
                          title="Next Page"
                        >
                          <span>Next</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="pagination-info">
                        <span>Page <strong>{page + 1}</strong> of <strong>{Math.ceil(filteredTotal / itemsPerPage)}</strong></span>
                        <span className="pagination-separator">•</span>
                        <span>Total <strong>{filteredTotal}</strong> entries</span>
                        {localFilters.dateRange && (
                          <span style={{ marginLeft: '8px', color: 'var(--app-text-muted)' }}>
                            (filtered by date)
                          </span>
                        )}
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

export default History;
