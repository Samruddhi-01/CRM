import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, selectSidebarCollapsed } from '../../redux/slices/uiSlice';

const MobileMenuButton = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector(selectSidebarCollapsed);
  
  return (
    <button 
      className="mobile-menu-btn"
      onClick={() => dispatch(toggleSidebar())}
      aria-label="Toggle Menu"
    >
      {collapsed ? '☰' : '✕'}
    </button>
  );
};

export default MobileMenuButton;
