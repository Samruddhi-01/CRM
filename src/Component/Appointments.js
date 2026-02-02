import React, { useState, useEffect } from 'react';
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
import '../styles/pages/appointments-unified.css';
import '../styles/pages/appointment.css';

import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import apiService from '../services/api';
import { selectUserRole, selectUser } from '../redux/slices/authSlice';
import { ROLES } from '../utils/constants';
 
const Appointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);
 
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    // Client-side filtering
    let filtered = allAppointments;

    if (filters.search) {
      filtered = filtered.filter(appointment =>
        appointment.candidateName?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter(appointment =>
        appointment.appointmentDate?.includes(filters.date)
      );
    }

    if (filters.company) {
      filtered = filtered.filter(appointment =>
        appointment.company?.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.profile) {
      filtered = filtered.filter(appointment =>
        appointment.profile?.toLowerCase().includes(filters.profile.toLowerCase())
      );
    }

    if (filters.reference) {
      filtered = filtered.filter(appointment =>
        appointment.reference?.toLowerCase().includes(filters.reference.toLowerCase())
      );
    }

    setTotalItems(filtered.length);
    
    // Apply pagination to filtered results
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    
    setAppointments(paginatedResults);
  }, [filters, allAppointments, currentPage, itemsPerPage]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/api/hr/appointments');

      if (response.data) {
        const allAppointmentsData = response.data.appointments || response.data.content || response.data || [];
        setAllAppointments(allAppointmentsData);
      } else {
        setAllAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error(error.message || 'Error loading appointments');
      setAllAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAppointment(null);
  };
 
  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await apiService.delete(`/api/hr/appointments/${appointmentId}`);
      toast.success('Appointment deleted successfully');
      loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error(error.message || 'Error deleting appointment');
    }
  };
 
  const handleEdit = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
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
              <label className="form-label"><strong>Search</strong></label>
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
              <label className="form-label"><strong>Date</strong></label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group col-1">
              <label className="form-label"><strong>Company</strong></label>
              <input
                type="text"
                placeholder="Company name..."
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group col-1">
              <label className="form-label"><strong>Profile</strong></label>
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
                <label className="form-label"><strong>Reference</strong></label>
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
                Showing <strong>{appointments.length}</strong> appointments
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
                  <th className="th-email">Email</th>
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
                      <div className="name-info">
                        <div className="name">{appointment.candidateName || '-'}</div>
                      </div>
                    </td>
                    <td className="email-cell">
                      <div className="email-info">
                        <div className="email">{appointment.email || '-'}</div>
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
                        <button
                          className="unified-action-btn unified-btn-delete"
                          onClick={() => handleDelete(appointment.id)}
                          title="Delete appointment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="candidates-modal-overlay" onClick={closeDetailsModal}>
          <div className="candidates-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="candidates-modal-header">
              <h2 className="candidates-modal-title">Appointment Details</h2>
              <button className="candidates-modal-close" onClick={closeDetailsModal}>
                ✕
              </button>
            </div>
            <div className="candidates-modal-body">
              {/* Personal Information */}
              <div className="detail-section">
                <h3 className="section-title">Candidate Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Candidate Name</span>
                    <span className="detail-value">{selectedAppointment.candidateName || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{selectedAppointment.email || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{selectedAppointment.phone || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="detail-section">
                <h3 className="section-title">Appointment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Appointment Date</span>
                    <span className="detail-value">
                      {selectedAppointment.appointmentDate
                        ? new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '-'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Appointment Time</span>
                    <span className="detail-value">{selectedAppointment.appointmentTime || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{selectedAppointment.company || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Profile/Position</span>
                    <span className="detail-value">{selectedAppointment.profile || '-'}</span>
                  </div>
                  {userRole === ROLES.ADMIN && (
                    <div className="detail-item">
                      <span className="detail-label">Reference</span>
                      <span className="detail-value">{selectedAppointment.reference || '-'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {selectedAppointment.notes && (
                <div className="detail-section">
                  <h3 className="section-title">Additional Notes</h3>
                  <div className="detail-item full-width">
                    <span className="detail-label">Notes</span>
                    <span className="detail-value">{selectedAppointment.notes}</span>
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
 
export default Appointment;
 
 