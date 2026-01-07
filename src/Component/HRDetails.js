import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { fetchHRUsers, selectHRUsers, selectHRLoading, selectHRError, clearError } from '../redux/slices/hrSlice';
import { fetchCandidates } from '../redux/slices/candidatesSlice';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HRDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const hrUsers = useSelector(selectHRUsers);
  const loading = useSelector(selectHRLoading);
  const error = useSelector(selectHRError);
  const allCandidates = useSelector(state => state.candidates.candidates);
  
  const [hr, setHR] = useState(null);
  const [hrCandidates, setHrCandidates] = useState([]);
  
  useEffect(() => {
    dispatch(fetchHRUsers());
    dispatch(fetchCandidates({ page: 0, size: 1000 }));
  }, [dispatch]);
  
  useEffect(() => {
    if (id && hrUsers.length > 0) {
      const foundHR = hrUsers.find(user => user.id === parseInt(id));
      if (foundHR) {
        setHR(foundHR);
        const candidates = allCandidates.filter(c => c.sourceHrId === foundHR.id);
        setHrCandidates(candidates);
      }
    }
  }, [id, hrUsers, allCandidates]);
  
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-center',
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleEdit = () => {
    navigate(`/hr-management/${id}`);
  };
  
  const handleBack = () => {
    navigate('/hr-management');
  };
  
  if (loading && !hr) {
    return (
      <>
        <Sidebar />
        <div className="hr-management-page">
          <div className="hr-management-container">
            <div className="loading-container">
              <LoadingSpinner />
              <span className="loading-text">Loading HR details...</span>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (!hr) {
    return (
      <>
        <Sidebar />
        <div className="main-wrapper">
          <main className="content">
            <div className="app-ui hr-management-page">
              <div className="page-header">
                <div>
                  <h1 className="page-header-title">HR User Not Found</h1>
                </div>
              </div>
              <div className="filter-card">
                <p>HR user with ID {id} not found.</p>
                <button className="btn-base btn-primary btn-md" onClick={handleBack}>
                  Back to HR Management
                </button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Toaster />
      <Sidebar />
      
      <div className="main-wrapper">
        <main className="content">
          <div className="app-ui hr-management-page">
            {/* Page Header */}
            <div className="page-header">
              <div>
                <h1 className="page-header-title">HR User Details</h1>
                <p className="page-header-subtitle">
                  View detailed information about {hr.fullName}
                </p>
              </div>
              <div className="page-header-actions">
                <button 
                  className="btn-base btn-primary btn-md" 
                  onClick={handleEdit}
                >
                  Edit HR User
                </button>
              </div>
            </div>

            {/* HR Details Card */}
            <div className="filter-card">
              <div className="form-grid">
                <div className="form-group col-1">
                  <label className="form-label">Full Name</label>
                  <div className="form-value">{hr.fullName}</div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Username</label>
                  <div className="form-value">{hr.username}</div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Email</label>
                  <div className="form-value">{hr.email}</div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Phone</label>
                  <div className="form-value">{hr.phone || '—'}</div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Status</label>
                  <div className="form-value">
                    <span className={`status-badge ${hr.active ? 'status-active' : 'status-inactive'}`}>
                      {hr.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Last Login</label>
                  <div className="form-value">{formatDate(hr.lastLogin)}</div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Account Created</label>
                  <div className="form-value">{formatDate(hr.createdAt)}</div>
                </div>
                
                <div className="form-group col-1">
                  <label className="form-label">Total Candidates Added</label>
                  <div className="form-value">{hrCandidates.length}</div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="filter-actions">
                <button 
                  type="button" 
                  className="btn-base btn-neutral btn-md" 
                  onClick={handleBack}
                >
                  Back to HR Management
                </button>
                <button 
                  type="button" 
                  className="btn-base btn-primary btn-md"
                  onClick={handleEdit}
                >
                  Edit HR User
                </button>
              </div>
            </div>

            {/* Candidates Section */}
            {hrCandidates.length > 0 && (
              <div className="table-card">
                <div className="table-header">
                  <h2 className="table-title">Candidates Added by {hr.fullName} ({hrCandidates.length})</h2>
                </div>
                
                <div className="unified-table-section">
                  <div className="unified-table-wrapper">
                    <table className="unified-table" role="table" aria-label={`Candidates added by ${hr.fullName}`}>
                      <thead>
                        <tr>
                          <th>NAME</th>
                          <th>EMAIL</th>
                          <th>PHONE</th>
                          <th>COMPANY</th>
                          <th>PROFILE</th>
                          <th>STATUS</th>
                          <th>CREATED</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hrCandidates.map((candidate) => (
                          <tr key={candidate.id}>
                            <td className="cell-name">
                              {candidate.firstName} {candidate.lastName}
                            </td>
                            <td className="cell-email">{candidate.email}</td>
                            <td className="cell-phone">{candidate.phone}</td>
                            <td>{candidate.company || '-'}</td>
                            <td>{candidate.profile || '-'}</td>
                            <td>
                              <span className={`badge-base badge-${candidate.status?.toLowerCase() === 'pending' ? 'warning' : candidate.status?.toLowerCase() === 'interested' ? 'success' : 'danger'}`}>
                                {candidate.status}
                              </span>
                            </td>
                            <td className="cell-date">{formatDate(candidate.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default HRDetails;
