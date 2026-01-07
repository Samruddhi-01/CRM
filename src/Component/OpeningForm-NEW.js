import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  createOpening, 
  updateOpening, 
  fetchOpeningById, 
  clearCurrentOpening,
  selectCurrentOpening,
  selectOpeningsLoading,
  selectOpeningsError
} from '../redux/slices/openingsSlice';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OpeningForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Redux state
  const currentOpening = useSelector(selectCurrentOpening);
  const loading = useSelector(selectOpeningsLoading);
  const error = useSelector(selectOpeningsError);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    positions: 1,
    experience: '',
    minSalary: '',
    maxSalary: '',
    skills: '',
    description: '',
    responsibilities: '',
    requirements: '',
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});

  const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
  const STATUSES = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'CLOSED', label: 'Closed' }
  ];

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchOpeningById(id));
    } else {
      dispatch(clearCurrentOpening());
    }

    return () => {
      dispatch(clearCurrentOpening());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (currentOpening && isEditMode) {
      setFormData({
        title: currentOpening.title || '',
        department: currentOpening.department || '',
        location: currentOpening.location || '',
        type: currentOpening.type || '',
        positions: currentOpening.positions || 1,
        experience: currentOpening.experience || '',
        minSalary: currentOpening.minSalary || '',
        maxSalary: currentOpening.maxSalary || '',
        skills: currentOpening.skills || '',
        description: currentOpening.description || '',
        responsibilities: currentOpening.responsibilities || '',
        requirements: currentOpening.requirements || '',
        status: currentOpening.status || 'ACTIVE'
      });
    }
  }, [currentOpening, isEditMode]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error || 'An error occurred!', {
        duration: 4000,
        position: 'top-center',
      });
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (formData.positions < 1) newErrors.positions = 'Positions must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(updateOpening({ id, ...formData })).unwrap();
        toast.success('Job opening updated successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        await dispatch(createOpening(formData)).unwrap();
        toast.success('Job opening created successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        // Navigate to openings only after creating new opening
        navigate('/openings');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      toast.error(err.message || 'Failed to save job opening. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleCancel = () => {
    navigate('/openings');
  };

  if (loading && isEditMode) {
    return (
      <div className="app-root">
        <Sidebar />
        <div className="main-wrapper">
          <main className="content">
            <div className="opening-form-container">
              <div className="opening-form-loading">
                <LoadingSpinner />
                <span className="opening-form-loading-text">Loading job opening...</span>
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
          <div className="opening-form-container">
            <div className="opening-form-card">
              {/* Header */}
              <div className="opening-form-header">
                <h1 className="opening-form-title">
                  {isEditMode ? 'Edit Job Opening' : 'Create New Job Opening'}
                </h1>
                <p className="opening-form-subtitle">
                  {isEditMode ? 'Update job opening details and requirements' : 'Fill in the details to post a new job opening'}
                </p>
              </div>

              {/* Form Body */}
              <div className="opening-form-body">
                <form onSubmit={handleSubmit}>
                  {/* Required Fields Note */}
                  <div className="opening-form-grid">
                    <div className="opening-form-required-note">
                      Fields marked with <span className="required">*</span> are required
                    </div>

                    {/* Basic Information Section */}
                    <h2 className="opening-form-section-title">Basic Information</h2>

                    <div className="opening-form-group">
                      <label className="opening-form-label">
                        Job Title <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`opening-form-input ${errors.title ? 'error' : ''}`}
                        placeholder="e.g., Senior Software Engineer"
                        required
                      />
                      {errors.title && <span className="opening-form-error-text">{errors.title}</span>}
                    </div>

                    <div className="opening-form-group">
                      <label className="opening-form-label">
                        Department <span className="required">*</span>
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`opening-form-select ${errors.department ? 'error' : ''}`}
                        required
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && <span className="opening-form-error-text">{errors.department}</span>}
                    </div>

                    <div className="opening-form-group">
                      <label className="opening-form-label">
                        Location <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`opening-form-input ${errors.location ? 'error' : ''}`}
                        placeholder="e.g., San Francisco, CA"
                        required
                      />
                      {errors.location && <span className="opening-form-error-text">{errors.location}</span>}
                    </div>

                    <div className="opening-form-group">
                      <label className="opening-form-label">Job Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="opening-form-select"
                      >
                        <option value="">Select Type</option>
                        {JOB_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Position Details Section */}
                    <h2 className="opening-form-section-title">Position Details</h2>

                    <div className="opening-form-group">
                      <label className="opening-form-label">
                        Number of Positions <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="positions"
                        value={formData.positions}
                        onChange={handleInputChange}
                        min="1"
                        className={`opening-form-input ${errors.positions ? 'error' : ''}`}
                        required
                      />
                      {errors.positions && <span className="opening-form-error-text">{errors.positions}</span>}
                    </div>

                    <div className="opening-form-group">
                      <label className="opening-form-label">
                        Experience Required <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className={`opening-form-input ${errors.experience ? 'error' : ''}`}
                        placeholder="e.g., 3-5 years"
                        required
                      />
                      {errors.experience && <span className="opening-form-error-text">{errors.experience}</span>}
                    </div>

                    <div className="opening-form-group">
                      <label className="opening-form-label">Minimum Salary</label>
                      <input
                        type="text"
                        name="minSalary"
                        value={formData.minSalary}
                        onChange={handleInputChange}
                        className="opening-form-input"
                        placeholder="e.g., $80,000"
                      />
                    </div>

                    <div className="opening-form-group">
                      <label className="opening-form-label">Maximum Salary</label>
                      <input
                        type="text"
                        name="maxSalary"
                        value={formData.maxSalary}
                        onChange={handleInputChange}
                        className="opening-form-input"
                        placeholder="e.g., $120,000"
                      />
                    </div>

                    {/* Status and Skills */}
                    <h2 className="opening-form-section-title">Status & Requirements</h2>

                    <div className="opening-form-group">
                      <label className="opening-form-label">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="opening-form-select opening-status-select"
                      >
                        {STATUSES.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="opening-form-group" style={{gridColumn: 'span 3'}}>
                      <label className="opening-form-label">Required Skills</label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        className="opening-form-input"
                        placeholder="e.g., JavaScript, React, Node.js, MongoDB"
                      />
                      <span className="opening-form-helper">Separate multiple skills with commas</span>
                    </div>

                    {/* Detailed Information */}
                    <h2 className="opening-form-section-title">Detailed Information</h2>

                    <div className="opening-form-group full-width">
                      <label className="opening-form-label">Job Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="opening-form-textarea"
                        placeholder="Provide a detailed description of the role and what the ideal candidate will do..."
                        rows="4"
                      />
                    </div>

                    <div className="opening-form-group full-width">
                      <label className="opening-form-label">Key Responsibilities</label>
                      <textarea
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleInputChange}
                        className="opening-form-textarea"
                        placeholder="List the main responsibilities and day-to-day tasks..."
                        rows="4"
                      />
                    </div>

                    <div className="opening-form-group full-width">
                      <label className="opening-form-label">Requirements & Qualifications</label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        className="opening-form-textarea"
                        placeholder="List the minimum requirements, qualifications, and preferred skills..."
                        rows="4"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="opening-form-actions">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="opening-btn opening-btn-cancel"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="opening-btn opening-btn-submit"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Opening' : 'Create Opening')}
                      </button>
                    </div>
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

export default OpeningForm;
