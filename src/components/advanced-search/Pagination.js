import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/advanced-search/pagination.css";

const Pagination = ({
  currentPage = 1,
  totalPages = 0,
  totalResults = 0,
  itemsPerPage = 10,
  onPageChange,
}) => {
  // 🚫 Do not show pagination if no data
  if (!totalResults || totalPages <= 1) return null;

  const safePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page); // 🔥 parent will call API
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) end = 5;
      if (currentPage >= totalPages - 2) start = totalPages - 4;

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("ellipsis-start");
      }

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("ellipsis-end");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{totalResults}</strong> results
      </div>

      <div className="pagination-controls-section">
        <button
          className="pagination-btn pagination-btn-nav"
          onClick={() => safePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((p) =>
            typeof p === "string" ? (
              <span key={p} className="pagination-ellipsis">•••</span>
            ) : (
              <button
                key={p}
                className={`pagination-btn pagination-btn-number ${
                  currentPage === p ? "active" : ""
                }`}
                onClick={() => safePageChange(p)}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          className="pagination-btn pagination-btn-nav"
          onClick={() => safePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
