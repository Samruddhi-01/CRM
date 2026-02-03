// Sidebar Component - Modern Clean Design

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from '../../redux/slices/authSlice';
import { selectSidebarCollapsed, toggleSidebar, closeSidebar } from '../../redux/slices/uiSlice';
import { ROLES } from '../../utils/constants';
import '../../styles/components/sidebar-modern.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  const collapsed = useSelector(selectSidebarCollapsed);
  
  // Track window size for mobile detection
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      dispatch(closeSidebar());
    }
  }, [location.pathname, dispatch, isMobile]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      dispatch(closeSidebar());
    }
  };
  
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '⚡',
      svgIcon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
      roles: [ROLES.ADMIN, ROLES.HR],
      category: 'main'
    },
    {
      path: '/appointments',
      label: 'Appointment',
      icon: '📅',
      svgIcon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
      roles: [ROLES.ADMIN, ROLES.HR],
      category: 'main'
    },
    {
      path: '/candidates',
      label: 'Candidates',
      icon: '�',
      svgIcon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      roles: [ROLES.ADMIN, ROLES.HR],
      category: 'candidates'
    },
    {
      path: '/search/advanced',
      label: 'Advanced Search',
      icon: '�',
      svgIcon: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
      roles: [ROLES.ADMIN, ROLES.HR],
      category: 'main'
    },
    
    {
      path: '/hr/my-candidates',
      label: 'My Candidate Remarks',
      icon: '📝',
      svgIcon: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
      roles: [ROLES.HR],
      category: 'candidates'
    },
    {
      path: '/openings',
      label: 'Job Openings',
      icon: '💼',
      svgIcon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
      roles: [ROLES.ADMIN, ROLES.HR],
      category: 'jobs'
    },
    {
      path: '/hr-management',
      label: 'HR Management',
      icon: '👨‍💼',
      svgIcon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
      roles: [ROLES.ADMIN],
      category: 'management'
    },
    {
      path: '/admin/hr-performance',
      label: 'HR Performance',
      icon: '📊',
      svgIcon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
      roles: [ROLES.ADMIN],
      category: 'management'
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '📋',
      svgIcon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
      roles: [ROLES.ADMIN],
      category: 'management'
    },
    {
      path: '/history',
      label: 'History',
      icon: '🕐',
      svgIcon: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
      roles: [ROLES.ADMIN, ROLES.HR],
      category: 'tracking'
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: '📈',
      svgIcon: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
      roles: [ROLES.ADMIN],
      category: 'tracking'
    },
  ];
  
  // Filter by role first
  const roleFilteredItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );
  
  // Then filter by search query
  const filteredMenuItems = roleFilteredItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(query);
  });
  
  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && isMobile && (
        <div 
          className="sidebar-overlay"
          onClick={() => dispatch(closeSidebar())}
        />
      )}
      
      <div className={`sidebar ${collapsed && !isMobile ? 'sidebar-collapsed' : ''} ${!collapsed && isMobile ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            {collapsed && !isMobile ? (
              <div className="logo-icon">Z</div>
            ) : (
              <>
                <div className="logo-icon">Z</div>
                <span className="logo-text">Zerlak CRM</span>
              </>
            )}
          </div>
          {!isMobile && (           <button className="sidebar-toggle" onClick={() => dispatch(toggleSidebar())}>
              {collapsed ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </button>
          )}
          {isMobile && (
            <button className="sidebar-close-mobile" onClick={() => dispatch(closeSidebar())}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        
        {(!collapsed || isMobile) && (
          <div className="sidebar-search">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}
        
        <nav className="sidebar-nav">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div key={item.path} className="nav-item-wrapper">
                <button
                  className={`nav-item ${location.pathname === item.path ? 'nav-item-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  title={collapsed && !isMobile ? item.label : ''}
                >
                  <div className="nav-icon-container">
                    <svg className="nav-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d={item.svgIcon} />
                    </svg>
                  </div>
                  {(!collapsed || isMobile) && (
                    <span className="nav-label">{item.label}</span>
                  )}
                  {location.pathname === item.path && (!collapsed || isMobile) && (
                    <div className="nav-badge"></div>
                  )}
                </button>
              </div>
            ))
          ) : (
            searchQuery && (!collapsed || isMobile) && (
              <div className="no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>No menu items found</p>
                <span>Try a different search term</span>
              </div>
            )
          )}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            {(!collapsed || isMobile) && (
              <div className="user-info">
                <div className="user-name">{user?.fullName || 'User'}</div>
                {/* <div className="user-email">{user?.email || 'user@email.com'}</div> */}
              </div>
            )}
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
