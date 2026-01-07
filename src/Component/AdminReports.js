import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
import '../styles/components/unified-table.css';
import '../styles/components/professional-pagination.css';
import '../styles/pages/reports.css';
import '../styles/pages/reports-unified.css';
import '../styles/pages/reports-responsive.css';
import {
  fetchCandidateReport,
  fetchJobOpeningReport,
  fetchHrActivityReport,
  exportCandidateReport,
  exportJobOpeningReport,
  exportHrActivityReport,
  setCandidateFilters,
  setOpeningFilters,
  setActivityFilters,
  clearCandidateReport,
  clearJobOpeningReport,
  clearHrActivityReport,
  selectCandidateReport,
  selectCandidateReportLoading,
  selectCandidateReportError,
  selectCandidateFilters,
  selectJobOpeningReport,
  selectJobOpeningReportLoading,
  selectJobOpeningReportError,
  selectOpeningFilters,
  selectHrActivityReport,
  selectHrActivityReportLoading,
  selectHrActivityReportError,
  selectActivityFilters,
} from '../redux/slices/reportsSlice';
import { selectUserRole } from '../redux/slices/authSlice';
import { fetchHRs } from '../redux/slices/adminSlice';
import { fetchOpenings } from '../redux/slices/openingsSlice';
import Sidebar from '../components/common/Sidebar';

