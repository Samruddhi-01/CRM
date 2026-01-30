import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import FilterAccordion from './FilterAccordion';
import MultiSelect from './MultiSelect';
import RangeSlider from './RangeSlider';
import ExperienceRangeFilter from './ExperienceRangeFilter';

const FilterSidebar = ({ 
  filters, 
  onChange, 
  onReset, 
  isMobileOpen,
  onMobileClose 
}) => {
  // State for managing open sections
  const [openSections, setOpenSections] = useState({
    'experience-location': true,
    'salary-availability': false,
    'skills-technology': false,
    'education': false,
    'company-profile': false,
    'candidate-status': false,
    'advanced-filters': false
  });

  // Toggle section function for single-open behavior
  const toggleSection = (sectionName) => {
  setOpenSections(prev => {
    const isCurrentlyOpen = prev[sectionName];

    // If clicking already open → close everything
    if (isCurrentlyOpen) {
      return {
        'experience-location': false,
        'salary-availability': false,
        'skills-technology': false,
        'education': false,
        'company-profile': false,
        'candidate-status': false,
        'advanced-filters': false
      };
    }

    // If clicking closed → open only this, close others
    return {
      'experience-location': false,
      'salary-availability': false,
      'skills-technology': false,
      'education': false,
      'company-profile': false,
      'candidate-status': false,
      'advanced-filters': false,
      [sectionName]: true
    };
  });
};

  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  // Options data
  // Options from CandidateForm
  const EXPERIENCE_LEVELS = [
    { value: 'Fresher (0-1 year)', label: 'Fresher (0-1 year)', icon: '🌱' },
    { value: 'Entry Level (1-2 years)', label: 'Entry Level (1-2 years)', icon: '📝' },
    { value: 'Junior (2-4 years)', label: 'Junior (2-4 years)', icon: '🎯' },
    { value: 'Mid-Level (4-6 years)', label: 'Mid-Level (4-6 years)', icon: '💼' },
    { value: 'Senior (6-10 years)', label: 'Senior (6-10 years)', icon: '🏆' },
    { value: 'Lead (10+ years)', label: 'Lead (10+ years)', icon: '⭐' },
    { value: 'Expert (15+ years)', label: 'Expert (15+ years)', icon: '👑' }
  ];

  const SKILLS_OPTIONS = [
    { value: 'Java', label: 'Java' },
    { value: 'Python', label: 'Python' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Spring Boot', label: 'Spring Boot' },
    { value: 'AWS', label: 'AWS' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Kubernetes', label: 'Kubernetes' },
    { value: 'SQL', label: 'SQL' },
    { value: 'MongoDB', label: 'MongoDB' }
  ];

  const LOCATION_OPTIONS = [
    { value: 'Pune', label: 'Pune' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Noida', label: 'Noida' },
    { value: 'Gurgaon', label: 'Gurgaon' }
  ];

  const NOTICE_PERIOD_OPTIONS = [
    { value: 'Immediate', label: 'Immediate' },
    { value: '15 Days', label: '15 Days' },
    { value: '1 Month', label: '1 Month' },
    { value: '2 Months', label: '2 Months' },
    { value: '3 Months', label: '3 Months' },
    { value: 'Serving Notice', label: 'Serving Notice' }
  ];

  const DEGREE_OPTIONS = [
    { value: 'BCA', label: 'BCA' },
    { value: 'MCA', label: 'MCA' },
    { value: 'BE Computer', label: 'BE' },
    { value: 'BTech', label: 'BTech' },
    { value: 'MTech', label: 'MTech' },
    { value: 'BSc', label: 'BSc' },
    { value: 'MSc', label: 'MSc' },
    { value: 'Diploma', label: 'Diploma' },
    { value: '12th', label: '12th' },
    { value: '10th', label: '10th' }
  ];

  const EDUCATION_GAP_OPTIONS = [
    { value: 'No Gap', label: 'No Gap' },
    { value: '0-1 Years', label: '0-1 Years' },
    { value: '1-2 Years', label: '1-2 Years' },
    { value: '2+ Years', label: '2+ Years' }
  ];

  const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'INTERESTED', label: 'Interested' },
    { value: 'NOT_INTERESTED', label: 'Not Interested' },
    { value: 'TELL_LATER', label: 'Tell Later' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'OFFERED', label: 'Offered' },
    { value: 'HIRED', label: 'Hired' }
  ];

  const EMPLOYMENT_TYPE_OPTIONS = [
    { value: 'fulltime', label: 'Full-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
  ];

  const APPLICATION_STATUS_OPTIONS = [
    { value: 'new', label: 'New' },
    { value: 'screening', label: 'Screening' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'offered', label: 'Offered' },
  ];

  // Count active filters properly - exclude default values
  const activeFilterCount = (() => {
    let count = 0;
    
    // Array filters
    if (filters.currentLocations?.length > 0) count++;
    if (filters.experienceLevel?.length > 0) count++;
    if (filters.noticePeriod?.length > 0) count++;
    if (filters.degree?.length > 0) count++;
    if (filters.educationGap?.length > 0) count++;
    if (filters.status?.length > 0) count++;
    if (filters.primarySkills?.length > 0) count++;
    if (filters.secondarySkills?.length > 0) count++;
    if (filters.employmentTypes?.length > 0) count++;
    if (filters.applicationStatus?.length > 0) count++;
    
    // Range filters (only count if not default)
    if (filters.minExperience > 0) count++;
    if (filters.currentCTC?.[0] > 0 || filters.currentCTC?.[1] < 100) count++;
    if (filters.expectedCTC?.[0] > 0 || filters.expectedCTC?.[1] < 150) count++;
    if (filters.passingYearRange?.[0] > 2000 || filters.passingYearRange?.[1] < currentYear) count++;
    
    // String filters
    if (filters.company?.trim()) count++;
    if (filters.profile?.trim()) count++;
    if (filters.qualification && filters.qualification !== '') count++;
    if (filters.specialization && filters.specialization !== '') count++;
    if (filters.skillMatchType && filters.skillMatchType !== 'ANY') count++;
    
    // Boolean filters
    if (filters.excludeDuplicates) count++;
    if (filters.excludeBlocked) count++;
    if (filters.verifiedOnly) count++;
    
    return count;
  })();

  return (
    <>
      {isMobileOpen && (
        <div 
          className="filter-sidebar-overlay show"
          onClick={onMobileClose}
        />
      )}
      
      <div className={`filter-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="filter-sidebar-header">
          <h2 className="filter-sidebar-title">
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </h2>
          <div className="flex gap-2">
            <button className="filter-reset-btn" onClick={onReset}>
              <RotateCcw size={14} />
              Reset
            </button>
            {isMobileOpen && (
              <button className="modal-close-btn" onClick={onMobileClose}>
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        
        {/* A) Experience & Location */}
        <FilterAccordion 
          title="Experience & Location" 
          isOpen={openSections['experience-location']}
          onToggle={toggleSection}
          sectionName="experience-location"
        >
          <div className="filter-group">
            <label className="filter-label">Experience Level</label>
            <MultiSelect
              options={EXPERIENCE_LEVELS.map(level => ({
                value: level.value,
                label: `${level.icon} ${level.label}`
              }))}
              value={filters.experienceLevel || []}
              onChange={(val) => onChange('experienceLevel', val)}
              placeholder="Select experience levels"
            />
          </div>

          <ExperienceRangeFilter
            value={{
              minExperience: { 
                years: Math.floor(filters.minExperience || 0), 
                months: Math.round((filters.minExperience || 0) % 1 * 10) 
              }
            }}
            onChange={(value) => {
              // Convert years and months to decimal format (1 year 2 months = 1.2)
              const minDecimalYears = value.minExperience.years + (value.minExperience.months / 10);
              
              // Update filters with decimal years
              onChange('minExperience', minDecimalYears);
            }}
          />

          <div className="filter-group">
            <label className="filter-label">Current Location</label>
            <MultiSelect
              options={LOCATION_OPTIONS}
              value={filters.currentLocations || []}
              onChange={(val) => onChange('currentLocations', val)}
              placeholder="Select locations"
            />
          </div>
        </FilterAccordion>

        {/* B) Salary & Notice Period */}
        <FilterAccordion 
          title="Salary & Availability"
          isOpen={openSections['salary-availability']}
          onToggle={toggleSection}
          sectionName="salary-availability"
        >
          <div className="filter-group">
            <label className="filter-label">Notice Period</label>
            <MultiSelect
              options={NOTICE_PERIOD_OPTIONS}
              value={filters.noticePeriod || []}
              onChange={(val) => onChange('noticePeriod', val)}
              placeholder="Select notice periods"
            />
          </div>

          <RangeSlider
            label="Current CTC (LPA)"
            min={0}
            max={100}
            value={filters.currentCTC || [0, 100]}
            onChange={(val) => onChange('currentCTC', val)}
            unit="LPA"
          />

          <RangeSlider
            label="Expected CTC (LPA)"
            min={0}
            max={150}
            value={filters.expectedCTC || [0, 150]}
            onChange={(val) => onChange('expectedCTC', val)}
            unit="LPA"
          />

          <div className="filter-group">
            <label className="filter-label">Employment Type</label>
            <MultiSelect
              options={EMPLOYMENT_TYPE_OPTIONS}
              value={filters.employmentTypes || []}
              onChange={(val) => onChange('employmentTypes', val)}
              placeholder="Select types"
            />
          </div>
        </FilterAccordion>

        {/* B) Skills & Technology */}
        <FilterAccordion 
          title="Skills & Technology"
          isOpen={openSections['skills-technology']}
          onToggle={toggleSection}
          sectionName="skills-technology"
        >
          <div className="filter-group">
            <label className="filter-label">Primary Skills</label>
            <MultiSelect
              options={SKILLS_OPTIONS}
              value={filters.primarySkills || []}
              onChange={(val) => onChange('primarySkills', val)}
              placeholder="Select skills"
            />
          </div>

          <div className="radio-group">
            <div 
              className={`radio-option ${filters.skillMatchType === 'ANY' ? 'selected' : ''}`}
              onClick={() => onChange('skillMatchType', 'ANY')}
            >
              <div className="radio-circle" />
              <span className="radio-label">Match ANY skill</span>
            </div>
            <div 
              className={`radio-option ${filters.skillMatchType === 'ALL' ? 'selected' : ''}`}
              onClick={() => onChange('skillMatchType', 'ALL')}
            >
              <div className="radio-circle" />
              <span className="radio-label">Match ALL skills</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Secondary Skills</label>
            <MultiSelect
              options={SKILLS_OPTIONS}
              value={filters.secondarySkills || []}
              onChange={(val) => onChange('secondarySkills', val)}
              placeholder="Select skills"
            />
          </div>
        </FilterAccordion>

        {/* C) Education */}
        <FilterAccordion 
          title="Education"
          isOpen={openSections['education']}
          onToggle={toggleSection}
          sectionName="education"
        >
          <div className="filter-group">
            <label className="filter-label">Degree</label>
            <MultiSelect
              options={DEGREE_OPTIONS}
              value={filters.degree || []}
              onChange={(val) => onChange('degree', val)}
              placeholder="Select degrees"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Specialization</label>
            <input
              type="text"
              className="input"
              value={filters.specialization || ''}
              onChange={(e) => onChange('specialization', e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Education Gap</label>
            <MultiSelect
              options={EDUCATION_GAP_OPTIONS}
              value={filters.educationGap || []}
              onChange={(val) => onChange('educationGap', val)}
              placeholder="Select education gap"
            />
          </div>

          <RangeSlider
            label="Passing Year"
            min={2000}
            max={currentYear}
            value={filters.passingYearRange || [2000, currentYear]}
            onChange={(val) => onChange('passingYearRange', val)}
            unit=""
          />
        </FilterAccordion>

        {/* D) Company & Profile */}
        <FilterAccordion 
          title="Company & Profile"
          isOpen={openSections['company-profile']}
          onToggle={toggleSection}
          sectionName="company-profile"
        >
          <div className="filter-group">
            <label className="filter-label">Company Name</label>
            <input
              type="text"
              className="input"
              value={filters.company || ''}
              onChange={(e) => onChange('company', e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Profile/Designation</label>
            <input
              type="text"
              className="input"
              value={filters.profile || ''}
              onChange={(e) => onChange('profile', e.target.value)}
              placeholder="e.g., Software Engineer, Manager"
            />
          </div>
        </FilterAccordion>

        {/* E) Candidate Status */}
        <FilterAccordion 
          title="Candidate Status"
          isOpen={openSections['candidate-status']}
          onToggle={toggleSection}
          sectionName="candidate-status"
        >
          <div className="filter-group">
            <label className="filter-label">Application Status</label>
            <MultiSelect
              options={STATUS_OPTIONS}
              value={filters.status || []}
              onChange={(val) => onChange('status', val)}
              placeholder="Select status"
            />
          </div>
        </FilterAccordion>

        {/* F) Advanced Filters */}
        <FilterAccordion 
          title="Advanced Filters"
          isOpen={openSections['advanced-filters']}
          onToggle={toggleSection}
          sectionName="advanced-filters"
        >
          <div className="checkbox-group">
            <div 
              className={`checkbox-option ${filters.excludeDuplicates ? 'checked' : ''}`}
              onClick={() => onChange('excludeDuplicates', !filters.excludeDuplicates)}
            >
              <div className="checkbox-box" />
              <span className="checkbox-label">Exclude Duplicates</span>
            </div>

            <div 
              className={`checkbox-option ${filters.excludeBlocked ? 'checked' : ''}`}
              onClick={() => onChange('excludeBlocked', !filters.excludeBlocked)}
            >
              <div className="checkbox-box" />
              <span className="checkbox-label">Exclude Blocked</span>
            </div>

            <div 
              className={`checkbox-option ${filters.verifiedOnly ? 'checked' : ''}`}
              onClick={() => onChange('verifiedOnly', !filters.verifiedOnly)}
            >
              <div className="checkbox-box" />
              <span className="checkbox-label">Verified Profiles Only</span>
            </div>
          </div>
        </FilterAccordion>
      </div>
    </>
  );
};

export default FilterSidebar;
