// Loading Spinner Component

import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullScreen = false, message = '' }) => {
  if (fullScreen) {
    return (
      <div className="loading-spinner-overlay">
        <div className="loading-spinner-container">
          <div className={`loading-spinner loading-spinner-${size}`}></div>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="loading-spinner-inline">
      <div className={`loading-spinner loading-spinner-${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
