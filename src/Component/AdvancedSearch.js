// AdvancedSearch.js - Enterprise-Grade Advanced Search Module
// Professional multi-tab search with comprehensive filters, saved searches, and export

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExperienceRangeFilter from '../components/advanced-search/ExperienceRangeFilter';
import {
  performCandidateSearch,
  updateFilter,
  updateFilters,
  resetFilters,
  changePage,
  changeSort,
  saveCurrentSearch,
  loadSavedSearch,
  deleteSavedSearch
} from '../redux/slices/candidateSearchSlice';
import {
  performOpeningSearch,
  updateFilter as updateOpeningFilter,
  updateFilters as updateOpeningFilters,
  resetFilters as resetOpeningFilters,
  changePage as changeOpeningPage,
  changeSort as changeOpeningSort,
  saveCurrentSearch as saveOpeningSearch,
  loadSavedSearch as loadOpeningSavedSearch,
  deleteSavedSearch as deleteOpeningSavedSearch
} from '../redux/slices/openingSearchSlice';
import { selectUser } from '../redux/slices/authSlice';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  
  const [activeTab, setActiveTab] = useState('candidates');
  const [showSaveSearchDialog, setShowSaveSearchDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  
  const candidateSearch = useSelector(state => state.candidateSearch);
  const openingSearch = useSelector(state => state.openingSearch);
  
  const currentSearch = activeTab === 'candidates' ? candidateSearch : openingSearch;
  
  // Load saved searches from localStorage on mount
  useEffect(() => {
    // Load candidate saved searches
    const candidateSaved = localStorage.getItem('candidateSavedSearches');
    if (candidateSaved) {
      try {
        const searches = JSON.parse(candidateSaved);
        // We'll handle this in the reducer, but ensure it's loaded
      } catch (error) {
        console.error('Error loading candidate saved searches:', error);
      }
    }
    
    // Load opening saved searches
    const openingSaved = localStorage.getItem('openingSavedSearches');
    if (openingSaved) {
      try {
        const searches = JSON.parse(openingSaved);
        // We'll handle this in the reducer
      } catch (error) {
        console.error('Error loading opening saved searches:', error);
      }
    }
  }, []);
  
  // Skills options
  const skillsOptions = [
    'Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
    'Node.js', 'Spring Boot', 'Django', 'Flask', 'SQL', 'MongoDB', 'PostgreSQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
    'HTML', 'CSS', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum'
  ];
  
  const locationOptions = [
    'Bangalore', 'Pune', 'Mumbai', 'Hyderabad', 'Chennai', 'Delhi', 'Noida',
    'Gurgaon', 'Kolkata', 'Ahmedabad', 'Remote', 'Hybrid'
  ];
  
  const departmentOptions = [
    'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR',
    'Operations', 'Finance', 'Customer Success', 'Quality Assurance'
  ];
  
  const candidateStatusOptions = [
    'PENDING', 'INTERESTED', 'NOT_INTERESTED', 'TELL_LATER',
    'CONTACTED', 'OFFERED', 'HIRED'
  ];
  
  const openingStatusOptions = ['ACTIVE', 'INACTIVE', 'CLOSED'];
  const openingTypeOptions = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];
  
  // Handle candidate filter changes
  const handleCandidateFilterChange = (field, value) => {
    dispatch(updateFilter({ field, value }));
  };
  
  // Handle opening filter changes
  const handleOpeningFilterChange = (field, value) => {
    dispatch(updateOpeningFilter({ field, value }));
  };
  
  // Multi-select handler
  const handleMultiSelect = (field, value, currentValues = []) => {
    const isCandidate = activeTab === 'candidates';
    let newValues;
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    if (isCandidate) {
      handleCandidateFilterChange(field, newValues);
    } else {
      handleOpeningFilterChange(field, newValues);
    }
  };
  
  // Perform search
  const handleSearch = () => {
    if (activeTab === 'candidates') {
      const searchPayload = {
        ...candidateSearch.filters,
        page: candidateSearch.pagination.page,
        size: candidateSearch.pagination.size,
        sortBy: candidateSearch.pagination.sortBy,
        sortDirection: candidateSearch.pagination.sortDirection
      };
      dispatch(performCandidateSearch(searchPayload));
    } else {
      const searchPayload = {
        ...openingSearch.filters,
        page: openingSearch.pagination.page,
        size: openingSearch.pagination.size,
        sortBy: openingSearch.pagination.sortBy,
        sortDirection: openingSearch.pagination.sortDirection
      };
      dispatch(performOpeningSearch(searchPayload));
    }
  };
  
  // Reset filters
  const handleReset = () => {
    if (activeTab === 'candidates') {
      dispatch(resetFilters());
    } else {
      dispatch(resetOpeningFilters());
    }
  };
  
  // Save current search
  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      alert('Please enter a name for this search');
      return;
    }
    
    if (activeTab === 'candidates') {
      dispatch(saveCurrentSearch(searchName));
    } else {
      dispatch(saveOpeningSearch(searchName));
    }
    
    setSearchName('');
    setShowSaveSearchDialog(false);
  };
  
  // Load saved search
  const handleLoadSavedSearch = (savedSearch) => {
    if (activeTab === 'candidates') {
      dispatch(loadSavedSearch(savedSearch));
      const searchPayload = {
        ...savedSearch.filters,
        page: candidateSearch.pagination.page,
        size: candidateSearch.pagination.size,
        sortBy: candidateSearch.pagination.sortBy,
        sortDirection: candidateSearch.pagination.sortDirection
      };
      dispatch(performCandidateSearch(searchPayload));
    } else {
      dispatch(loadOpeningSavedSearch(savedSearch));
      const searchPayload = {
        ...savedSearch.filters,
        page: openingSearch.pagination.page,
        size: openingSearch.pagination.size,
        sortBy: openingSearch.pagination.sortBy,
        sortDirection: openingSearch.pagination.sortDirection
      };
      dispatch(performOpeningSearch(searchPayload));
    }
    setShowSavedSearches(false);
  };
  
  // Delete saved search
  const handleDeleteSavedSearch = (searchId) => {
    if (window.confirm('Are you sure you want to delete this saved search?')) {
      if (activeTab === 'candidates') {
        dispatch(deleteSavedSearch(searchId));
      } else {
        dispatch(deleteOpeningSavedSearch(searchId));
      }
    }
  };
  
  // Export results
  const handleExport = () => {
    const results = currentSearch.results.content;
    
    if (!results || results.length === 0) {
      alert('No results to export. Please perform a search first.');
      return;
    }
    
    // Prepare CSV data
    let csvContent = '';
    let headers = [];
    let rows = [];
    
    if (activeTab === 'candidates') {
      // Candidate headers
      headers = [
        'Name', 'Email', 'Phone', 'Experience (Years)', 
        'Current Package', 'Expected CTC', 'Skills', 
        'Location', 'Status', 'Source', 'Created Date'
      ];
      
      // Candidate rows
      rows = results.map(candidate => [
        `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
        candidate.email || '',
        candidate.phone || '',
        candidate.experience || '',
        candidate.currentPackage || '',
        candidate.expectedCTC || '',
        candidate.skills || '',
        candidate.currentLocation || '',
        candidate.status || '',
        candidate.source || '',
        candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : ''
      ]);
    } else {
      // Job Opening headers
      headers = [
        'Title', 'Department', 'Type', 'Location', 
        'Experience Required', 'Salary Range', 'Skills', 
        'Status', 'Created Date'
      ];
      
      // Job Opening rows
      rows = results.map(opening => [
        opening.title || '',
        opening.department || '',
        opening.type || '',
        opening.location || '',
        opening.experienceRequired || '',
        `${opening.minSalary || ''} - ${opening.maxSalary || ''}`.trim(),
        opening.skills || '',
        opening.status || '',
        opening.createdAt ? new Date(opening.createdAt).toLocaleDateString() : ''
      ]);
    }
    
    // Build CSV content
    csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const escapedRow = row.map(cell => {
        // Escape cells containing commas, quotes, or newlines
        const cellStr = String(cell || '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const filename = `${activeTab}_search_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };
  
  // Navigate to detail
  const handleResultClick = (id) => {
    if (activeTab === 'candidates') {
      navigate(`/candidates/${id}`);
    } else {
      navigate(`/openings/edit/${id}`);
    }
  };
  
  // Get active filters count
  const getActiveFiltersCount = () => {
    const filters = currentSearch.filters;
    let count = 0;
    
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (!Array.isArray(value)) count++;
      }
    });
    
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  
  return (
    <div className="advanced-search-container">
      {/* Header */}
      <div className="advanced-search-header">
        <div className="header-left">
          <h1>
            Advanced Search
            {user?.role === 'HR' && <span className="badge badge-blue" style={{marginLeft: '12px', fontSize: '11px', padding: '4px 8px'}}>Your Data Only</span>}
          </h1>
          <p>{user?.role === 'HR' ? 'Search and filter across your data with powerful filters' : 'Search and filter across all your data with powerful filters'}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
          >
            📁 Saved Searches ({currentSearch.savedSearches?.length || 0})
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setShowSaveSearchDialog(true)}
            disabled={activeFiltersCount === 0}
          >
            💾 Save Current Search
          </button>
          <button 
            className="btn-primary"
            onClick={handleExport}
            disabled={currentSearch.results.content?.length === 0}
          >
            📥 Export Results
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="search-tabs">
        <button 
          className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          👥 Candidates
          {candidateSearch.results.totalElements > 0 && (
            <span className="tab-badge">{candidateSearch.results.totalElements}</span>
          )}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'openings' ? 'active' : ''}`}
          onClick={() => setActiveTab('openings')}
        >
          💼 Job Openings
          {openingSearch.results.totalElements > 0 && (
            <span className="tab-badge">{openingSearch.results.totalElements}</span>
          )}
        </button>
      </div>
      
      {/* Saved Searches Panel */}
      {showSavedSearches && (
        <div className="saved-searches-panel">
          <div className="panel-header">
            <h3>Saved Searches</h3>
            <button onClick={() => setShowSavedSearches(false)}>✕</button>
          </div>
          <div className="saved-searches-list">
            {currentSearch.savedSearches?.length === 0 ? (
              <p className="empty-message">No saved searches yet</p>
            ) : (
              currentSearch.savedSearches?.map(search => (
                <div key={search.id} className="saved-search-item">
                  <div className="search-info">
                    <h4>{search.name}</h4>
                    <p>{new Date(search.savedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="search-actions">
                    <button 
                      className="btn-load"
                      onClick={() => handleLoadSavedSearch(search)}
                    >
                      Load
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteSavedSearch(search.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Save Search Dialog */}
      {showSaveSearchDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Save Current Search</h3>
            <input
              type="text"
              className="search-name-input"
              placeholder="Enter a name for this search..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveSearch()}
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowSaveSearchDialog(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveSearch}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="search-content">
        {/* Filters Panel */}
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filters {activeFiltersCount > 0 && <span className="filter-count">({activeFiltersCount})</span>}</h3>
            {activeFiltersCount > 0 && (
              <button className="btn-clear" onClick={handleReset}>
                Clear All
              </button>
            )}
          </div>
          
          {activeTab === 'candidates' ? (
            <CandidateFilters
              filters={candidateSearch.filters}
              onFilterChange={handleCandidateFilterChange}
              onMultiSelect={handleMultiSelect}
              skillsOptions={skillsOptions}
              locationOptions={locationOptions}
              statusOptions={candidateStatusOptions}
            />
          ) : (
            <OpeningFilters
              filters={openingSearch.filters}
              onFilterChange={handleOpeningFilterChange}
              onMultiSelect={handleMultiSelect}
              skillsOptions={skillsOptions}
              locationOptions={locationOptions}
              departmentOptions={departmentOptions}
              statusOptions={openingStatusOptions}
              typeOptions={openingTypeOptions}
            />
          )}
          
          <button className="btn-search" onClick={handleSearch}>
            {currentSearch.isSearching ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
        
        {/* Results Panel */}
        <div className="results-panel">
          {currentSearch.isSearching ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching...</p>
            </div>
          ) : currentSearch.results.content?.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="results-header">
                <div className="results-info">
                  <h3>
                    {currentSearch.results.totalElements} Results Found
                  </h3>
                  {activeFiltersCount > 0 && (
                    <div className="active-filters-summary">
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                    </div>
                  )}
                </div>
                <div className="results-sort">
                  <label>Sort by:</label>
                  <select 
                    value={currentSearch.pagination.sortBy}
                    onChange={(e) => {
                      if (activeTab === 'candidates') {
                        dispatch(changeSort({ field: e.target.value, direction: 'DESC' }));
                      } else {
                        dispatch(changeOpeningSort({ field: e.target.value, direction: 'DESC' }));
                      }
                      handleSearch();
                    }}
                  >
                    {activeTab === 'candidates' ? (
                      <>
                        <option value="createdAt">Latest</option>
                        <option value="firstName">Name</option>
                        <option value="experience">Experience</option>
                        <option value="currentPackage">Package</option>
                      </>
                    ) : (
                      <>
                        <option value="createdAt">Latest</option>
                        <option value="title">Title</option>
                        <option value="department">Department</option>
                        <option value="minSalary">Salary</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              
              {/* Results List */}
              <div className="results-list">
                {activeTab === 'candidates' ? (
                  currentSearch.results.content.map(candidate => (
                    <CandidateCard 
                      key={candidate.id} 
                      candidate={candidate}
                      onClick={() => handleResultClick(candidate.id)}
                    />
                  ))
                ) : (
                  currentSearch.results.content.map(opening => (
                    <OpeningCard 
                      key={opening.id} 
                      opening={opening}
                      onClick={() => handleResultClick(opening.id)}
                    />
                  ))
                )}
              </div>
              
              {/* Pagination */}
              {currentSearch.results.totalPages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={currentSearch.pagination.page === 0}
                    onClick={() => {
                      if (activeTab === 'candidates') {
                        dispatch(changePage(currentSearch.pagination.page - 1));
                      } else {
                        dispatch(changeOpeningPage(currentSearch.pagination.page - 1));
                      }
                      handleSearch();
                    }}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentSearch.pagination.page + 1} of {currentSearch.results.totalPages}
                  </span>
                  <button 
                    disabled={currentSearch.pagination.page >= currentSearch.results.totalPages - 1}
                    onClick={() => {
                      if (activeTab === 'candidates') {
                        dispatch(changePage(currentSearch.pagination.page + 1));
                      } else {
                        dispatch(changeOpeningPage(currentSearch.pagination.page + 1));
                      }
                      handleSearch();
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Candidate Filters Component
const CandidateFilters = ({ filters, onFilterChange, onMultiSelect, skillsOptions, locationOptions, statusOptions }) => {
  return (
    <div className="filter-sections">
      {/* Text Search */}
      <div className="filter-group">
        <label>Search Text</label>
        <input
          type="text"
          placeholder="Name, email, phone, skills..."
          value={filters.textQuery || ''}
          onChange={(e) => onFilterChange('textQuery', e.target.value)}
        />
      </div>
      
      {/* Skills */}
      <div className="filter-group">
        <label>Primary Skills</label>
        <div className="multi-select-chips">
          {skillsOptions.map(skill => (
            <button
              key={skill}
              className={`chip ${filters.primarySkills?.includes(skill) ? 'active' : ''}`}
              onClick={() => onMultiSelect('primarySkills', skill, filters.primarySkills || [])}
            >
              {skill}
            </button>
          ))}
        </div>
        {filters.primarySkills?.length > 0 && (
          <div className="filter-option">
            <label>
              <input
                type="radio"
                checked={filters.skillMatchMode === 'ALL'}
                onChange={() => onFilterChange('skillMatchMode', 'ALL')}
              />
              Must have ALL selected skills
            </label>
            <label>
              <input
                type="radio"
                checked={filters.skillMatchMode === 'ANY'}
                onChange={() => onFilterChange('skillMatchMode', 'ANY')}
              />
              Must have ANY of selected skills
            </label>
          </div>
        )}
      </div>
      
      {/* Experience Range */}
      <div className="filter-group">
        <ExperienceRangeFilter
          value={{
            minExperience: { 
              years: Math.floor(filters.minExperience || 0), 
              months: Math.round(((filters.minExperience || 0) - Math.floor(filters.minExperience || 0)) * 12) 
            }
          }}
          onChange={(value) => {
            // Convert years and months to decimal years for backend
            const minDecimalYears = value.minExperience.years + (value.minExperience.months / 12);
            
            // Update filters with decimal years
            onFilterChange('minExperience', minDecimalYears);
          }}
        />
      </div>
      
      {/* Package Range */}
      <div className="filter-group">
        <label>Current Package (LPA)</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.minCurrentPackage || ''}
            onChange={(e) => onFilterChange('minCurrentPackage', e.target.value ? parseFloat(e.target.value) : null)}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.maxCurrentPackage || ''}
            onChange={(e) => onFilterChange('maxCurrentPackage', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
      </div>
      
      {/* Locations */}
      <div className="filter-group">
        <label>Locations</label>
        <div className="multi-select-chips">
          {locationOptions.map(location => (
            <button
              key={location}
              className={`chip ${filters.locations?.includes(location) ? 'active' : ''}`}
              onClick={() => onMultiSelect('locations', location, filters.locations || [])}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
      
      {/* Status */}
      <div className="filter-group">
        <label>Status</label>
        <div className="multi-select-chips">
          {statusOptions.map(status => (
            <button
              key={status}
              className={`chip ${filters.statuses?.includes(status) ? 'active' : ''}`}
              onClick={() => onMultiSelect('statuses', status, filters.statuses || [])}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {/* Date Range */}
      <div className="filter-group">
        <label>Added Between</label>
        <div className="date-inputs">
          <input
            type="date"
            value={filters.createdFrom || ''}
            onChange={(e) => onFilterChange('createdFrom', e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={filters.createdTo || ''}
            onChange={(e) => onFilterChange('createdTo', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// Opening Filters Component
const OpeningFilters = ({ filters, onFilterChange, onMultiSelect, skillsOptions, locationOptions, departmentOptions, statusOptions, typeOptions }) => {
  return (
    <div className="filter-sections">
      {/* Text Search */}
      <div className="filter-group">
        <label>Search Text</label>
        <input
          type="text"
          placeholder="Title, department, skills..."
          value={filters.textQuery || ''}
          onChange={(e) => onFilterChange('textQuery', e.target.value)}
        />
      </div>
      
      {/* Departments */}
      <div className="filter-group">
        <label>Departments</label>
        <div className="multi-select-chips">
          {departmentOptions.map(dept => (
            <button
              key={dept}
              className={`chip ${filters.departments?.includes(dept) ? 'active' : ''}`}
              onClick={() => onMultiSelect('departments', dept, filters.departments || [])}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>
      
      {/* Skills */}
      <div className="filter-group">
        <label>Required Skills</label>
        <div className="multi-select-chips">
          {skillsOptions.slice(0, 15).map(skill => (
            <button
              key={skill}
              className={`chip ${filters.skills?.includes(skill) ? 'active' : ''}`}
              onClick={() => onMultiSelect('skills', skill, filters.skills || [])}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      
      {/* Locations */}
      <div className="filter-group">
        <label>Locations</label>
        <div className="multi-select-chips">
          {locationOptions.map(location => (
            <button
              key={location}
              className={`chip ${filters.locations?.includes(location) ? 'active' : ''}`}
              onClick={() => onMultiSelect('locations', location, filters.locations || [])}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
      
      {/* Types */}
      <div className="filter-group">
        <label>Job Type</label>
        <div className="multi-select-chips">
          {typeOptions.map(type => (
            <button
              key={type}
              className={`chip ${filters.types?.includes(type) ? 'active' : ''}`}
              onClick={() => onMultiSelect('types', type, filters.types || [])}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Experience Range */}
      <div className="filter-group">
        <label>Experience (years)</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.minExperience || ''}
            onChange={(e) => onFilterChange('minExperience', e.target.value ? parseFloat(e.target.value) : null)}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.maxExperience || ''}
            onChange={(e) => onFilterChange('maxExperience', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
      </div>
      
      {/* Salary Range */}
      <div className="filter-group">
        <label>Salary Range (LPA)</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.minSalary || ''}
            onChange={(e) => onFilterChange('minSalary', e.target.value ? parseFloat(e.target.value) : null)}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.maxSalary || ''}
            onChange={(e) => onFilterChange('maxSalary', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
      </div>
      
      {/* Status */}
      <div className="filter-group">
        <label>Status</label>
        <div className="multi-select-chips">
          {statusOptions.map(status => (
            <button
              key={status}
              className={`chip ${filters.statuses?.includes(status) ? 'active' : ''}`}
              onClick={() => onMultiSelect('statuses', status, filters.statuses || [])}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {/* Date Range */}
      <div className="filter-group">
        <label>Created Between</label>
        <div className="date-inputs">
          <input
            type="date"
            value={filters.createdFrom || ''}
            onChange={(e) => onFilterChange('createdFrom', e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={filters.createdTo || ''}
            onChange={(e) => onFilterChange('createdTo', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// Candidate Card Component
const CandidateCard = ({ candidate, onClick }) => {
  return (
    <div className="result-card" onClick={onClick}>
      <div className="card-header">
        <h3>{candidate.firstName} {candidate.lastName}</h3>
        <span className={`status-badge ${candidate.status?.toLowerCase()}`}>
          {candidate.status}
        </span>
      </div>
      <div className="card-details">
        <div className="detail-row">
          <span className="label">Email:</span>
          <span>{candidate.email}</span>
        </div>
        {candidate.phone && (
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span>{candidate.phone}</span>
          </div>
        )}
        {candidate.experience && (
          <div className="detail-row">
            <span className="label">Experience:</span>
            <span>{candidate.experience}</span>
          </div>
        )}
        {candidate.currentPackage && (
          <div className="detail-row">
            <span className="label">Current Package:</span>
            <span>{candidate.currentPackage}</span>
          </div>
        )}
        {candidate.location && (
          <div className="detail-row">
            <span className="label">Location:</span>
            <span>{candidate.location}</span>
          </div>
        )}
        {candidate.skills && (
          <div className="detail-row">
            <span className="label">Skills:</span>
            <span className="skills-text">{candidate.skills}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Opening Card Component
// Helper function to get experience badge
const getExperienceBadge = (experience) => {
  if (!experience) return null;
  
  const exp = experience.toLowerCase();
  let badgeClass = 'exp-badge-inline';
  let icon = '💼';
  
  if (exp.includes('fresher') || exp.includes('0-1')) {
    badgeClass += ' exp-fresher';
    icon = '🌱';
  } else if (exp.includes('entry') || exp.includes('1-2')) {
    badgeClass += ' exp-entry';
    icon = '📝';
  } else if (exp.includes('junior') || exp.includes('2-4')) {
    badgeClass += ' exp-junior';
    icon = '🎯';
  } else if (exp.includes('mid') || exp.includes('4-6')) {
    badgeClass += ' exp-mid';
    icon = '💼';
  } else if (exp.includes('senior') || exp.includes('6-10')) {
    badgeClass += ' exp-senior';
    icon = '🏆';
  } else if (exp.includes('lead') || exp.includes('10+')) {
    badgeClass += ' exp-lead';
    icon = '⭐';
  } else if (exp.includes('expert') || exp.includes('15+')) {
    badgeClass += ' exp-expert';
    icon = '👑';
  }
  
  return (
    <span className={badgeClass} title={experience}>
      {icon} {experience}
    </span>
  );
};

const OpeningCard = ({ opening, onClick }) => {
  return (
    <div className="result-card" onClick={onClick}>
      <div className="card-header">
        <h3>{opening.title}</h3>
        <span className={`status-badge ${opening.status?.toLowerCase()}`}>
          {opening.status}
        </span>
      </div>
      <div className="card-details">
        <div className="detail-row">
          <span className="label">Department:</span>
          <span>{opening.department}</span>
        </div>
        {opening.location && (
          <div className="detail-row">
            <span className="label">Location:</span>
            <span>{opening.location}</span>
          </div>
        )}
        {opening.type && (
          <div className="detail-row">
            <span className="label">Type:</span>
            <span>{opening.type}</span>
          </div>
        )}
        {opening.experience && (
          <div className="detail-row">
            <span className="label">Experience:</span>
            {getExperienceBadge(opening.experience)}
          </div>
        )}
        {(opening.minSalary || opening.maxSalary) && (
          <div className="detail-row">
            <span className="label">Salary:</span>
            <span>{opening.minSalary} - {opening.maxSalary}</span>
          </div>
        )}
        {opening.positions && (
          <div className="detail-row">
            <span className="label">Positions:</span>
            <span>{opening.positions}</span>
          </div>
        )}
        {opening.skills && (
          <div className="detail-row">
            <span className="label">Skills:</span>
            <span className="skills-text">{opening.skills}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
