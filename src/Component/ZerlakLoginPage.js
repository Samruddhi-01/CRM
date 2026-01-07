// ZerlakLoginPage - Split Layout with Redux Integration
// Using Standalone CSS

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { login, selectIsAuthenticated, selectAuthLoading, selectAuthError, clearError } from '../redux/slices/authSlice';
import '../styles/pages/zerlak-login.css';
import Image1 from "./Image/Logotext-removebg-preview.png";
import Image from "./Image/Zerlak_logo.png";

const ZerlakLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await dispatch(login(formData)).unwrap();
      // Store success message in session storage for display on dashboard
      sessionStorage.setItem('toastMessage', 'Login successful! Welcome back.');
      sessionStorage.setItem('toastType', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed - Error received:', err);
      
      // Convert error to string for checking
      const errorString = typeof err === 'string' ? err : String(err);
      
      // Check if account is deactivated
      if (errorString.toLowerCase().includes('deactivat')) {
        toast.error('⚠️ Your account has been deactivated. Please contact your administrator.', {
          duration: 6000,
          style: {
            background: '#FEF2F2',
            color: '#991B1B',
            border: '2px solid #FCA5A5',
            fontWeight: '600',
            fontSize: '15px',
          },
        });
      } else {
        toast.error(errorString || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="zerlak-login-page">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            fontWeight: '600',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              background: '#ECFDF5',
              color: '#047857',
              border: '2px solid #D1FAE5',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '2px solid #FCA5A5',
            },
          },
        }}
      />
      <div className="zerlak-login-card">
        <div className="zerlak-login-branding">
          <img src={Image} alt="Company Logo" className="zerlak-login-logo" />
          <div className="zerlak-logo-text">
            <span className="zerlak-text">Zerlak</span>
            <span className="technology-text"> Technology</span>
          </div>
          <h1 className="zerlak-login-welcome">Welcome back!</h1>
          <p className="zerlak-login-subtitle">
            Sign in to manage candidates, track hiring progress,<br />
            and streamline your recruitment process Zerlak.
          </p>
        </div>

        <form onSubmit={handleLogin} className="zerlak-login-form">
          <div className="zerlak-login-field">
            <label htmlFor="username" className="zerlak-login-label">Email ID</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your email id here!"
              className="zerlak-login-input"
              disabled={loading}
              autoComplete="username"
            />
            {validationErrors.username && (
              <span className="zerlak-field-error">{validationErrors.username}</span>
            )}
          </div>

          <div className="zerlak-login-field">
            <label htmlFor="password" className="zerlak-login-label">Password</label>
            <div className="zerlak-login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="zerlak-login-input"
                disabled={loading}
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="zerlak-password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {validationErrors.password && (
              <span className="zerlak-field-error">{validationErrors.password}</span>
            )}
          </div>

          <div className="zerlak-login-actions">
            <a href="/forgot-password" className="zerlak-forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" className="zerlak-login-btn" disabled={loading}>
            {loading ? <span className="zerlak-login-spinner"></span> : 'LogIn'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ZerlakLoginPage;