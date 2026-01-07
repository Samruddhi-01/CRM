import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/pages/candidate-form.css';
import { fetchHRUsers, updateHRUser, createHRUser, selectHRUsers, selectHRLoading, selectHRError, clearError } from '../redux/slices/hrSlice';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HRForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const hrUsers = useSelector(selectHRUsers);
  const loading = useSelector(selectHRLoading);
  const error = useSelector(selectHRError);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    dispatch(fetchHRUsers());
  }, [dispatch]);
  
  useEffect(() => {
    if (id && hrUsers.length > 0) {
      const hr = hrUsers.find(user => user.id === parseInt(id));
      if (hr) {
        setIsEditing(true);
        setFormData({
          username: hr.username,
          password: '',
          fullName: hr.fullName,
          email: hr.email,
          phone: hr.phone || '',
        });
      }
    }
  }, [id, hrUsers]);
  
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-center',
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!isEditing && !formData.password) {
      errors.password = 'Password is required';
    }
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = 'Phone must be 10 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const submitData = { ...formData };
      
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }
      
      if (isEditing) {
        await dispatch(updateHRUser({ id: parseInt(id), data: submitData })).unwrap();
        toast.success('HR user updated successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        await dispatch(createHRUser(submitData)).unwrap();
        toast.success('HR user created successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      }
      
      navigate('/hr-management');
    } catch (error) {
      toast.error(error.message || error || 'Operation failed!', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };
  
  const handleCancel = () => {
    navigate('/hr-management');
  };
  
  if (loading && isEditing) {
    return (
      <>
        <Sidebar />
        <div className="hr-management-page">
          <div className="hr-management-container">
            <div className="loading-container">
              <LoadingSpinner />
              <span className="loading-text">Loading HR user...</span>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div className="app-root">
      <Toaster />
      <Sidebar />

      <div className="main-wrapper">
        <main className="content">
          <div className="candidate-form-container">
            <div className="candidate-form-card">
              <div className="candidate-form-header">
                <div className="form-mode-indicator">
                  <span className={`mode-badge ${isEditing ? 'mode-edit' : 'mode-create'}`}>
                    {isEditing ? '✏️ Edit Mode' : '➕ Create Mode'}
                  </span>
                </div>
                <h1 className="candidate-form-title">
                  {isEditing ? 'Edit HR User' : 'Add New HR User'}
                </h1>
                <p className="candidate-form-subtitle">
                  {isEditing ? 'Update HR user information' : 'Create a new HR user account'}
                </p>
              </div>

              <div className="candidate-form-body">
                <form onSubmit={handleSubmit}>
                  <div className="candidate-form-section">
                    <h2 className="candidate-form-section-title">Basic Information</h2>

                    <div className="candidate-form-grid">
                      <div className="candidate-form-group half-width">
                        <label className="candidate-form-label">
                          Full Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          className={`candidate-form-input ${formErrors.fullName ? 'input-error' : ''}`}
                          required
                        />
                        {formErrors.fullName && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {formErrors.fullName}
                          </span>
                        )}
                      </div>

                      <div className="candidate-form-group half-width">
                        <label className="candidate-form-label">
                          Username <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter username"
                          disabled={isEditing}
                          className={`candidate-form-input ${formErrors.username ? 'input-error' : ''}`}
                          required
                        />
                        {formErrors.username && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {formErrors.username}
                          </span>
                        )}
                      </div>

                      <div className="candidate-form-group half-width">
                        <label className="candidate-form-label">
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                          className={`candidate-form-input ${formErrors.email ? 'input-error' : ''}`}
                          required
                        />
                        {formErrors.email && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {formErrors.email}
                          </span>
                        )}
                      </div>

                      <div className="candidate-form-group half-width">
                        <label className="candidate-form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit phone number"
                          maxLength="10"
                          className={`candidate-form-input ${formErrors.phone ? 'input-error' : ''}`}
                        />
                        {formErrors.phone && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {formErrors.phone}
                          </span>
                        )}
                      </div>

                      <div className="candidate-form-group full-width">
                        <label className="candidate-form-label">
                          Password {!isEditing && <span className="required">*</span>}
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder={isEditing ? 'Leave blank to keep current' : 'Enter password'}
                          className={`candidate-form-input ${formErrors.password ? 'input-error' : ''}`}
                          required={!isEditing}
                        />
                        {formErrors.password && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {formErrors.password}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="candidate-form-actions">
                    <button
                      type="button"
                      className="btn-base btn-neutral btn-lg"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn-base btn-primary btn-lg ${isEditing ? 'btn-update' : 'btn-create'}`}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (isEditing ? 'Update HR' : 'Create HR')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRForm;
