import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/pages/opening-form.css';
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
    companyName: '',
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});

  const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Support'];
  const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
  const EXPERIENCE_LEVELS = [
    { value: 'Fresher (0-1 year)', label: 'Fresher (0-1 year)', icon: '🌱', years: '0-1' },
    { value: 'Entry Level (1-2 years)', label: 'Entry Level (1-2 years)', icon: '📝', years: '1-2' },
    { value: 'Junior (2-4 years)', label: 'Junior (2-4 years)', icon: '🎯', years: '2-4' },
    { value: 'Mid-Level (4-6 years)', label: 'Mid-Level (4-6 years)', icon: '💼', years: '4-6' },
    { value: 'Senior (6-10 years)', label: 'Senior (6-10 years)', icon: '🏆', years: '6-10' },
    { value: 'Lead (10+ years)', label: 'Lead (10+ years)', icon: '⭐', years: '10+' },
    { value: 'Expert (15+ years)', label: 'Expert (15+ years)', icon: '👑', years: '15+' }
  ];
  const STATUSES = [
    { value: 'ACTIVE', label: 'Active', icon: '✅' },
    { value: 'DRAFT', label: 'Draft', icon: '📝' },
    { value: 'ON_HOLD', label: 'On Hold', icon: '⏸️' },
    { value: 'CLOSED', label: 'Closed', icon: '🔒' }
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
        companyName: currentOpening.companyName || '',
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
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
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
                  {isEditMode ? 'Edit Job Opening' : 'Add New Job Opening'}
                </h1>
                <p className="opening-form-subtitle">
                  {isEditMode ? 'Update job opening details and requirements' : 'Enter job details to create a new opening'}
                </p>
              </div>

              {/* Form Body */}
              <div className="opening-form-body">
                <form onSubmit={handleSubmit}>
                  {/* Basic Information Section */}
                  <div className="opening-form-section">
                    <h2 className="opening-form-section-title">Basic Information</h2>
                    
                    <div className="opening-form-grid">
                      <div className="opening-form-group">
                        <label className="opening-form-label">
                          Status <span className="required">*</span>
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="opening-form-select opening-status-select"
                          required
                        >
                          {STATUSES.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.icon} {status.label}
                            </option>
                          ))}
                        </select>
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
                          Company Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`opening-form-input ${errors.companyName ? 'error' : ''}`}
                          placeholder="e.g., Tech Corp Inc."
                          required
                        />
                        {errors.companyName && <span className="opening-form-error-text">{errors.companyName}</span>}
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
                    </div>
                  </div>

                  {/* Position Details Section */}
                  <div className="opening-form-section">
                    <h2 className="opening-form-section-title">Position Details</h2>
                    
                    <div className="opening-form-grid">
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
                          Experience Level <span className="required">*</span>
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className={`opening-form-select ${errors.experience ? 'error' : ''}`}
                          required
                        >
                          <option value="">Select Experience Level</option>
                          {EXPERIENCE_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.icon} {level.label}
                            </option>
                          ))}
                        </select>
                        {errors.experience && <span className="opening-form-error-text">{errors.experience}</span>}
                        <span className="opening-form-helper">Choose the appropriate experience level for this role</span>
                      </div>

                      <div className="opening-form-group">
                        <label className="opening-form-label">Minimum Salary (LPA)</label>
                        <input
                          type="text"
                          name="minSalary"
                          value={formData.minSalary}
                          onChange={handleInputChange}
                          className="opening-form-input"
                          placeholder="e.g., 8.0"
                        />
                      </div>

                      <div className="opening-form-group">
                        <label className="opening-form-label">Maximum Salary (LPA)</label>
                        <input
                          type="text"
                          name="maxSalary"
                          value={formData.maxSalary}
                          onChange={handleInputChange}
                          className="opening-form-input"
                          placeholder="e.g., 12.0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills & Requirements Section */}
                  <div className="opening-form-section">
                    <h2 className="opening-form-section-title">Skills & Requirements</h2>
                    
                    <div className="opening-form-grid">
                      <div className="opening-form-group full-width">
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
                    </div>
                  </div>

                  {/* Detailed Information Section */}
                  <div className="opening-form-section">
                    <h2 className="opening-form-section-title">Detailed Information</h2>
                    
                    <div className="opening-form-grid">
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
                    </div>
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
