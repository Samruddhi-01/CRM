
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/pages/appointment-form.css';
import { selectUserRole, selectUser } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROLES } from '../utils/constants';
import apiService from '../services/api';
 
const AppointmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
 
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);
 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    company: '',
    profile: '',
    reference: '',
    notes: ''
  });
 
  const [fieldErrors, setFieldErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
 
  // Validation rules
  const VALIDATION_RULES = {
    phone: {
      pattern: /^[6-9]\d{9}$/,
      message: 'Phone must be 10 digits starting with 6-9',
      maxLength: 10
    },
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      message: 'Please enter a valid email address'
    },
    name: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'Name must be 2-50 characters, letters only'
    }
  };
 
  // Load appointment data if editing
  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);
 
  const loadAppointment = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/api/hr/appointments/${id}`);
      const data = response.data;
      
      setFormData({
        candidateName: data.candidateName || '',
        email: data.email || '',
        phone: data.phone || '',
        appointmentDate: data.appointmentDate ? data.appointmentDate.split('T')[0] : '',
        appointmentTime: data.appointmentTime || '',
        company: data.company || '',
        profile: data.profile || '',
        reference: data.reference || '',
        notes: data.notes || ''
      });
    } catch (error) {
      console.error('Error loading appointment:', error);
      toast.error(error.message || 'Error loading appointment');
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  };
 
  // Validate field
  const validateField = (name, value) => {
    const stringValue = value != null ? String(value) : '';
   
    if (!stringValue || stringValue.trim() === '') {
      return null;
    }
 
    switch (name) {
      case 'candidateName':
        if (!VALIDATION_RULES.name.pattern.test(stringValue.trim())) {
          return VALIDATION_RULES.name.message;
        }
        break;
 
      case 'email':
        if (!VALIDATION_RULES.email.pattern.test(stringValue.trim())) {
          return VALIDATION_RULES.email.message;
        }
        break;
 
      case 'phone':
        const cleanPhone = stringValue.replace(/\D/g, '');
        if (cleanPhone.length > 0 && cleanPhone.length !== 10) {
          return 'Phone must be exactly 10 digits';
        }
        if (cleanPhone.length === 10 && !VALIDATION_RULES.phone.pattern.test(cleanPhone)) {
          return VALIDATION_RULES.phone.message;
        }
        break;
 
      default:
        break;
    }
 
    return null;
  };
 
  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
   
    // Validate on change
    const error = validateField(name, value);
   
    if (error) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
 
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Validate all required fields
    const newErrors = {};
   
    if (!formData.candidateName?.trim()) {
      newErrors.candidateName = 'Candidate name is required';
    } else {
      const nameError = validateField('candidateName', formData.candidateName);
      if (nameError) newErrors.candidateName = nameError;
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailError = validateField('email', formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Date is required';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Time is required';
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.profile?.trim()) {
      newErrors.profile = 'Profile is required';
    }

    if (userRole === ROLES.ADMIN && !formData.reference?.trim()) {
      newErrors.reference = 'Reference is required for admin';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      toast.error(`Please fix ${Object.keys(newErrors).length} validation error(s)`);
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await apiService.put(`/api/hr/appointments/${id}`, formData);
        toast.success('Appointment updated successfully!', { duration: 3000, position: 'top-center' });
      } else {
        await apiService.post('/api/hr/appointments', formData);
        toast.success('Appointment created successfully!', { duration: 3000, position: 'top-center' });
      }

      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(error.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };
 
  if (loading && id) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          <div className="appointment-form-loading">
            <LoadingSpinner />
            <span className="appointment-form-loading-text">Loading appointment...</span>
          </div>
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
          <div className="appointment-form-container">
            <div className="appointment-form-card">
              {/* Header */}
              <div className="appointment-form-header">
                <div className="form-mode-indicator">
                  <span className={`mode-badge ${id ? 'mode-edit' : 'mode-create'}`}>
                    {id ? '✏️ Edit Mode' : '➕ Create Mode'}
                  </span>
                </div>
                <h1 className="appointment-form-title">
                  {id ? 'Edit Appointment' : 'Add New Appointment'}
                </h1>
                <p className="appointment-form-subtitle">
                  {id ? 'Update appointment information' : 'Enter appointment details to schedule a new interview'}
                </p>
              </div>
             
              {/* Form Body */}
              <div className="appointment-form-body">
                <form onSubmit={handleSubmit}>
                  {/* Validation Summary */}
                  {Object.keys(fieldErrors).length > 0 && (
                    <div className="validation-summary-banner">
                      <div className="validation-summary-header">
                        <span className="validation-icon">⚠️</span>
                        <span className="validation-title">
                          Please fix {Object.keys(fieldErrors).length} validation error{Object.keys(fieldErrors).length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <ul className="validation-summary-list">
                        {Object.entries(fieldErrors).map(([field, error]) => {
                          const fieldNames = {
                            candidateName: 'Candidate Name',
                            email: 'Email',
                            phone: 'Phone Number',
                            appointmentDate: 'Appointment Date',
                            appointmentTime: 'Appointment Time',
                            company: 'Company',
                            profile: 'Profile/Position',
                            reference: 'Reference'
                          };
                          return (
                            <li key={field} onClick={() => {
                              const element = document.querySelector(`[name="${field}"]`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                setTimeout(() => element.focus(), 300);
                              }
                            }}>
                              <strong>{fieldNames[field] || field}:</strong> {error}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
 {/* Appointment Information Section */}
                  <div className="appointment-form-section">
                    <h2 className="appointment-form-section-title">Appointment Information</h2>
                   
                    <div className="appointment-form-grid">
                      {/* Candidate Name */}
                      <div className="appointment-form-group">
                        <label className="appointment-form-label">
                          Candidate Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="candidateName"
                          value={formData.candidateName}
                          onChange={handleChange}
                          placeholder="Enter candidate name"
                          className={`appointment-form-input ${fieldErrors.candidateName ? 'error' : ''}`}
                          required
                        />
                        {fieldErrors.candidateName && (
                          <span className="appointment-form-error">{fieldErrors.candidateName}</span>
                        )}
                      </div>
 
                      {/* Email */}
                      <div className="appointment-form-group">
                        <label className="appointment-form-label">
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="candidate@example.com"
                          className={`appointment-form-input ${fieldErrors.email ? 'error' : ''}`}
                          required
                        />
                        {fieldErrors.email && (
                          <span className="appointment-form-error">{fieldErrors.email}</span>
                        )}
                      </div>
 
                      {/* Phone */}
                      <div className="appointment-form-group">
                        <label className="appointment-form-label">
                          Phone Number <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit number"
                          maxLength="10"
                          className={`appointment-form-input ${fieldErrors.phone ? 'error' : ''}`}
                          required
                        />
                        {fieldErrors.phone && (
                          <span className="appointment-form-error">{fieldErrors.phone}</span>
                        )}
                      </div>
 
                      {/* Appointment Date */}
                      <div className="appointment-form-group">
                        <label className="appointment-form-label">
                          Appointment Date <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          className={`appointment-form-input ${fieldErrors.appointmentDate ? 'error' : ''}`}
                          required
                        />
                        {fieldErrors.appointmentDate && (
                          <span className="appointment-form-error">{fieldErrors.appointmentDate}</span>
                        )}
                      </div>
 
                      {/* Appointment Time */}
                      <div className="appointment-form-group">
                        <label className="appointment-form-label">
                          Appointment Time <span className="required">*</span>
                        </label>
                        <input
                          type="time"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleChange}
                          className={`appointment-form-input ${fieldErrors.appointmentTime ? 'error' : ''}`}
                          required
                        />
                        {fieldErrors.appointmentTime && (
                          <span className="appointment-form-error">{fieldErrors.appointmentTime}</span>
                        )}
                      </div>
 
                      {/* Company */}
                      <div className="appointment-form-group">
                        <label className="appointment-form-label">
                          Company <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Company name"
                          className={`appointment-form-input ${fieldErrors.company ? 'error' : ''}`}
                          required
                        />
                        {fieldErrors.company && (
                          <span className="appointment-form-error">{fieldErrors.company}</span>
                        )}
                      </div>
 
                      {/* Profile/Position */}
                      <div className="appointment-form-group">
                        <label className="appointment-form-label">
                          Profile/Position <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="profile"
                          value={formData.profile}
                          onChange={handleChange}
                          placeholder="Job profile"
                          className={`appointment-form-input ${fieldErrors.profile ? 'error' : ''}`}
                          required
                        />
                        {fieldErrors.profile && (
                          <span className="appointment-form-error">{fieldErrors.profile}</span>
                        )}
                      </div>
 
                      {/* Reference - Only for Admin */}
                      {userRole === ROLES.ADMIN && (
                        <div className="appointment-form-group">
                          <label className="appointment-form-label">
                            Reference <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            placeholder="Reference name/ID"
                            className={`appointment-form-input ${fieldErrors.reference ? 'error' : ''}`}
                            required
                          />
                          {fieldErrors.reference && (
                            <span className="appointment-form-error">{fieldErrors.reference}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
 
                  {/* Additional Notes Section */}
                  <div className="appointment-form-section">
                    <h2 className="appointment-form-section-title">Additional Information</h2>
                   
                    <div className="appointment-form-group">
                      <label className="appointment-form-label">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any additional notes about this appointment..."
                        className="appointment-form-textarea"
                        rows="4"
                      />
                    </div>
                  </div>
 
                  {/* Form Actions */}
                  <div className="appointment-form-actions">
                    <button
                      type="submit"
                      className="appointment-form-btn appointment-form-btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : id ? 'Update Appointment' : 'Create Appointment'}
                    </button>
                    <button
                      type="button"
                      className="appointment-form-btn appointment-form-btn-secondary"
                      onClick={() => navigate('/appointments')}
                      disabled={loading}
                    >
                      Cancel
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
 
export default AppointmentForm;
 
 