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
import '../styles/components/appointment.css';
import '../styles/pages/appointment-unified.css';
import { selectUserRole, selectUser } from '../redux/slices/authSlice';
import { ROLES } from '../utils/constants';

const Appointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    company: '',
    profile: '',
    reference: '',
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAppointments();
  }, [currentPage, itemsPerPage, filters]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const params = new URLSearchParams({
        page: Math.max(0, currentPage - 1),
        size: itemsPerPage,
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.date) params.append('date', filters.date);
      if (filters.company) params.append('company', filters.company);
      if (filters.profile) params.append('profile', filters.profile);
      if (filters.reference) params.append('reference', filters.reference);

      const response = await fetch(
        `http://localhost:8080/api/hr/appointments?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Backend returns a paged response: use `content` for items and metadata
        setAppointments(data.content || []);
        setTotalElements(typeof data.totalElements === 'number' ? data.totalElements : 0);
        setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
      } else {
        toast.error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAppointments();
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:8080/api/hr/appointments/${appointmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        toast.success('Appointment deleted successfully');
        loadAppointments();
      } else {
        toast.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Error deleting appointment');
    }
  };

  const handleEdit = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const handleViewDetails = (appointment) => {
    // You can implement a modal or navigate to details page
    console.log('View details:', appointment);
  };

  return (
    <div className="app-ui appointments-page">
      <Toaster />
      
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            Appointments
            {userRole === ROLES.HR && (
              <span className="status-badge info" style={{marginLeft: '12px', fontSize: '11px'}}>
                Your Appointments Only
              </span>
            )}
          </h1>
        </div>
        <div className="page-header-actions">
          <button
            className="btn-primary-cta"
            onClick={() => navigate('/appointments/new')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Appointment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-card">
        <form onSubmit={handleSearch}>
          <div className="filter-grid">
            <div className="form-group col-1">
              <label className="form-label">Search Name</label>
              <div className="search-input-wrapper">
                <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Candidate name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group col-1">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group col-1">
              <label className="form-label">Company</label>
              <input
                type="text"
                placeholder="Company name..."
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group col-1">
              <label className="form-label">Profile</label>
              <input
                type="text"
                placeholder="Job profile..."
                value={filters.profile}
                onChange={(e) => setFilters({ ...filters, profile: e.target.value })}
                className="form-input"
              />
            </div>

            {userRole === ROLES.ADMIN && (
              <div className="form-group col-1">
                <label className="form-label">Reference</label>
                <input
                  type="text"
                  placeholder="Reference..."
                  value={filters.reference}
                  onChange={(e) => setFilters({ ...filters, reference: e.target.value })}
                  className="form-input"
                />
              </div>
            )}
          </div>

          <div className="filter-actions">
            {(filters.search || filters.date || filters.company || filters.profile || filters.reference) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFilters({
                    search: '',
                    date: '',
                    company: '',
                    profile: '',
                    reference: '',
                  });
                  setCurrentPage(1);
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
      
      {/* Appointments Table */}
      <div className="appointments-table-card">
        {/* Table Header with Show Entries */}
        <div className="table-header-section">
          <div className="table-header-wrapper">
              <div className="results-info">
                <p className="results-count">
                  Showing <strong>{appointments.length}</strong> of <strong>{totalElements}</strong> appointments
                </p>
              </div>
            <div className="show-entries-wrapper">
              <label className="show-entries-label">Show entries:</label>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
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
            <div className="loading-text">Loading appointments...</div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No appointments found</h3>
            <p>Create your first appointment to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="unified-table">
              <thead>
                <tr>
                  <th className="th-name">Name</th>
                  <th className="th-date">Date</th>
                  <th className="th-company">Company</th>
                  <th className="th-profile">Profile</th>
                  {userRole === ROLES.ADMIN && <th className="th-reference">Reference</th>}
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="table-row">
                    <td className="name-cell">
                      <div className="name-badge">
                        <div className="avatar">
                          {appointment.candidateName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="name-info">
                          <div className="name">{appointment.candidateName || '-'}</div>
                          <div className="email">{appointment.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="date-cell">
                      {appointment.appointmentDate 
                        ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          }) + ' ' + (appointment.appointmentTime || '')
                        : '-'}
                    </td>
                    <td className="company-cell">
                      {appointment.company || '-'}
                    </td>
                    <td className="profile-cell">
                      <span className="profile-badge">
                        {appointment.profile || '-'}
                      </span>
                    </td>
                    {userRole === ROLES.ADMIN && (
                      <td className="reference-cell">
                        {appointment.reference || '-'}
                      </td>
                    )}
                    <td className="cell-actions">
                      <div className="unified-action-buttons">
                        <button
                          className="unified-action-btn unified-btn-edit"
                          onClick={() => handleEdit(appointment.id)}
                          title="Edit appointment"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="unified-action-btn unified-btn-view"
                          onClick={() => handleViewDetails(appointment)}
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        {userRole === ROLES.ADMIN && (
                          <button
                            className="unified-action-btn unified-btn-delete"
                            onClick={() => handleDelete(appointment.id)}
                            title="Delete appointment"
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
        )}
        {/* Simple pagination controls */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <span className="pagination-info">Page {currentPage} of {totalPages}</span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
