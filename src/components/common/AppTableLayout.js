/**
 * AppTableLayout Component
 * 
 * Reusable table wrapper that provides:
 * - Consistent layout with sidebar
 * - Responsive behavior (desktop table / mobile cards)
 * - Loading states
 * - Empty states
 * - Professional styling
 * 
 * Usage:
 * <AppTableLayout
 *   columns={[...]}           // Array of column definitions
 *   data={[...]}              // Array of data rows
 *   loading={false}           // Loading state
 *   emptyMessage="No data"    // Empty state message
 *   renderMobileCard={(row) => <div>...</div>}  // Optional mobile card renderer
 * />
 */

import React from 'react';
import '../../styles/components/unified-table.css';

const AppTableLayout = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon = '📋',
  renderMobileCard = null,
  className = '',
  onRowClick = null,
}) => {
  
  // Render empty state
  if (!loading && data.length === 0) {
    return (
      <div className="unified-table-section">
        <div className="unified-empty-state">
          <div className="unified-empty-state-icon">{emptyIcon}</div>
          <h3>No Data Found</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`unified-table-section ${className}`}>
      {/* Desktop/Tablet Table View */}
      <div className={`unified-table-wrapper ${loading ? 'unified-table-loading' : ''}`}>
        <table className="unified-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`${col.className || ''} ${col.hideOnTablet ? 'hide-tablet' : ''}`}
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${col.cellClassName || ''} ${col.hideOnTablet ? 'hide-tablet' : ''}`}
                  >
                    {col.render ? col.render(row, rowIndex) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="unified-mobile-cards">
        {data.map((row, index) => (
          renderMobileCard ? (
            renderMobileCard(row, index)
          ) : (
            <DefaultMobileCard key={row.id || index} row={row} columns={columns} />
          )
        ))}
      </div>
    </div>
  );
};

// Default mobile card if no custom renderer provided
const DefaultMobileCard = ({ row, columns }) => {
  const primaryCol = columns[0];
  const statusCol = columns.find(col => col.field === 'status' || col.type === 'status');
  const actionsCol = columns.find(col => col.type === 'actions');
  
  return (
    <div className="unified-mobile-card">
      <div className="unified-card-header">
        <div className="unified-card-title">
          <div className="unified-card-name">
            {primaryCol?.render ? primaryCol.render(row) : row[primaryCol?.field]}
          </div>
          {statusCol && (
            <div className="unified-card-subtitle">
              {statusCol.render ? statusCol.render(row) : row[statusCol.field]}
            </div>
          )}
        </div>
        {actionsCol && (
          <div>
            {actionsCol.render(row)}
          </div>
        )}
      </div>
      
      <div className="unified-card-body">
        {columns
          .filter((col, idx) => idx > 0 && col.type !== 'status' && col.type !== 'actions')
          .map((col, idx) => (
            <div key={idx} className="unified-card-row">
              <span className="unified-card-label">{col.header}:</span>
              <span className="unified-card-value">
                {col.render ? col.render(row) : row[col.field] || '-'}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AppTableLayout;
