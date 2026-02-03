import React from "react";
import { X } from "lucide-react";

const ActiveFiltersBar = ({ filters, onRemoveFilter, onClearAll }) => {
  if (!filters || filters.length === 0) return null;

  // Group filters by category
  const groupedFilters = filters.reduce((acc, filter) => {
    const category = filter.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(filter);
    return acc;
  }, {});

  return (
    <div className="active-filters-bar">
      <div className="active-filters-header">
        <h3 className="filters-applied-title">Filters Applied :</h3>
        <button className="hide-details-btn" onClick={onClearAll}>
          Clear All
        </button>
      </div>

      <div className="active-filters-content">
        {Object.entries(groupedFilters).map(([category, categoryFilters]) => (
          <div key={category} className="filter-category-group">
            <div className="filter-category-label">{category} :</div>

            <div className="filter-category-chips">
              {categoryFilters.map((filter, index) => (
                <div key={`${filter.key}-${index}`} className="active-filter-chip">
                  <span className="filter-chip-value">{filter.value}</span>

                  <button
                    className="filter-chip-close"
                    onClick={() => onRemoveFilter(filter.key, filter.value)}
                    aria-label={`Remove ${filter.value}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFiltersBar;