const AdminReports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = useSelector(selectUserRole);

  // Check if user is admin
  useEffect(() => {
    if (userRole !== 'ADMIN') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }, [userRole, navigate]);

  const [activeTab, setActiveTab] = useState('candidates');

  // Pagination states
  const [candidatePage, setCandidatePage] = useState(0);
  const [candidateItemsPerPage, setCandidateItemsPerPage] = useState(10);
  const [openingPage, setOpeningPage] = useState(0);
  const [openingItemsPerPage, setOpeningItemsPerPage] = useState(10);
  const [activityPage, setActivityPage] = useState(0);
  const [activityItemsPerPage, setActivityItemsPerPage] = useState(10);

  // Candidate Report
  const candidateReport = useSelector(selectCandidateReport);
  const candidateLoading = useSelector(selectCandidateReportLoading);
  const candidateError = useSelector(selectCandidateReportError);
  const candidateFilters = useSelector(selectCandidateFilters);

  // Job Opening Report
  const openingReport = useSelector(selectJobOpeningReport);
  const openingLoading = useSelector(selectJobOpeningReportLoading);
  const openingError = useSelector(selectJobOpeningReportError);
  const openingFilters = useSelector(selectOpeningFilters);

  // HR Activity Report
  const activityReport = useSelector(selectHrActivityReport);
  const activityLoading = useSelector(selectHrActivityReportLoading);
  const activityError = useSelector(selectHrActivityReportError);
  const activityFilters = useSelector(selectActivityFilters);

  // For dropdowns
  const hrUsers = useSelector(state => state.admin?.hrs || []);
  const openings = useSelector(state => state.openings?.openings || []);

  useEffect(() => {
    dispatch(fetchHRs({ page: 0, pageSize: 100, search: '' }));
    dispatch(fetchOpenings({ page: 0, size: 1000 }));
  }, [dispatch]);

  // Handle candidate filter changes
  const handleCandidateFilterChange = (field, value) => {
    dispatch(setCandidateFilters({ [field]: value }));
  };

  // Handle opening filter changes
  const handleOpeningFilterChange = (field, value) => {
    dispatch(setOpeningFilters({ [field]: value }));
  };

  // Handle activity filter changes
  const handleActivityFilterChange = (field, value) => {
    dispatch(setActivityFilters({ [field]: value }));
  };

  // Generate reports
  const handleGenerateCandidateReport = () => {
    dispatch(fetchCandidateReport(candidateFilters));
  };

  const handleGenerateOpeningReport = () => {
    dispatch(fetchJobOpeningReport(openingFilters));
  };

  const handleGenerateActivityReport = () => {
    dispatch(fetchHrActivityReport(activityFilters));
  };

  // Export reports
  const handleExportCandidateReport = () => {
    dispatch(exportCandidateReport(candidateFilters))
      .unwrap()
      .then(() => toast.success('Candidate report exported successfully'))
      .catch(() => toast.error('Failed to export candidate report'));
  };

  const handleExportOpeningReport = () => {
    dispatch(exportJobOpeningReport(openingFilters))
      .unwrap()
      .then(() => toast.success('Job opening report exported successfully'))
      .catch(() => toast.error('Failed to export job opening report'));
  };

  const handleExportActivityReport = () => {
    dispatch(exportHrActivityReport(activityFilters))
      .unwrap()
      .then(() => toast.success('HR activity report exported successfully'))
      .catch(() => toast.error('Failed to export HR activity report'));
  };

  // Render error
  const renderError = (error) => {
    if (!error) return null;
    return (
      <div className="reports-error">
        <div className="reports-error-icon">⚠️</div>
        <div className="reports-error-content">
          <h3>Error Loading Report</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  };

  // Render loading
  const renderLoading = () => (
    <div className="reports-loading">
      <div className="reports-loading-spinner"></div>
      <p className="reports-loading-text">Loading report data...</p>
    </div>
  );

  // Render Candidate Report Tab
  const renderCandidateReportTab = () => (
    <div className="reports-tab-content">
      {/* Filters - Unified Style */}
      <div className="filter-card">
        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label">Date From</label>
            <input
              type="date"
              className="form-input"
              value={candidateFilters.dateFrom || ''}
              onChange={(e) => handleCandidateFilterChange('dateFrom', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date To</label>
            <input
              type="date"
              className="form-input"
              value={candidateFilters.dateTo || ''}
              onChange={(e) => handleCandidateFilterChange('dateTo', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={candidateFilters.active === null ? '' : candidateFilters.active}
              onChange={(e) => handleCandidateFilterChange('active', e.target.value === '' ? null : e.target.value === 'true')}
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">HR User</label>
            <select
              className="form-select"
              value={candidateFilters.hrId || ''}
              onChange={(e) => handleCandidateFilterChange('hrId', e.target.value || null)}
            >
              <option value="">All HR</option>
              {hrUsers.map(hr => (
                <option key={hr.id} value={hr.id}>{hr.fullName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              dispatch(setCandidateFilters({
                dateFrom: '',
                dateTo: '',
                active: null,
                hrId: '',
                openingId: '',
              }));
              dispatch(clearCandidateReport());
            }}
          >
            Clear Filters
          </button>
          <button
            className="btn-primary-cta"
            onClick={handleGenerateCandidateReport}
            disabled={candidateLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            {candidateLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {renderError(candidateError)}

      {candidateLoading && renderLoading()}

      {!candidateLoading && candidateReport && (
        <>
          {/* Summary Cards */}
          <div className="reports-summary">
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon blue">👥</div>
                <span className="reports-summary-title">Total Candidates</span>
              </div>
              <div className="reports-summary-value">
                {candidateReport.summary.totalCandidates}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon green">✅</div>
                <span className="reports-summary-title">Active</span>
              </div>
              <div className="reports-summary-value">
                {candidateReport.summary.activeCandidates}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon red">❌</div>
                <span className="reports-summary-title">Inactive</span>
              </div>
              <div className="reports-summary-value">
                {candidateReport.summary.inactiveCandidates}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon purple">📄</div>
                <span className="reports-summary-title">Applications</span>
              </div>
              <div className="reports-summary-value">
                {candidateReport.summary.totalApplications}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="reports-table-container">
            <div className="reports-table-header">
              <h3 className="reports-table-title">Candidate Details</h3>
              <button
                className="reports-btn reports-btn-secondary"
                onClick={handleExportCandidateReport}
              >
                📥 Export CSV
              </button>
            </div>
            
            {/* Table Header with Show Entries */}
            <div className="table-header-section">
              <div className="table-header-wrapper">
                <div className="results-info">
                  <p className="results-count">
                    Showing <strong>{Math.min(candidateReport.data.length, candidateItemsPerPage)}</strong> of <strong>{candidateReport.data.length}</strong> candidates
                  </p>
                </div>
                <div className="show-entries-wrapper">
                  <label className="show-entries-label">Show entries:</label>
                  <select 
                    value={candidateItemsPerPage}
                    onChange={(e) => {
                      setCandidateItemsPerPage(Number(e.target.value));
                      setCandidatePage(0);
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
            <div className="unified-table-wrapper">
              <table className="unified-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Active</th>
                    <th>HR</th>
                    <th className="text-center">Applications</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {candidateReport.data.length === 0 ? (
                    <tr>
                      <td colSpan="8">
                        <div className="reports-empty-state">
                          <div className="reports-empty-state-icon">📊</div>
                          <h3>No Candidates Found</h3>
                          <p>Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    candidateReport.data
                      .slice(candidatePage * candidateItemsPerPage, (candidatePage + 1) * candidateItemsPerPage)
                      .map(candidate => (
                        <tr key={candidate.id}>
                          <td>{candidate.firstName} {candidate.lastName}</td>
                          <td>{candidate.email}</td>
                          <td>{candidate.phone || 'N/A'}</td>
                          <td>{candidate.status}</td>
                          <td>
                            <span className={`reports-status-badge ${candidate.active ? 'active' : 'inactive'}`}>
                              {candidate.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{candidate.hrName}</td>
                          <td className="text-center">{candidate.applicationCount}</td>
                          <td>{new Date(candidate.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {candidateReport.data.length > 0 && (() => {
              const totalPages = Math.ceil(candidateReport.data.length / candidateItemsPerPage);
              return (
                <div className="pagination-wrapper-centered">
                  <div className="pagination-container">
                    <button
                      className="pagination-btn pagination-btn-prev"
                      onClick={() => setCandidatePage(candidatePage - 1)}
                      disabled={candidatePage === 0}
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
                          (index >= candidatePage - 1 && index <= candidatePage + 1)
                        ) {
                          return (
                            <button
                              key={index}
                              className={`pagination-btn pagination-number ${candidatePage === index ? 'active' : ''}`}
                              onClick={() => setCandidatePage(index)}
                            >
                              {index + 1}
                            </button>
                          );
                        } else if (index === candidatePage - 2 || index === candidatePage + 2) {
                          return <span key={index} className="pagination-ellipsis">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      className="pagination-btn pagination-btn-next"
                      onClick={() => setCandidatePage(candidatePage + 1)}
                      disabled={candidatePage >= totalPages - 1}
                      title="Next Page"
                    >
                      <span>Next</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="pagination-info">
                    <span>Page <strong>{candidatePage + 1}</strong> of <strong>{totalPages}</strong></span>
                    <span className="pagination-separator">•</span>
                    <span>Total <strong>{candidateReport.data.length}</strong> entries</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Candidates by HR */}
          {candidateReport.candidatesByHr.length > 0 && (
            <div className="reports-table-container">
              <div className="reports-table-header">
                <h3 className="reports-table-title">Candidates by HR</h3>
              </div>
              <div className="unified-table-wrapper">
                <table className="unified-table">
                  <thead>
                    <tr>
                      <th>HR Name</th>
                      <th className="text-center">Candidate Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidateReport.candidatesByHr.map(item => (
                      <tr key={item.hrId}>
                        <td>{item.hrName}</td>
                        <td className="text-center">{item.candidateCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!candidateLoading && !candidateReport && (
        <div className="reports-empty-state">
          <div className="reports-empty-state-icon">📊</div>
          <h3>No Report Generated</h3>
          <p>Click "Generate Report" to view candidate data</p>
        </div>
      )}
    </div>
  );

  // Render Job Opening Report Tab
  const renderJobOpeningReportTab = () => (
    <div className="reports-tab-content">
      {/* Filters - Unified Style */}
      <div className="filter-card">
        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label">Date From</label>
            <input
              type="date"
              className="form-input"
              value={openingFilters.dateFrom || ''}
              onChange={(e) => handleOpeningFilterChange('dateFrom', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date To</label>
            <input
              type="date"
              className="form-input"
              value={openingFilters.dateTo || ''}
              onChange={(e) => handleOpeningFilterChange('dateTo', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={openingFilters.status || ''}
              onChange={(e) => handleOpeningFilterChange('status', e.target.value || null)}
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">HR User</label>
            <select
              className="form-select"
              value={openingFilters.hrId || ''}
              onChange={(e) => handleOpeningFilterChange('hrId', e.target.value || null)}
            >
              <option value="">All HR</option>
              {hrUsers.map(hr => (
                <option key={hr.id} value={hr.id}>{hr.fullName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              dispatch(setOpeningFilters({
                dateFrom: '',
                dateTo: '',
                status: '',
                hrId: '',
              }));
              dispatch(clearJobOpeningReport());
            }}
          >
            Clear Filters
          </button>
          <button
            className="btn-primary-cta"
            onClick={handleGenerateOpeningReport}
            disabled={openingLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            {openingLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {renderError(openingError)}

      {openingLoading && renderLoading()}

      {!openingLoading && openingReport && (
        <>
          {/* Summary Cards */}
          <div className="reports-summary">
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon blue">💼</div>
                <span className="reports-summary-title">Total Openings</span>
              </div>
              <div className="reports-summary-value">
                {openingReport.summary.totalOpenings}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon green">🟢</div>
                <span className="reports-summary-title">Active</span>
              </div>
              <div className="reports-summary-value">
                {openingReport.summary.activeOpenings}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon red">🔴</div>
                <span className="reports-summary-title">Closed</span>
              </div>
              <div className="reports-summary-value">
                {openingReport.summary.closedOpenings}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon purple">📄</div>
                <span className="reports-summary-title">Applications</span>
              </div>
              <div className="reports-summary-value">
                {openingReport.summary.totalApplications}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="reports-table-container">
            <div className="reports-table-header">
              <h3 className="reports-table-title">Job Opening Details</h3>
              <button
                className="reports-btn reports-btn-secondary"
                onClick={handleExportOpeningReport}
              >
                📥 Export CSV
              </button>
            </div>
            
            {/* Table Header with Show Entries */}
            <div className="table-header-section">
              <div className="table-header-wrapper">
                <div className="results-info">
                  <p className="results-count">
                    Showing <strong>{Math.min(openingReport.data.length, openingItemsPerPage)}</strong> of <strong>{openingReport.data.length}</strong> openings
                  </p>
                </div>
                <div className="show-entries-wrapper">
                  <label className="show-entries-label">Show entries:</label>
                  <select 
                    value={openingItemsPerPage}
                    onChange={(e) => {
                      setOpeningItemsPerPage(Number(e.target.value));
                      setOpeningPage(0);
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
            <div className="unified-table-wrapper">
              <table className="unified-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>HR</th>
                    <th className="text-center">Applications</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {openingReport.data.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="reports-empty-state">
                          <div className="reports-empty-state-icon">💼</div>
                          <h3>No Job Openings Found</h3>
                          <p>Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    openingReport.data
                      .slice(openingPage * openingItemsPerPage, (openingPage + 1) * openingItemsPerPage)
                      .map(opening => (
                        <tr key={opening.id}>
                          <td>{opening.title}</td>
                          <td>{opening.department}</td>
                          <td>{opening.location}</td>
                          <td>
                            <span className={`reports-status-badge ${opening.status ? opening.status.toLowerCase() : ''}`}>
                              {opening.status}
                            </span>
                          </td>
                          <td>{opening.hrName}</td>
                          <td className="text-center">{opening.applicationCount}</td>
                          <td>{new Date(opening.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {openingReport.data.length > 0 && (() => {
              const totalPages = Math.ceil(openingReport.data.length / openingItemsPerPage);
              return (
                <div className="pagination-wrapper-centered">
                  <div className="pagination-container">
                    <button
                      className="pagination-btn pagination-btn-prev"
                      onClick={() => setOpeningPage(openingPage - 1)}
                      disabled={openingPage === 0}
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
                          (index >= openingPage - 1 && index <= openingPage + 1)
                        ) {
                          return (
                            <button
                              key={index}
                              className={`pagination-btn pagination-number ${openingPage === index ? 'active' : ''}`}
                              onClick={() => setOpeningPage(index)}
                            >
                              {index + 1}
                            </button>
                          );
                        } else if (index === openingPage - 2 || index === openingPage + 2) {
                          return <span key={index} className="pagination-ellipsis">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      className="pagination-btn pagination-btn-next"
                      onClick={() => setOpeningPage(openingPage + 1)}
                      disabled={openingPage >= totalPages - 1}
                      title="Next Page"
                    >
                      <span>Next</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="pagination-info">
                    <span>Page <strong>{openingPage + 1}</strong> of <strong>{totalPages}</strong></span>
                    <span className="pagination-separator">•</span>
                    <span>Total <strong>{openingReport.data.length}</strong> entries</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Openings by HR */}
          {openingReport.openingsByHr.length > 0 && (
            <div className="reports-table-container">
              <div className="reports-table-header">
                <h3 className="reports-table-title">Openings by HR</h3>
              </div>
              <div className="unified-table-wrapper">
                <table className="unified-table">
                  <thead>
                    <tr>
                      <th>HR Name</th>
                      <th className="text-center">Opening Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openingReport.openingsByHr.map(item => (
                      <tr key={item.hrId}>
                        <td>{item.hrName}</td>
                        <td className="text-center">{item.openingCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Openings by Applications */}
          {openingReport.topOpenings && openingReport.topOpenings.length > 0 && (
            <div className="reports-table-container">
              <div className="reports-table-header">
                <h3 className="reports-table-title">Top Openings by Applications</h3>
              </div>
              <div className="unified-table-wrapper">
                <table className="unified-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th className="text-center">Application Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openingReport.topOpenings.map(item => (
                      <tr key={item.openingId}>
                        <td>{item.openingTitle}</td>
                        <td className="text-center">{item.applicationCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!openingLoading && !openingReport && (
        <div className="reports-empty-state">
          <div className="reports-empty-state-icon">💼</div>
          <h3>No Report Generated</h3>
          <p>Click "Generate Report" to view job opening data</p>
        </div>
      )}
    </div>
  );

  // State for expandable rows
  const [expandedHrRows, setExpandedHrRows] = useState({});

  const toggleHrRow = (hrId) => {
    setExpandedHrRows(prev => ({
      ...prev,
      [hrId]: !prev[hrId]
    }));
  };

  // Render HR Activity Report Tab
  const renderHrActivityReportTab = () => (
    <div className="reports-tab-content">
      {/* Filters - Unified Style */}
      <div className="filter-card">
        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label">HR User</label>
            <select
              className="form-select"
              value={activityFilters.hrId || ''}
              onChange={(e) => handleActivityFilterChange('hrId', e.target.value || null)}
            >
              <option value="">All HR Users</option>
              {hrUsers.map(hr => (
                <option key={hr.id} value={hr.id}>{hr.fullName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date From</label>
            <input
              type="date"
              className="form-input"
              value={activityFilters.dateFrom || ''}
              onChange={(e) => handleActivityFilterChange('dateFrom', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date To</label>
            <input
              type="date"
              className="form-input"
              value={activityFilters.dateTo || ''}
              onChange={(e) => handleActivityFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>
        <div className="filter-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              dispatch(setActivityFilters({
                hrId: '',
                dateFrom: '',
                dateTo: '',
              }));
              dispatch(clearHrActivityReport());
            }}
          >
            Clear Filters
          </button>
          <button
            className="btn-primary-cta"
            onClick={handleGenerateActivityReport}
            disabled={activityLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            {activityLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {renderError(activityError)}

      {activityLoading && renderLoading()}

      {!activityLoading && activityReport && (
        <>
          {/* Summary Cards */}
          <div className="reports-summary">
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon blue">👤</div>
                <span className="reports-summary-title">Total HR Users</span>
              </div>
              <div className="reports-summary-value">
                {activityReport.summary.totalHrUsers}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon green">👥</div>
                <span className="reports-summary-title">Candidates Added</span>
              </div>
              <div className="reports-summary-value">
                {activityReport.summary.totalCandidatesAdded}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon purple">💼</div>
                <span className="reports-summary-title">Openings Created</span>
              </div>
              <div className="reports-summary-value">
                {activityReport.summary.totalOpeningsCreated}
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-header">
                <div className="reports-summary-icon red">⭐</div>
                <span className="reports-summary-title">Most Active HR</span>
              </div>
              <div className="reports-summary-value" style={{ fontSize: '16px' }}>
                {activityReport.summary.mostActiveHr || 'N/A'}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="reports-table-container">
            <div className="reports-table-header">
              <h3 className="reports-table-title">HR Activity Details</h3>
              <button
                className="reports-btn reports-btn-secondary"
                onClick={handleExportActivityReport}
              >
                📥 Export Detailed CSV
              </button>
            </div>
            
            {/* Table Header with Show Entries */}
            <div className="table-header-section">
              <div className="table-header-wrapper">
                <div className="results-info">
                  <p className="results-count">
                    Showing <strong>{Math.min(activityReport.data.length, activityItemsPerPage)}</strong> of <strong>{activityReport.data.length}</strong> HR activities
                  </p>
                </div>
                <div className="show-entries-wrapper">
                  <label className="show-entries-label">Show entries:</label>
                  <select 
                    value={activityItemsPerPage}
                    onChange={(e) => {
                      setActivityItemsPerPage(Number(e.target.value));
                      setActivityPage(0);
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
            <div className="unified-table-wrapper">
              <table className="unified-table">
                <thead>
                  <tr>
                    <th style={{width: '24px'}}></th>
                    <th>HR Name</th>
                    <th>Email</th>
                    <th className="text-center">Candidates Added</th>
                    <th className="text-center">Openings Created</th>
                    <th className="text-center">Applications Managed</th>
                    <th className="text-center">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {activityReport.data.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="reports-empty-state">
                          <div className="reports-empty-state-icon">📈</div>
                          <h3>No HR Activity Found</h3>
                          <p>Try adjusting your date range</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    activityReport.data
                      .slice(activityPage * activityItemsPerPage, (activityPage + 1) * activityItemsPerPage)
                      .map(activity => (
                      <React.Fragment key={activity.hrId}>
                        <tr className="hr-activity-row">
                          <td className="text-center">
                            <button
                              className="expand-btn"
                              onClick={() => toggleHrRow(activity.hrId)}
                              title="View Details"
                            >
                              {expandedHrRows[activity.hrId] ? '▼' : '▶'}
                            </button>
                          </td>
                          <td><strong>{activity.hrName}</strong></td>
                          <td>{activity.email}</td>
                          <td className="text-center">
                            <span className="badge-count blue">{activity.candidatesAdded}</span>
                          </td>
                          <td className="text-center">
                            <span className="badge-count green">{activity.openingsCreated}</span>
                          </td>
                          <td className="text-center">{activity.totalApplicationsManaged || 0}</td>
                          <td className="text-center">
                            {activity.lastActivity ? new Date(activity.lastActivity).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                        {expandedHrRows[activity.hrId] && (
                          <tr className="expanded-details-row">
                            <td colSpan="7">
                              <div className="expanded-details-container">
                                {/* Candidates Section */}
                                {activity.candidates && activity.candidates.length > 0 && (
                                  <div className="details-section">
                                    <h4 className="details-section-title">
                                      👥 Candidates Added ({activity.candidates.length})
                                    </h4>
                                    <div className="unified-table-wrapper">
                                      <table className="unified-table">
                                        <thead>
                                          <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Company</th>
                                            <th>Profile</th>
                                            <th>Experience</th>
                                            <th>Status</th>
                                            <th className="text-center">Applications</th>
                                            <th>Created At</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {activity.candidates.map(candidate => (
                                            <tr key={candidate.id}>
                                              <td>{candidate.firstName} {candidate.lastName}</td>
                                              <td>{candidate.email}</td>
                                              <td>{candidate.phone || 'N/A'}</td>
                                              <td>{candidate.company || 'N/A'}</td>
                                              <td>{candidate.profile || 'N/A'}</td>
                                              <td>{candidate.experience || 'N/A'}</td>
                                              <td>
                                                <span className={`reports-status-badge ${candidate.status ? candidate.status.toLowerCase() : ''}`}>
                                                  {candidate.status}
                                                </span>
                                              </td>
                                              <td className="text-center">{candidate.applicationCount}</td>
                                              <td>{new Date(candidate.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {/* Openings Section */}
                                {activity.openings && activity.openings.length > 0 && (
                                  <div className="details-section">
                                    <h4 className="details-section-title">
                                      💼 Openings Created ({activity.openings.length})
                                    </h4>
                                    <div className="unified-table-wrapper">
                                      <table className="unified-table">
                                        <thead>
                                          <tr>
                                            <th>Job Title</th>
                                            <th>Department</th>
                                            <th>Location</th>
                                            <th className="text-center">Positions</th>
                                            <th>Status</th>
                                            <th className="text-center">Applications</th>
                                            <th>Created At</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {activity.openings.map(opening => (
                                            <tr key={opening.id}>
                                              <td><strong>{opening.title}</strong></td>
                                              <td>{opening.department}</td>
                                              <td>{opening.location}</td>
                                              <td className="text-center">{opening.positions}</td>
                                              <td>
                                                <span className={`reports-status-badge ${opening.status ? opening.status.toLowerCase() : ''}`}>
                                                  {opening.status}
                                                </span>
                                              </td>
                                              <td className="text-center">{opening.applicationCount}</td>
                                              <td>{new Date(opening.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {(!activity.candidates || activity.candidates.length === 0) && 
                                 (!activity.openings || activity.openings.length === 0) && (
                                  <div className="no-details">
                                    <p>No detailed activity found for this HR user in the selected date range.</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {activityReport.data.length > 0 && (() => {
              const totalPages = Math.ceil(activityReport.data.length / activityItemsPerPage);
              return (
                <div className="pagination-wrapper-centered">
                  <div className="pagination-container">
                    <button
                      className="pagination-btn pagination-btn-prev"
                      onClick={() => setActivityPage(activityPage - 1)}
                      disabled={activityPage === 0}
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
                          (index >= activityPage - 1 && index <= activityPage + 1)
                        ) {
                          return (
                            <button
                              key={index}
                              className={`pagination-btn pagination-number ${activityPage === index ? 'active' : ''}`}
                              onClick={() => setActivityPage(index)}
                            >
                              {index + 1}
                            </button>
                          );
                        } else if (index === activityPage - 2 || index === activityPage + 2) {
                          return <span key={index} className="pagination-ellipsis">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      className="pagination-btn pagination-btn-next"
                      onClick={() => setActivityPage(activityPage + 1)}
                      disabled={activityPage >= totalPages - 1}
                      title="Next Page"
                    >
                      <span>Next</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="pagination-info">
                    <span>Page <strong>{activityPage + 1}</strong> of <strong>{totalPages}</strong></span>
                    <span className="pagination-separator">•</span>
                    <span>Total <strong>{activityReport.data.length}</strong> entries</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {!activityLoading && !activityReport && (
        <div className="reports-empty-state">
          <div className="reports-empty-state-icon">📈</div>
          <h3>No Report Generated</h3>
          <p>Click "Generate Report" to view HR activity data</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Toaster />
      <div className="main-wrapper">
        <main className="content">
          <div className="app-ui reports-page">
            {/* Page Header */}
            <div className="page-header">
              <div className="page-header-title">
                <h1>Admin Reports</h1>
                <p>Comprehensive analytics and insights for candidates, job openings, and HR activity</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="reports-tabs">
              <button
                className={`reports-tab ${activeTab === 'candidates' ? 'active' : ''}`}
                onClick={() => setActiveTab('candidates')}
              >
                👥 Candidate Reports
              </button>
              <button
                className={`reports-tab ${activeTab === 'openings' ? 'active' : ''}`}
                onClick={() => setActiveTab('openings')}
              >
                💼 Job Opening Reports
              </button>
              <button
                className={`reports-tab ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                📈 HR Activity Reports
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'candidates' && renderCandidateReportTab()}
            {activeTab === 'openings' && renderJobOpeningReportTab()}
            {activeTab === 'activity' && renderHrActivityReportTab()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminReports;
