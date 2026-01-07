import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterAccordion = ({ title, children, defaultOpen = false, count = null, isOpen, onToggle, sectionName }) => {
  const handleClick = () => {
    if (onToggle && sectionName) {
      onToggle(sectionName);
    } else {
      // Fallback to local state if no toggle function provided
      setLocalIsOpen(!localIsOpen);
    }
  };

  // Use local state as fallback
  const [localIsOpen, setLocalIsOpen] = React.useState(defaultOpen);
  const actuallyOpen = isOpen !== undefined ? isOpen : localIsOpen;

  return (
    <div className={`filter-accordion ${actuallyOpen ? 'open' : ''}`}>
      <button
        className="filter-accordion-header"
        onClick={handleClick}
        aria-expanded={actuallyOpen}
      >
        <span className="filter-accordion-title">
          {title}
          {count !== null && count > 0 && (
            <span className="ml-2 badge">{count}</span>
          )}
        </span>
        <ChevronDown className="filter-accordion-icon" />
      </button>
      <div className="filter-accordion-content">
        <div className="filter-accordion-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FilterAccordion;
