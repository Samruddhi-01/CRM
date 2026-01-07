import React from 'react';
import { X } from 'lucide-react';

const FilterChips = ({ filters, onRemove }) => {
  if (filters.length === 0) return null;

  return (
    <div className="filter-chips">
      {filters.map((filter, index) => (
        <div key={index} className="filter-chip">
          <span>{filter.label}</span>
          <button
            className="filter-chip-remove"
            onClick={() => onRemove(filter.key)}
            aria-label={`Remove ${filter.label}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilterChips;
