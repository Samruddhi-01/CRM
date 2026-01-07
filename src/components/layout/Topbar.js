import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectUser } from '../../redux/slices/authSlice';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import UserProfile from '../common/UserProfile';
import GlobalSearch from '../../Component/GlobalSearch';

const Topbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/candidates') return 'Candidates';
    if (path.startsWith('/candidates/')) return 'Candidate Details';
    if (path === '/openings') return 'Job Openings';
    if (path.startsWith('/openings/')) return 'Opening Details';
    if (path === '/history') return 'History';
    if (path === '/hr-management') return 'HR Management';
    if (path === '/advanced-search') return 'Advanced Search';
    return 'HR Management System';
  };

  return (
    <header className="topbar">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle Menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* Page Title */}
      <div className="topbar-title">
      
        <span className="topbar-breadcrumb">
          {user?.fullName ? `Welcome, ${user.fullName.split(' ')[0]}` : 'Welcome'}
        </span>
      </div>

      {/* Global Search */}
      <div className="topbar-search">
        <GlobalSearch />
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        {/* User Profile */}
        <UserProfile />
      </div>
    </header>
  );
};

export default Topbar;
