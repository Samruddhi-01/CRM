import React from 'react';
import '../../styles/advanced-search/page-size-selector.css';

const PageSizeSelector = ({ itemsPerPage, onItemsPerPageChange, totalResults }) => {
  return (
    <div className="page-size-selector">
      <label htmlFor="page-size-select" className="page-size-label">Show:</label>
      <select
        id="page-size-select"
        className="page-size-select"
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        disabled={totalResults === 0}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
};

export default PageSizeSelector;
