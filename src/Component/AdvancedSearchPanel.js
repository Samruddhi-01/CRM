// AdvancedSearchPanel.js - Work India Style Professional Filter Component

import React, { useState } from 'react';
import '../styles/components/advanced-search-panel.css';

const AdvancedSearchPanel = ({ 
  type = 'candidate', // 'candidate' or 'opening'
  onSearch, 
  onClear,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field, value) => {
    // Convert comma-separated string to array
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFilters(prev => ({ ...prev, [field]: array }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = type === 'candidate' ? {
      textQuery: '',
      primarySkills: [],
      primarySkillsMatchType: 'ANY',
      secondarySkills: [],
      minExperience: '',
      maxExperience: '',
      minCurrentPackage: '',
      maxCurrentPackage: '',
      minExpectedCTC: '',
      maxExpectedCTC: '',
      locations: [],
      statuses: [],
      sources: [],
      createdFrom: null,
      createdTo: null
    } : {
      textQuery: '',
      titles: [],
      departments: [],
      types: [],
      locations: [],
      skills: [],
      minExperience: '',
      maxExperience: '',
      minSalary: '',
      maxSalary: '',
      statuses: [],
      createdFrom: null,
      createdTo: null
    };
    
    setFilters(emptyFilters);
    onClear && onClear();
  };

  const toggleSection = (sectionName) => {
    setExpandedSection(prev => prev === sectionName ? null : sectionName);
  };

  const AccordionSection = ({ title, sectionKey, children }) => (
    <div className="accordion-section">
      <div 
        className="accordion-header"
        onClick={() => toggleSection(sectionKey)}
      >
        <h4 className="accordion-title">{title}</h4>
        <span className="accordion-icon">
          {expandedSection === sectionKey ? '−' : '+'}
        </span>
      </div>
      {expandedSection === sectionKey && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );

  const renderCandidateFilters = () => (
    <>
      {/* Text Search */}
      <div className="filter-group">
        <label className="filter-label">
          <span className="label-icon">🔍</span>
          Search Text
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search name, email, phone, skills..."
          value={filters.textQuery || ''}
          onChange={(e) => handleFilterChange('textQuery', e.target.value)}
        />
      </div>

      {/* Skills Section */}
      <AccordionSection title="Skills" sectionKey="skills">
        <div className="filter-row">
          <div className="filter-group flex-1">
            <label className="filter-label">Primary Skills</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Java, Spring Boot, React (comma-separated)"
              value={filters.primarySkills?.join(', ') || ''}
              onChange={(e) => handleArrayInput('primarySkills', e.target.value)}
            />
          </div>
          <div className="filter-group" style={{ minWidth: '120px' }}>
            <label className="filter-label">Match</label>
            <select
              className="filter-select"
              value={filters.primarySkillsMatchType || 'ANY'}
              onChange={(e) => handleFilterChange('primarySkillsMatchType', e.target.value)}
            >
              <option value="ANY">Any</option>
              <option value="ALL">All</option>
            </select>
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">Secondary Skills</label>
          <input
            type="text"
            className="filter-input"
            placeholder="MySQL, AWS, Docker (comma-separated)"
            value={filters.secondarySkills?.join(', ') || ''}
            onChange={(e) => handleArrayInput('secondarySkills', e.target.value)}
          />
        </div>
      </AccordionSection>

      {/* Experience Range */}
      <AccordionSection title="Experience" sectionKey="experience">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Min Years</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 3"
              value={filters.minExperience || ''}
              onChange={(e) => handleFilterChange('minExperience', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Max Years</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 8"
              value={filters.maxExperience || ''}
              onChange={(e) => handleFilterChange('maxExperience', e.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      {/* Package Range */}
      <AccordionSection title="Current Package (LPA)" sectionKey="currentPackage">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Min</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 10"
              value={filters.minCurrentPackage || ''}
              onChange={(e) => handleFilterChange('minCurrentPackage', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Max</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 25"
              value={filters.maxCurrentPackage || ''}
              onChange={(e) => handleFilterChange('maxCurrentPackage', e.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Expected CTC (LPA)" sectionKey="expectedCTC">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Min</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 15"
              value={filters.minExpectedCTC || ''}
              onChange={(e) => handleFilterChange('minExpectedCTC', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Max</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 30"
              value={filters.maxExpectedCTC || ''}
              onChange={(e) => handleFilterChange('maxExpectedCTC', e.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      {/* Location & Status */}
      <AccordionSection title="Location & Status" sectionKey="locationStatus">
        <div className="filter-group">
          <label className="filter-label">Locations</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Bangalore, Pune, Mumbai (comma-separated)"
            value={filters.locations?.join(', ') || ''}
            onChange={(e) => handleArrayInput('locations', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            multiple
            className="filter-select multi-select"
            value={filters.statuses || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              handleFilterChange('statuses', values);
            }}
          >
            <option value="PENDING">Pending</option>
            <option value="INTERESTED">Interested</option>
            <option value="NOT_INTERESTED">Not Interested</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <small className="field-hint">Hold Ctrl/Cmd to select multiple</small>
        </div>
      </AccordionSection>

      {/* Date Range */}
      <AccordionSection title="Date Range" sectionKey="dateRange">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">From</label>
            <input
              type="date"
              className="filter-input"
              value={filters.createdFrom || ''}
              onChange={(e) => handleFilterChange('createdFrom', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">To</label>
            <input
              type="date"
              className="filter-input"
              value={filters.createdTo || ''}
              onChange={(e) => handleFilterChange('createdTo', e.target.value)}
            />
          </div>
        </div>
      </AccordionSection>
    </>
  );

  const renderOpeningFilters = () => (
    <>
      {/* Text Search */}
      <div className="filter-group">
        <label className="filter-label">
          <span className="label-icon">🔍</span>
          Search Text
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search title, department, description..."
          value={filters.textQuery || ''}
          onChange={(e) => handleFilterChange('textQuery', e.target.value)}
        />
      </div>

      {/* Job Details */}
      <AccordionSection title="Job Details" sectionKey="jobDetails">
        <div className="filter-group">
          <label className="filter-label">Departments</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Engineering, Product (comma-separated)"
            value={filters.departments?.join(', ') || ''}
            onChange={(e) => handleArrayInput('departments', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Job Types</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Full-Time, Part-Time, Contract"
            value={filters.types?.join(', ') || ''}
            onChange={(e) => handleArrayInput('types', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Required Skills</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Java, React, AWS (comma-separated)"
            value={filters.skills?.join(', ') || ''}
            onChange={(e) => handleArrayInput('skills', e.target.value)}
          />
        </div>
      </AccordionSection>

      {/* Experience Range */}
      <AccordionSection title="Experience Required" sectionKey="experienceRequired">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Min Years</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 2"
              value={filters.minExperience || ''}
              onChange={(e) => handleFilterChange('minExperience', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Max Years</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 10"
              value={filters.maxExperience || ''}
              onChange={(e) => handleFilterChange('maxExperience', e.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      {/* Salary Range */}
      <AccordionSection title="Salary Range (LPA)" sectionKey="salaryRange">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Min</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 15"
              value={filters.minSalary || ''}
              onChange={(e) => handleFilterChange('minSalary', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Max</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., 30"
              value={filters.maxSalary || ''}
              onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      {/* Status */}
      <AccordionSection title="Status" sectionKey="status">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            multiple
            className="filter-select multi-select"
            value={filters.statuses || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              handleFilterChange('statuses', values);
            }}
          >
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
          <small className="field-hint">Hold Ctrl/Cmd to select multiple</small>
        </div>
      </AccordionSection>

      {/* Date Range */}
      <AccordionSection title="Date Range" sectionKey="dateRangeOpening">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">From</label>
            <input
              type="date"
              className="filter-input"
              value={filters.createdFrom || ''}
              onChange={(e) => handleFilterChange('createdFrom', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">To</label>
            <input
              type="date"
              className="filter-input"
              value={filters.createdTo || ''}
              onChange={(e) => handleFilterChange('createdTo', e.target.value)}
            />
          </div>
        </div>
      </AccordionSection>
    </>
  );

  return (
    <div className="advanced-search-panel">
      <div className="panel-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="panel-title">
          <span className="panel-icon">🔎</span>
          <h3>Advanced Search</h3>
        </div>
        <button className="toggle-btn">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="panel-content">
          {type === 'candidate' ? renderCandidateFilters() : renderOpeningFilters()}

          <div className="panel-actions">
            <button className="btn-search" onClick={handleSearch}>
              <span>🔍</span>
              Apply Filters
            </button>
            <button className="btn-clear" onClick={handleClearFilters}>
              <span>✕</span>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchPanel;
