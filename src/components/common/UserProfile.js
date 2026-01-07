import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectUser } from '../../redux/slices/authSlice';
import '../../styles/components/user-profile.css';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  // Get initials from full name or username
  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = () => {
    return user?.fullName || user?.username || 'User';
  };

  // Get role display
  const getRoleDisplay = () => {
    const role = user?.role || 'USER';
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <div className="user-profile-container" ref={dropdownRef}>
      <button 
        className="user-profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          {getInitials()}
        </div>
        <div className="user-info">
          <span className="user-name">{getDisplayName()}</span>
          <span className="user-role">{getRoleDisplay()}</span>
        </div>
        <svg 
          className={`user-dropdown-icon ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
        >
          <path 
            d="M4 6L8 10L12 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="user-profile-dropdown">
          {/* User Info Section */}
          <div className="dropdown-user-info">
            <div className="dropdown-avatar">
              {getInitials()}
            </div>
            <div className="dropdown-user-details">
              <div className="dropdown-user-name">{getDisplayName()}</div>
              <div className="dropdown-user-email">{user?.email || 'No email'}</div>
              <div className="dropdown-user-role-badge">{getRoleDisplay()}</div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          {/* Menu Items */}
          <div className="dropdown-menu-items">
            <button 
              className="dropdown-menu-item"
              onClick={handleProfileClick}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span>My Profile</span>
            </button>
          </div>

          <div className="dropdown-divider"></div>

          {/* Logout Button */}
          <div className="dropdown-footer">
            <button 
              className="dropdown-logout-btn"
              onClick={handleLogout}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
