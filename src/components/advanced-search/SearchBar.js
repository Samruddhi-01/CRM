import React, { useState, useEffect } from 'react';
import { Search, X, Save, FolderOpen, HelpCircle } from 'lucide-react';

const SearchBar = ({ 
  value, 
  onChange, 
  onSearch, 
  onClear, 
  onSaveSearch, 
  onLoadSearch,
  isLoading = false,
  savedSearches = []
}) => {
  const [showOperators, setShowOperators] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onClear();
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        {/* Main Search Input */}
        <div className="search-bar-main">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input-large"
              placeholder="Search by name, skills, designation, college, company... supports AND / OR / exact match / -exclude"
              value={localValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {localValue && (
              <X
                className="search-clear-icon"
                onClick={handleClear}
              />
            )}
            {isLoading && (
              <div className="search-loading">
                <div className="spinner" />
              </div>
            )}
          </div>

          <div className="search-actions">
            <button
              className="btn-search-primary"
              onClick={onSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              className="btn-search-secondary"
              onClick={handleClear}
            >
              Clear Search
            </button>
            <button
              className="btn btn-ghost btn-search-secondary"
              onClick={onSaveSearch}
              title="Save Current Search"
            >
              <Save size={18} />
            </button>
            <button
              className="btn btn-ghost btn-search-secondary"
              onClick={onLoadSearch}
              title="Load Saved Search"
            >
              <FolderOpen size={18} />
            </button>
          </div>
        </div>

        {/* Boolean Operators Help */}
        {showOperators && (
          <div className="search-operators-help">
            <div className="operator-help-item">
              <span className="operator-code">AND</span>
              <span>All terms must match</span>
              <span className="operator-example">Java AND Spring</span>
            </div>
            <div className="operator-help-item">
              <span className="operator-code">OR</span>
              <span>Any term can match</span>
              <span className="operator-example">React OR Angular</span>
            </div>
            <div className="operator-help-item">
              <span className="operator-code">NOT / -</span>
              <span>Exclude term</span>
              <span className="operator-example">Python -Django</span>
            </div>
            <div className="operator-help-item">
              <span className="operator-code">""</span>
              <span>Exact phrase</span>
              <span className="operator-example">"Full Stack Developer"</span>
            </div>
            <button
              className="toggle-operators-help"
              onClick={() => setShowOperators(false)}
            >
              Hide Help
            </button>
          </div>
        )}

        {!showOperators && (
          <button
            className="flex items-center gap-2 text-sm text-blue mt-2 cursor-pointer"
            onClick={() => setShowOperators(true)}
          >
            <HelpCircle size={16} />
            Show Boolean Operators Help
          </button>
        )}

        {/* Saved Searches Bar */}
        {savedSearches.length > 0 && (
          <div className="saved-searches-bar">
            <div className="saved-searches-label">Recent Searches:</div>
            <div className="saved-searches-list">
              {savedSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  className={`saved-search-chip ${search.active ? 'active' : ''}`}
                  onClick={() => onLoadSearch(search)}
                >
                  {search.isFavorite && (
                    <span className="saved-search-star">⭐</span>
                  )}
                  {search.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
