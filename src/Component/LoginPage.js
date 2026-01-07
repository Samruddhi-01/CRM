// LoginPage - Split Layout with Redux Integration
// Using Standalone CSS

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { login, selectIsAuthenticated, selectAuthLoading, selectAuthError, clearError } from '../redux/slices/authSlice';
import '../styles/pages/login.css';
import Image1 from "./Image/Logotext-removebg-preview.png";
import Image from "./Image/TREE_FINAL_LOGO_CDR-removebg-preview.png";

const LoginPage = () => {
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
    <div className="login-page">
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
      <div className="login-card">
        <div className="login-branding">
          <img src={Image} alt="Company Logo" className="login-logo" />
          <img src={Image1} alt="Startica Softech" className="login-brand-text" />
          <h1 className="login-welcome">Welcome back!</h1>
          <p className="login-subtitle">
            Sign in to manage candidates, track hiring progress,<br />
            and streamline your recruitment process.
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label htmlFor="username" className="login-label">Email ID</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your email id here!"
              className="login-input"
              disabled={loading}
              autoComplete="username"
            />
            {validationErrors.username && (
              <span className="field-error">{validationErrors.username}</span>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="login-input"
                disabled={loading}
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {validationErrors.password && (
              <span className="field-error">{validationErrors.password}</span>
            )}
          </div>

          <div className="login-actions">
            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-spinner"></span> : 'LogIn'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
