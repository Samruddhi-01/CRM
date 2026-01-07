import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import '../../styles/advanced-search/pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalResults, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  // Debug logging
  React.useEffect(() => {
    console.log('📟 Pagination Props:', { 
      currentPage, 
      totalPages, 
      totalResults, 
      itemsPerPage 
    });
  }, [currentPage, totalPages, totalResults, itemsPerPage]);

  // Calculate showing range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximum page numbers to show
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = 5;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
      
      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis-start');
        }
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis-end');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-wrapper">
      {/* Pagination Controls - Single Row */}
      <div className="pagination-controls-section">
        {/* Previous Page Button */}
        <button
          className="pagination-btn pagination-btn-nav pagination-btn-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
          aria-label="Go to previous page"
        >
          <ChevronLeft size={16} />
          <span className="pagination-btn-text">Previous</span>
        </button>
        
        {/* Page Numbers */}
        <div className="pagination-numbers">
          {pageNumbers.map((pageNum, index) => {
            if (typeof pageNum === 'string') {
              // Render ellipsis
              return (
                <span key={pageNum} className="pagination-ellipsis">
                  •••
                </span>
              );
            }
            
            // Render page number button
            return (
              <button
                key={pageNum}
                className={`pagination-btn pagination-btn-number ${
                  currentPage === pageNum ? 'active' : ''
                }`}
                onClick={() => onPageChange(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        {/* Next Page Button */}
        <button
          className="pagination-btn pagination-btn-nav pagination-btn-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Next Page"
          aria-label="Go to next page"
        >
          <span className="pagination-btn-text">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
