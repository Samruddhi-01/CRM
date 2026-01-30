import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Edit2, UserPlus, Pause, Play, Lock, Trash2 } from 'lucide-react';
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
import '../styles/components/unified-table.css';
import '../styles/pages/openings.css';
import '../styles/pages/openings-unified.css';
import { 
  fetchOpenings, 
  updateOpeningStatus, 
  deleteOpening,
  applyToOpening,
  fetchOpeningApplications,
  updateApplicationStatus,
  removeApplication,
  setFilters,
  setPage,
  clearError,
  selectOpenings,
  selectOpeningsLoading,
  selectOpeningsError,
  selectOpeningsPagination,
  selectOpeningsFilters,
  selectApplications
} from '../redux/slices/openingsSlice';
import { fetchCandidates } from '../redux/slices/candidatesSlice';
import { selectUser, selectUserRole } from '../redux/slices/authSlice';
import { ROLES } from '../utils/constants';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Openings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const openings = useSelector(selectOpenings);
  const loading = useSelector(selectOpeningsLoading);
  const error = useSelector(selectOpeningsError);
  const pagination = useSelector(selectOpeningsPagination);
  const filters = useSelector(selectOpeningsFilters);
  const applications = useSelector(selectApplications);
  const candidates = useSelector(state => state.candidates.candidates);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  
  // Local state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [applicationNotes, setApplicationNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [departmentFilter, setDepartmentFilter] = useState(filters.department || '');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [popupTitle, setPopupTitle] = useState('');

  const STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'DRAFT', label: 'Draft' }
  ];

  const APPLICATION_STATUSES = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED'];
  const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

  // Load openings on mount and when page/itemsPerPage changes
  useEffect(() => {
    console.log('📄 Loading openings - page:', pagination.currentPage, 'size:', itemsPerPage);
    loadOpenings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, pagination.currentPage]);

  // Load candidates once on mount
  useEffect(() => {
    dispatch(fetchCandidates());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error || 'An error occurred!', {
        duration: 4000,
        position: 'top-center',
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadOpenings = () => {
    console.log('📥 Loading openings with current filters:', {
      search: searchTerm,
      status: statusFilter,
      department: departmentFilter,
      page: pagination.currentPage,
      size: itemsPerPage
    });
    
    dispatch(fetchOpenings({ 
      search: searchTerm, 
      status: statusFilter, 
      department: departmentFilter,
      page: pagination.currentPage,
      size: itemsPerPage
    }));
  };

  const handleSearch = () => {
    console.log('🔍 Search triggered with filters:', { 
      search: searchTerm, 
      status: statusFilter, 
      department: departmentFilter 
    });
    
    dispatch(setFilters({ 
      search: searchTerm, 
      status: statusFilter, 
      department: departmentFilter 
    }));
    dispatch(setPage(0));
    dispatch(fetchOpenings({ 
      search: searchTerm, 
      status: statusFilter, 
      department: departmentFilter,
      page: 0,
      size: itemsPerPage
    }));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      try {
        await dispatch(updateOpeningStatus({ id, status: newStatus })).unwrap();
        toast.success('Opening status updated successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        loadOpenings();
      } catch (error) {
        toast.error(error.message || 'Failed to update opening status!', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteOpening(id)).unwrap();
        toast.success('Job opening deleted successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        loadOpenings();
      } catch (error) {
        toast.error(error.message || 'Failed to delete job opening!', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  const handleApplyClick = (opening) => {
    setSelectedOpening(opening);
    setSelectedCandidateId('');
    setApplicationNotes('');
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidateId) {
      toast.error('Please select a candidate', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    try {
      await dispatch(applyToOpening({
        openingId: selectedOpening.id,
        candidateId: parseInt(selectedCandidateId, 10),
        notes: applicationNotes
      })).unwrap();
      toast.success('Application submitted successfully!', {
        duration: 3000,
        position: 'top-center',
      });
      setShowApplyModal(false);
      loadOpenings();
    } catch (error) {
      toast.error(error.message || 'Failed to submit application!', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleViewApplications = (opening) => {
    setSelectedOpening(opening);
    dispatch(fetchOpeningApplications({ openingId: opening.id }));
    setShowApplicationsModal(true);
  };

  const handleApplicationStatusUpdate = async (openingId, candidateId, newStatus) => {
    try {
      await dispatch(updateApplicationStatus({ openingId, candidateId, status: newStatus })).unwrap();
      toast.success('Application status updated successfully!', {
        duration: 3000,
        position: 'top-center',
      });
      dispatch(fetchOpeningApplications({ openingId }));
      loadOpenings(); // Refresh the openings list to update application count
    } catch (error) {
      toast.error(error.message || 'Failed to update application status!', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleRemoveApplication = async (openingId, candidateId) => {
    if (window.confirm('Are you sure you want to remove this application?')) {
      try {
        await dispatch(removeApplication({ openingId, candidateId })).unwrap();
        toast.success('Application removed successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        dispatch(fetchOpeningApplications({ openingId }));
        loadOpenings(); // Refresh the openings list to update application count
      } catch (error) {
        toast.error(error.message || 'Failed to remove application!', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchOpenings({ 
      search: searchTerm, 
      status: statusFilter, 
      department: departmentFilter,
      page: newPage 
    }));
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      ACTIVE: 'status-active',
      CLOSED: 'status-closed',
      ON_HOLD: 'status-on-hold',
      DRAFT: 'status-draft'
    };
    
    return (
      <span className={`opening-status-badge ${statusClass[status] || 'status-draft'}`}>
        {String(status || '').replace('_', ' ')}
      </span>
    );
  };

  const getApplicationStatusBadge = (status) => {
    const statusClass = {
      APPLIED: 'status-applied',
      REVIEWING: 'status-reviewing',
      SHORTLISTED: 'status-shortlisted',
      REJECTED: 'status-rejected',
      HIRED: 'status-hired'
    };
    
    return (
      <span className={`app-status-badge ${statusClass[status] || 'status-applied'}`}>
        {status}
      </span>
    );
  };

  const getExperienceBadge = (experience) => {
    if (!experience) return '-';
    
    const exp = experience.toLowerCase();
    let badgeClass = 'exp-badge';
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
    
    const handleClick = (e) => {
      e.stopPropagation();
      setPopupTitle('Experience Required');
      setPopupText(experience);
      setShowTextPopup(true);
    };
    
    return (
      <span 
        className={`${badgeClass} text-truncate-clickable`} 
        title="Click to view full text"
        onClick={handleClick}
      >
        <span className="exp-icon">{icon}</span>
        <span className="exp-text">{experience}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="app-root">
        <Sidebar />
        <div className="main-wrapper">
          <main className="content">
            <div className="app-ui openings-page">
              <div style={{ padding: '80px 24px', textAlign: 'center', background: 'white', borderRadius: '8px', margin: '24px' }}>
                <LoadingSpinner />
                <p style={{ marginTop: '16px', color: '#666' }}>Loading job openings...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <Toaster />
      <Sidebar />
      <div className="main-wrapper">
        <main className="content">
          <div className="app-ui openings-page">
            {/* Header */}
            <div className="page-header">
              <div>
                <h1 className="page-header-title">
                  Job Openings
                  {userRole === ROLES.HR && (
                    <span className="status-badge info" style={{marginLeft: '12px', fontSize: '11px'}}>
                      Your Openings Only
                    </span>
                  )}
                </h1>
              </div>
              <div className="page-header-actions">
                <button 
                  className="btn-primary-cta"
                  onClick={() => navigate('/openings/new')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add New Opening
                </button>
              </div>
            </div>

            {/* Search and Filters */}
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
                      placeholder="Title, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select"
                  >
                    {STATUSES.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Show Entries</label>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      dispatch(setPage(0));
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
                <button 
                  className="btn btn-danger" 
                  onClick={() => {
                    console.log('🗑️ Clearing all filters');
                    setSearchTerm('');
                    setStatusFilter('');
                    setDepartmentFilter('');
                    setItemsPerPage(10);
                    dispatch(setFilters({
                      search: '',
                      status: '',
                      department: '',
                      itemsPerPage: 10
                    }));
                    dispatch(setPage(0));
                  }}
                >
                  Clear Filters
                </button>
                <button className="btn btn-accent" onClick={handleSearch}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  Search
                </button>
              </div>
            </div>

            {/* Openings Table */}
            <div className="openings-table-card">
              {/* Table Header with Show Entries */}
              <div className="table-header-section">
                <div className="table-header-wrapper">
                  <div className="results-info">
                    <p className="results-count">
                      Showing <strong>{openings.length}</strong> of <strong>{pagination.totalElements || 0}</strong> openings
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
              {/* Unified Table System */}
              <div className="unified-table-section">
                <div className="unified-table-wrapper">
                  <table className="unified-table" role="table" aria-label="Job openings">
                    <thead>
                      <tr>
                        <th>JOB TITLE</th>
                        <th>DEPARTMENT</th>
                        <th>LOCATION</th>
                        <th className="text-center">POSITIONS</th>
                        <th>EXPERIENCE</th>
                        <th className="text-center">APPLICATIONS</th>
                        <th>STATUS</th>
                        <th>CREATED</th>
                        <th className="text-center">ACTIONS</th>
                      </tr>
                    </thead>
                  <tbody>
                    {openings.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="openings-empty-state">No job openings found</td>
                      </tr>
                    ) : (
                      openings.map((opening) => (
                        <tr key={opening.id}>
                          <td className="cell-name">{opening.title}</td>
                          <td>{opening.department}</td>
                          <td>{opening.location || '—'}</td>
                          <td className="text-center">{opening.positions}</td>
                          <td>{getExperienceBadge(opening.experience)}</td>
                          <td className="text-center">
                            <button 
                              className="openings-applications-btn"
                              onClick={() => handleViewApplications(opening)}
                              aria-label={`View applications for ${opening.title}`}
                            >
                              {opening.applicationsCount ?? 0}
                            </button>
                          </td>
                          <td>{getStatusBadge(opening.status)}</td>
                          <td className="cell-date">{opening.createdAt ? new Date(opening.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                          <td className="cell-actions">
                            <div className="unified-action-buttons" role="group" aria-label={`Actions for ${opening.title}`}>
                              <button 
                                className="unified-action-btn unified-btn-edit"
                                onClick={() => navigate(`/openings/edit/${opening.id}`)}
                                title="Edit opening"
                                aria-label={`Edit ${opening.title}`}
                              >
                                <Edit2 size={18} />
                              </button>

                              <button 
                                className="unified-action-btn unified-btn-apply"
                                onClick={() => handleApplyClick(opening)}
                                title="Apply candidate"
                                aria-label={`Apply candidate to ${opening.title}`}
                              >
                                <UserPlus size={18} />
                              </button>

                              {opening.status === 'ACTIVE' ? (
                                <button 
                                  className="unified-action-btn unified-btn-pause"
                                  onClick={() => handleStatusUpdate(opening.id, 'ON_HOLD')}
                                  title="Put on hold"
                                  aria-label={`Put ${opening.title} on hold`}
                                >
                                  <Pause size={18} />
                                </button>
                              ) : opening.status === 'ON_HOLD' ? (
                                <button 
                                  className="unified-action-btn unified-btn-success"
                                  onClick={() => handleStatusUpdate(opening.id, 'ACTIVE')}
                                  title="Activate"
                                  aria-label={`Activate ${opening.title}`}
                                >
                                  <Play size={18} />
                                </button>
                              ) : null}

                              <button 
                                className="unified-action-btn unified-btn-lock"
                                onClick={() => handleStatusUpdate(opening.id, 'CLOSED')}
                                title="Close opening"
                                aria-label={`Close ${opening.title}`}
                              >
                                <Lock size={18} />
                              </button>

                              <button 
                                className="unified-action-btn unified-btn-delete"
                                onClick={() => handleDelete(opening.id, opening.title)}
                                title="Delete opening"
                                aria-label={`Delete ${opening.title}`}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                </div>

                {/* MOBILE: Card list (visible on small screens via CSS) */}
                <div className="opening-cards mobile-only" aria-hidden="true">
                  {openings.map(opening => (
                    <div key={`card-${opening.id}`} className="opening-card" role="article" aria-labelledby={`opening-${opening.id}-title`}>
                      <div className="opening-card-header">
                        <div>
                          <div id={`opening-${opening.id}-title`} className="opening-title">{opening.title}</div>
                          <div className="opening-meta">{opening.department} • <span className="wrap">{opening.location || '-'}</span></div>
                        </div>
                        {getStatusBadge(opening.status)}
                      </div>

                      <div className="opening-card-body">
                        <div className="opening-meta-row">
                          <strong>Experience:</strong> {getExperienceBadge(opening.experience)}
                        </div>

                        <div className="opening-meta-row">
                          <strong>Positions:</strong> {opening.positions}
                        </div>

                        <div className="opening-meta-row">
                          <strong>Created:</strong> {opening.createdAt ? new Date(opening.createdAt).toLocaleDateString() : '-'}
                        </div>

                        <div className="opening-meta-row">
                          <strong>Applications:</strong> <button 
                            className="openings-applications-btn"
                            onClick={() => handleViewApplications(opening)}
                            aria-label={`View applications for ${opening.title}`}
                          >
                            View ({opening.applicationsCount ?? 0})
                          </button>
                        </div>
                      </div>

                      <div className="opening-actions">
                        <button 
                          className="btn-base btn-primary btn-sm"
                          onClick={() => navigate(`/openings/edit/${opening.id}`)}
                          title="Edit"
                        >
                          <Edit2 size={16} /> Edit
                        </button>

                        <button 
                          className="btn-base btn-info btn-sm"
                          onClick={() => handleApplyClick(opening)}
                          title="Apply Candidate"
                        >
                          <UserPlus size={16} /> Apply
                        </button>

                        {opening.status === 'ACTIVE' ? (
                          <button 
                            className="btn-base btn-warning btn-sm"
                            onClick={() => handleStatusUpdate(opening.id, 'ON_HOLD')}
                            title="Put on Hold"
                          >
                            <Pause size={16} /> Hold
                          </button>
                        ) : opening.status === 'ON_HOLD' ? (
                          <button 
                            className="btn-base btn-success btn-sm"
                            onClick={() => handleStatusUpdate(opening.id, 'ACTIVE')}
                            title="Activate"
                          >
                            <Play size={16} /> Activate
                          </button>
                        ) : null}

                        <button 
                          className="btn-base btn-neutral btn-sm"
                          onClick={() => handleStatusUpdate(opening.id, 'CLOSED')}
                          title="Close Opening"
                        >
                          <Lock size={16} /> Close
                        </button>

                        <button 
                          className="btn-base btn-danger btn-sm"
                          onClick={() => handleDelete(opening.id, opening.title)}
                          title="Delete"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centered Pagination */}
              {pagination.totalPages > 0 && (
                <div className="pagination-wrapper-centered">
                  <div className="pagination-container">
                    <button
                      className="pagination-btn pagination-btn-prev"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 0}
                      title="Previous Page"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      <span>Previous</span>
                    </button>
                    
                    <div className="pagination-numbers">
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        if (
                          index === 0 ||
                          index === pagination.totalPages - 1 ||
                          (index >= pagination.currentPage - 1 && index <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={index}
                              className={`pagination-btn pagination-number ${pagination.currentPage === index ? 'active' : ''}`}
                              onClick={() => handlePageChange(index)}
                            >
                              {index + 1}
                            </button>
                          );
                        } else if (index === pagination.currentPage - 2 || index === pagination.currentPage + 2) {
                          return <span key={index} className="pagination-ellipsis">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      className="pagination-btn pagination-btn-next"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.totalPages - 1}
                      title="Next Page"
                    >
                      <span>Next</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="pagination-info">
                    <span>Page <strong>{pagination.currentPage + 1}</strong> of <strong>{pagination.totalPages}</strong></span>
                    <span className="pagination-separator">•</span>
                    <span>Total <strong>{pagination.totalElements || 0}</strong> entries</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Apply Candidate Modal */}
      {showApplyModal && (
        <div className="openings-modal-overlay">
          <div className="openings-modal">
            <div className="openings-modal-header">
              <h2>Apply Candidate to {selectedOpening?.title}</h2>
              <button 
                className="openings-modal-close" 
                onClick={() => setShowApplyModal(false)}
              >
                ×
              </button>
            </div>
            <div className="openings-modal-body">
              <form onSubmit={handleApplySubmit}>
                <div className="openings-form-group">
                  <label>Select Candidate:</label>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                    required
                    className="openings-form-select"
                  >
                    <option value="">Choose a candidate...</option>
                    {candidates.map(candidate => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.firstName} {candidate.lastName} - {candidate.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="openings-form-group">
                  <label>Notes (Optional):</label>
                  <textarea
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                    placeholder="Add any notes about this application..."
                    className="openings-form-textarea"
                    rows="3"
                  />
                </div>
                <div className="openings-modal-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowApplyModal(false)} 
                    className="openings-modal-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="openings-modal-btn-submit">
                    Apply Candidate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {showApplicationsModal && (
        <div className="openings-modal-overlay">
          <div className="openings-modal openings-modal-large">
            <div className="openings-modal-header">
              <h2>Applications for {selectedOpening?.title}</h2>
              <button 
                className="openings-modal-close" 
                onClick={() => setShowApplicationsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="openings-modal-body">
              <div className="openings-applications-content">
                {applications.length === 0 ? (
                  <p>No applications found for this opening.</p>
                ) : (
                  <div className="openings-applications-table-wrapper">
                    <table className="openings-applications-table">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Email</th>
                          <th>Skills</th>
                          <th>Applied Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={`${app.openingId}-${app.candidateId}`}>
                            <td>{app.candidateName}</td>
                            <td>{app.candidateEmail}</td>
                            <td className="skills-cell td-wrap">{app.candidateSkills}</td>
                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                            <td>{getApplicationStatusBadge(app.applicationStatus)}</td>
                            <td>
                              <div className="openings-app-actions">
                                <select
                                  value={app.applicationStatus}
                                  onChange={(e) => handleApplicationStatusUpdate(
                                    app.openingId, 
                                    app.candidateId, 
                                    e.target.value
                                  )}
                                  className="openings-app-status-select"
                                  aria-label={`Update status for ${app.candidateName}`}
                                >
                                  {APPLICATION_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                                <button
                                  className="icon-button icon-delete"
                                  onClick={() => handleRemoveApplication(app.openingId, app.candidateId)}
                                  title="Remove Application"
                                  aria-label={`Remove application by ${app.candidateName}`}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Popup */}
      {showTextPopup && (
        <div className="text-popup-overlay" onClick={() => setShowTextPopup(false)}>
          <div className="text-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="text-popup-header">
              <h3 className="text-popup-title">{popupTitle}</h3>
              <button 
                className="text-popup-close" 
                onClick={() => setShowTextPopup(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="text-popup-body">
              {popupText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Openings;
