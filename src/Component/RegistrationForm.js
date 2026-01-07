// RegistrationForm.js - HR Registration with Redux Integration

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/pages/registration.css';
import { register, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../redux/slices/authSlice';
import { validateEmail, validatePassword } from '../utils/helpers';
import Button from '../components/common/Button';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agree) {
      errors.agree = 'You must agree to the terms';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      
      await dispatch(register(registrationData)).unwrap();
      // Navigation handled by useEffect when isAuthenticated changes
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
  
  return (
    <div className="registration-container">
      {/* Left Panel - White with Logo */}
      <div className="registration-left">
        <div className="logo-section">
          <div className="logo-circle">
            <svg viewBox="0 0 100 100" className="logo-svg">
              <circle cx="50" cy="50" r="45" fill="#0B2F6B" />
              <text x="50" y="60" fontSize="40" fill="white" textAnchor="middle" fontWeight="bold">S</text>
            </svg>
          </div>
          <h1 className="company-name">STARTICA</h1>
          <p className="company-tagline">Recruitment Management System</p>
        </div>
      </div>
      
      {/* Right Panel - Red with Registration Form */}
      <div className="registration-right">
        <div className="registration-form-wrapper">
          <h2>Create HR Account</h2>
          <p className="registration-subtitle">Join our recruitment team</p>
          
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={validationErrors.firstName ? 'error' : ''}
                  disabled={loading}
                />
                {validationErrors.firstName && (
                  <span className="error-message">{validationErrors.firstName}</span>
                )}
              </div>
              
              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={validationErrors.lastName ? 'error' : ''}
                  disabled={loading}
                />
                {validationErrors.lastName && (
                  <span className="error-message">{validationErrors.lastName}</span>
                )}
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className={validationErrors.email ? 'error' : ''}
                disabled={loading}
              />
              {validationErrors.email && (
                <span className="error-message">{validationErrors.email}</span>
              )}
            </div>
            
            <div className="form-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className={validationErrors.phone ? 'error' : ''}
                disabled={loading}
              />
              {validationErrors.phone && (
                <span className="error-message">{validationErrors.phone}</span>
              )}
            </div>
            
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={validationErrors.password ? 'error' : ''}
                  disabled={loading}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              {validationErrors.password && (
                <span className="error-message">{validationErrors.password}</span>
              )}
            </div>
            
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={validationErrors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              {validationErrors.confirmPassword && (
                <span className="error-message">{validationErrors.confirmPassword}</span>
              )}
            </div>
            
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="agree">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            {validationErrors.agree && (
              <span className="error-message">{validationErrors.agree}</span>
            )}
            
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="register-button"
            >
              Create Account
            </Button>
            
            <p className="signin-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
