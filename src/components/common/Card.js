// Card Component - Reusable Card with Brand Colors

import React from 'react';

const Card = ({ 
  title, 
  children, 
  className = '', 
  onClick,
  hoverable = false,
  bordered = true,
  padding = 'default',
  headerActions
}) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${bordered ? 'card-bordered' : ''} card-padding-${padding} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {headerActions && <div className="card-actions">{headerActions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
