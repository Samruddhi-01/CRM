import React from "react";
import "../../styles/advanced-search/page-size-selector.css";

const PageSizeSelector = ({
  itemsPerPage = 10,
  totalResults = 0,
  onItemsPerPageChange,
}) => {
  if (!totalResults) return null;

  const handleChange = (e) => {
    const newSize = Number(e.target.value);
    if (newSize === itemsPerPage) return;

    // 🔥 Parent should reset page to 1 and re-fetch
    onItemsPerPageChange(newSize);
  };

  return (
    <div className="page-size-selector">
      <label htmlFor="page-size-select" className="page-size-label">
        Results per page:
      </label>
      <select
        id="page-size-select"
        className="page-size-select"
        value={itemsPerPage}
        onChange={handleChange}
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
