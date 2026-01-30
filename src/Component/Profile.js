import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/profile.css';
//import { selectUser } from '../redux/slices/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api'; // Use the correct API service
import { selectUser, setUser, selectIsAuthenticated } from '../redux/slices/authSlice';



const Profile = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Debug: Log user data to see what's available
  React.useEffect(() => {
    console.log('Profile - User data:', user);
    console.log('Profile - createdAt:', user?.createdAt);
    console.log('Profile - lastLogin:', user?.lastLogin);
  }, [user]);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation only if user wants to change password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) {
  //     toast.error('Please fix the errors in the form');
  //     return;
  //   }

  //   setLoading(true);
    
  //   try {
  //     // TODO: Implement API call to update profile
  //     // const response = await apiService.put('/api/auth/profile', formData);
      
  //     // Simulate API call
  //     //await new Promise(resolve => setTimeout(resolve, 1000));
  //     await api.put(`/auth/email?email=${formData.email}`);

      
  //     toast.success('Profile updated successfully');
  //     setIsEditing(false);
      
  //     // Reset password fields
  //     setFormData(prev => ({
  //       ...prev,
  //       currentPassword: '',
  //       newPassword: '',
  //       confirmPassword: ''
  //     }));
  //   } catch (error) {
  //     toast.error(error.message || 'Failed to update profile');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!validateForm()) return;

//   setLoading(true);

//   try {
//     const res = await api.put(`/auth/email?email=${formData.email}`);

//     dispatch(updateUser(res.data.data));

//     toast.success('Email updated successfully');
//     setIsEditing(false);

//   } catch (error) {
//     toast.error(error.response?.data?.message || 'Failed to update email');
//   } finally {
//     setLoading(false);
//   }
// };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  try {
    // const res = await api.put('/auth/email', null, {
    //   params: { email: formData.email }
    // });
    const res = await api.put('/auth/email', null, {
      params: { email: formData.email }
    });


    dispatch(setUser(res.data.data));

    toast.success('Email updated successfully');
    setIsEditing(false);

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to update email');
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const getRoleDisplay = () => {
    const role = user?.role || 'USER';
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <div className="profile-container">
      <Toaster />
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <button 
            className="profile-back-btn"
            onClick={() => navigate(-1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your personal information and account settings</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {getInitials()}
            </div>
            <div className="profile-avatar-info">
              <h2 className="profile-name">{user?.fullName || 'User'}</h2>
              <p className="profile-email">{user?.email || 'No email'}</p>
              <span className="profile-role-badge">{getRoleDisplay()}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-icon">📅</div>
              <div className="profile-stat-info">
                <span className="profile-stat-label">Member Since</span>
                <span className="profile-stat-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-icon">🔐</div>
              <div className="profile-stat-info">
                <span className="profile-stat-label">Last Login</span>
                <span className="profile-stat-value">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Information Form */}
        <div className="profile-form-card">
          <div className="profile-form-header">
            <h3 className="profile-form-title">Personal Information</h3>
            {!isEditing && (
              <button 
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Basic Information */}
            <div className="profile-form-section">
              <h4 className="profile-section-title">Basic Information</h4>
              
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label className="profile-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`profile-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <span className="profile-error">{errors.fullName}</span>}
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">Username</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="profile-input disabled"
                  />
                  <span className="profile-help-text">Username cannot be changed</span>
                </div>
              </div>

              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label className="profile-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`profile-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="profile-error">{errors.email}</span>}
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`profile-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <span className="profile-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Role</label>
                <input
                  type="text"
                  value={getRoleDisplay()}
                  disabled
                  className="profile-input disabled"
                />
                <span className="profile-help-text">Role is assigned by administrator</span>
              </div>
            </div>

            {/* Change Password Section */}
            {isEditing && (
              <div className="profile-form-section">
                <h4 className="profile-section-title">Change Password</h4>
                <p className="profile-section-subtitle">Leave blank if you don't want to change your password</p>
                
                <div className="profile-form-group">
                  <label className="profile-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`profile-input ${errors.currentPassword ? 'error' : ''}`}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && <span className="profile-error">{errors.currentPassword}</span>}
                </div>

                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label className="profile-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`profile-input ${errors.newPassword ? 'error' : ''}`}
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && <span className="profile-error">{errors.newPassword}</span>}
                  </div>

                  <div className="profile-form-group">
                    <label className="profile-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`profile-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && <span className="profile-error">{errors.confirmPassword}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            {isEditing && (
              <div className="profile-form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="profile-btn profile-btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-btn profile-btn-save"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
