import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../components/advanced-search/SearchBar';
import FilterSidebar from '../components/advanced-search/FilterSidebar';
import ActiveFiltersBar from '../components/advanced-search/ActiveFiltersBar';
import CandidateCard from '../components/advanced-search/CandidateCard';
import Pagination from '../components/advanced-search/Pagination';
import PageSizeSelector from '../components/advanced-search/PageSizeSelector';
import '../styles/advanced-search/index.css';
import '../styles/unified-app/enhanced-filter-layout.css';

const AdvancedSearchNew = () => {
  const navigate = useNavigate();
  
  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    currentLocations: [],
    minExperience: 0,
    maxExperience: 30,
    experienceLevel: [],
    noticePeriod: [],
    currentCTC: [0, 100],
    expectedCTC: [0, 150],
    employmentTypes: [],
    primarySkills: [],
    secondarySkills: [],
    skillMatchType: 'ANY',
    degree: [],
    specialization: '',
    passingYearRange: [2000, currentYear],
    educationGap: [],
    percentage: [0, 100],
    status: [],
    company: '',
    profile: '',
    excludeDuplicates: false,
    excludeBlocked: false,
    verifiedOnly: false,
  });
  
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Use ref to track if this is the first render
  const isFirstRender = useRef(true);
  const searchTimeoutRef = useRef(null);
  const resultsRef = useRef(null);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('advancedSearchSaved');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = useCallback(async () => {
    console.log('🔍 handleSearch called - page:', page, 'itemsPerPage:', itemsPerPage);
    
    // Only show full loading on first search or if no results yet
    if (candidates.length === 0) {
      setLoading(true);
    }
    
    try {
      // Build optimized filter object - only include non-default values
      const cleanFilters = {};
      
      // Array filters
      if (filters.currentLocations?.length > 0) cleanFilters.locations = filters.currentLocations;
      if (filters.primarySkills?.length > 0) cleanFilters.primarySkills = filters.primarySkills;
      if (filters.secondarySkills?.length > 0) cleanFilters.secondarySkills = filters.secondarySkills;
      if (filters.employmentTypes?.length > 0) cleanFilters.employmentTypes = filters.employmentTypes;
      
      // Experience Level - map to experience range or send as filter
      if (filters.experienceLevel?.length > 0) cleanFilters.experienceLevel = filters.experienceLevel;
      
      // Notice Period - send as array
      if (filters.noticePeriod?.length > 0) cleanFilters.noticePeriod = filters.noticePeriod;
      
      // Degree - send as array
      if (filters.degree?.length > 0) cleanFilters.degree = filters.degree;
      
      // Education Gap - send as array
      if (filters.educationGap?.length > 0) cleanFilters.educationGap = filters.educationGap;
      
      // Percentage - send as min/max
      if (filters.percentage && (filters.percentage[0] > 0 || filters.percentage[1] < 100)) {
        cleanFilters.minPercentage = filters.percentage[0];
        cleanFilters.maxPercentage = filters.percentage[1];
      }
      
      // Status - map to applicationStatus for backend
      if (filters.status?.length > 0) cleanFilters.applicationStatus = filters.status;
      
      // Experience filter - only apply when experience is greater than 0
      if (filters.minExperience !== null && filters.minExperience !== undefined && filters.minExperience > 0) {
        cleanFilters.minExperience = filters.minExperience;
      }
      
      // CTC filters
      if (filters.currentCTC[0] > 0 || filters.currentCTC[1] < 100) {
        cleanFilters.minCurrentCTC = filters.currentCTC[0];
        cleanFilters.maxCurrentCTC = filters.currentCTC[1];
      }
      if (filters.expectedCTC[0] > 0 || filters.expectedCTC[1] < 150) {
        cleanFilters.minExpectedCTC = filters.expectedCTC[0];
        cleanFilters.maxExpectedCTC = filters.expectedCTC[1];
      }
      
      // String filters
      if (filters.company && filters.company !== '') cleanFilters.company = filters.company;
      if (filters.profile && filters.profile !== '') cleanFilters.profile = filters.profile;
      if (filters.qualification && filters.qualification !== '') cleanFilters.qualification = filters.qualification;
      if (filters.specialization && filters.specialization !== '') cleanFilters.specialization = filters.specialization;
      if (filters.skillMatchType && filters.skillMatchType !== 'ANY') cleanFilters.skillMatchType = filters.skillMatchType;
      
      // Passing year
      if (filters.passingYearRange[0] > 2000 || filters.passingYearRange[1] < currentYear) {
        cleanFilters.minPassingYear = filters.passingYearRange[0];
        cleanFilters.maxPassingYear = filters.passingYearRange[1];
      }
      
      // Boolean filters
      if (filters.excludeDuplicates) cleanFilters.excludeDuplicates = true;
      if (filters.excludeBlocked) cleanFilters.excludeBlocked = true;
      if (filters.verifiedOnly) cleanFilters.verifiedOnly = true;

      const searchPayload = {
        query: searchQuery?.trim() || '',
        filters: cleanFilters,
        sortBy: sortBy || 'relevance',
        page: page,
        limit: itemsPerPage,
      };

      console.log('🔍 Search Request:', {
        query: searchPayload.query,
        activeFilters: Object.keys(cleanFilters).length,
        sortBy: searchPayload.sortBy,
        page: searchPayload.page,
        limit: searchPayload.limit
      });
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      const response = await fetch('http://localhost:8080/api/search/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(searchPayload),
      });
      
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', errorText);
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Search Results:', {
        page: data.page,
        totalPages: data.totalPages,
        totalCount: data.totalCount,
        resultsCount: data.results?.length || 0,
        executionTime: data.executionTime ? `${data.executionTime}ms` : 'N/A'
      });
      
      setCandidates(data.results || []);
      setTotalResults(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);

    } catch (error) {
      console.error('❌ Search error:', error);
      
      if (error.message.includes('login') || error.message.includes('Session')) {
        alert(error.message);
        // Optionally redirect to login
        // window.location.href = '/login';
      } else {
        alert('Search failed. Please try again or contact support.');
      }
      
      setCandidates([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, searchQuery, filters, sortBy, currentYear]);

  // Debounced search - trigger when dependencies change
  useEffect(() => {
    // Run search immediately on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log('🔄 First render - triggering initial search');
      handleSearch();
      return;
    }
    
    console.log('🔄 Dependencies changed - page:', page, 'limit:', itemsPerPage);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    // Shorter debounce for page/size changes, longer for text/filters
    const debounceTime = 100;
    
    searchTimeoutRef.current = setTimeout(() => {
      console.log('⏰ Debounce timeout - calling handleSearch');
      handleSearch();
    }, debounceTime);
    
    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [handleSearch]);

  // Scroll to results when page changes
  useEffect(() => {
    if (!isFirstRender.current && page > 0) {
      console.log('📜 Scroll triggered for page:', page);
      
      // Wait for new results to render
      const scrollToResults = () => {
        if (resultsRef.current) {
          const element = resultsRef.current;
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - 80;
          
          console.log('📜 Scrolling to position:', targetPosition);
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } else {
          console.warn('⚠️ resultsRef.current is null');
        }
      };
      
      // Use requestAnimationFrame for smoother scroll timing
      requestAnimationFrame(() => {
        setTimeout(scrollToResults, 150);
      });
    }
  }, [page]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      currentLocations: [],
      minExperience: 0,
      experienceLevel: [],
      noticePeriod: [],
      currentCTC: [0, 100],
      expectedCTC: [0, 150],
      employmentTypes: [],
      primarySkills: [],
      secondarySkills: [],
      skillMatchType: 'ANY',
      degree: [],
      specialization: '',
      passingYearRange: [2000, currentYear],
      educationGap: [],
      percentage: [0, 100],
      status: [],
      company: '',
      profile: '',
      excludeDuplicates: false,
      excludeBlocked: false,
      verifiedOnly: false,
    });
    setSearchQuery('');
    setPage(1);
  };

  const getActiveFilters = () => {
    const active = [];
    
    // Location filters
    if (filters.currentLocations?.length > 0) {
      active.push({
        key: 'currentLocations',
        category: 'Current Location',
        value: filters.currentLocations.join(', ')
      });
    }
    
    // Experience Level
    if (filters.experienceLevel?.length > 0) {
      active.push({
        key: 'experienceLevel',
        category: 'Experience Level',
        value: filters.experienceLevel.join(', ')
      });
    }

    // Experience filter - only show if not default values
    if (filters.minExperience > 0) {
      // Convert decimal years back to years and months for display (1.2 = 1 year 2 months)
      const minYears = Math.floor(filters.minExperience);
      const minMonths = Math.round((filters.minExperience - minYears) * 10);
      
      const formatExperience = (years, months) => {
        if (years === 0 && months === 0) return '0 years';
        if (years > 0 && months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
        if (years === 0 && months > 0) return `${months} month${months !== 1 ? 's' : ''}`;
        return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
      };
      
      active.push({
        key: 'experience',
        category: 'Minimum Experience',
        value: `Minimum: ${formatExperience(minYears, minMonths)}`
      });
    }

    // Notice period
    if (filters.noticePeriod?.length > 0) {
      active.push({
        key: 'noticePeriod',
        category: 'Notice Period',
        value: filters.noticePeriod.join(', ')
      });
    }

    // CTC filters - only show if not default values
    if (filters.currentCTC[0] > 0 || filters.currentCTC[1] < 100) {
      active.push({
        key: 'currentCTC',
        category: 'Current CTC',
        value: `₹${filters.currentCTC[0]}-${filters.currentCTC[1]} LPA`
      });
    }

    if (filters.expectedCTC[0] > 0 || filters.expectedCTC[1] < 150) {
      active.push({
        key: 'expectedCTC',
        category: 'Expected CTC',
        value: `₹${filters.expectedCTC[0]}-${filters.expectedCTC[1]} LPA`
      });
    }

    // Employment type
    if (filters.employmentTypes?.length > 0) {
      active.push({
        key: 'employmentTypes',
        category: 'Employment Type',
        value: filters.employmentTypes.join(', ')
      });
    }
    
    // Skills
    if (filters.primarySkills?.length > 0) {
      active.push({
        key: 'primarySkills',
        category: 'Primary Skills',
        value: filters.primarySkills.join(', ')
      });
    }

    if (filters.secondarySkills?.length > 0) {
      active.push({
        key: 'secondarySkills',
        category: 'Secondary Skills',
        value: filters.secondarySkills.join(', ')
      });
    }

    // Education
    if (filters.degree?.length > 0) {
      active.push({
        key: 'degree',
        category: 'Degree',
        value: filters.degree.join(', ')
      });
    }

    // Percentage
    if (filters.percentage && (filters.percentage[0] > 0 || filters.percentage[1] < 100)) {
      active.push({
        key: 'percentage',
        category: 'Percentage',
        value: `${filters.percentage[0]}% - ${filters.percentage[1]}%`
      });
    }

    if (filters.qualification && filters.qualification !== '') {
      active.push({
        key: 'qualification',
        category: 'Qualification',
        value: filters.qualification
      });
    }

    if (filters.specialization && filters.specialization !== '') {
      active.push({
        key: 'specialization',
        category: 'Specialization',
        value: filters.specialization
      });
    }

    if (filters.passingYearRange[0] > 2000 || filters.passingYearRange[1] < currentYear) {
      active.push({
        key: 'passingYearRange',
        category: 'Passing Year',
        value: `${filters.passingYearRange[0]}-${filters.passingYearRange[1]}`
      });
    }

    if (filters.educationGap?.length > 0) {
      active.push({
        key: 'educationGap',
        category: 'Education Gap',
        value: filters.educationGap.join(', ')
      });
    }

    // Company & Profile
    if (filters.company && filters.company.trim() !== '') {
      active.push({
        key: 'company',
        category: 'Company',
        value: filters.company
      });
    }

    if (filters.profile && filters.profile.trim() !== '') {
      active.push({
        key: 'profile',
        category: 'Profile',
        value: filters.profile
      });
    }

    // Status
    if (filters.status?.length > 0) {
      active.push({
        key: 'status',
        category: 'Status',
        value: filters.status.join(', ')
      });
    }

    if (filters.applicationStatus?.length > 0) {
      active.push({
        key: 'applicationStatus',
        category: 'Application Status',
        value: filters.applicationStatus.join(', ')
      });
    }

    // Meta filters
    if (filters.excludeDuplicates) {
      active.push({
        key: 'excludeDuplicates',
        category: 'Filter',
        value: 'Exclude Duplicates'
      });
    }

    if (filters.excludeBlocked) {
      active.push({
        key: 'excludeBlocked',
        category: 'Filter',
        value: 'Exclude Blocked'
      });
    }

    if (filters.verifiedOnly) {
      active.push({
        key: 'verifiedOnly',
        category: 'Filter',
        value: 'Verified Only'
      });
    }
    
    return active;
  };

  const handleRemoveFilter = (key) => {
    // Handle special filter keys
    if (key === 'experience') {
      setFilters(prev => ({ ...prev, minExperience: 0 }));
    } else if (key === 'currentCTC') {
      setFilters(prev => ({ ...prev, currentCTC: [0, 100] }));
    } else if (key === 'expectedCTC') {
      setFilters(prev => ({ ...prev, expectedCTC: [0, 150] }));
    } else if (key === 'passingYearRange') {
      setFilters(prev => ({ ...prev, passingYearRange: [2000, currentYear] }));
    } else if (Array.isArray(filters[key])) {
      // Array filters (multi-select)
      handleFilterChange(key, []);
    } else if (typeof filters[key] === 'boolean') {
      // Boolean filters
      handleFilterChange(key, false);
    } else {
      // String filters
      handleFilterChange(key, '');
    }
  };

  const handleViewProfile = (candidate) => {
    console.log('👤 Opening candidate profile:', candidate.id);
    setSelectedCandidate(candidate);
    setIsProfileModalOpen(true);
  };

  const handleDownloadResume = async (candidate) => {
    try {
      console.log('📥 Downloading resume for candidate:', candidate.id);
      
      // Check if candidate has a resume URL
      if (!candidate.resumeUrl || candidate.resumeUrl.trim() === '') {
        toast.error('No resume available for this candidate', {
          duration: 3000,
          position: 'top-center',
        });
        return;
      }
      
      const token = localStorage.getItem('auth_token');
      const resumeUrl = candidate.resumeUrl;
      
      // If resumeUrl is a direct link (http/https), open it
      if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')) {
        // Open in new tab
        window.open(resumeUrl, '_blank');
        toast.success('Opening resume in new tab', {
          duration: 2000,
          position: 'top-center',
        });
        return;
      }
      
      // Otherwise, try to download from backend
      const response = await fetch(`http://localhost:8080/api/candidates/${candidate.id}/resume`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Resume file not found on server', {
            duration: 3000,
            position: 'top-center',
          });
          return;
        }
        throw new Error(`Failed to download resume: ${response.status}`);
      }
      
      // Get filename from header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${candidate.firstName}_${candidate.lastName}_Resume.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully', {
        duration: 2000,
        position: 'top-center',
      });
      console.log('✅ Resume downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading resume:', error);
      toast.error('Failed to download resume. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleSaveSearch = () => {
    const searchName = prompt('Enter a name for this search:');
    if (searchName) {
      const newSearch = {
        id: Date.now(),
        name: searchName,
        query: searchQuery,
        filters: { ...filters },
        createdAt: new Date().toISOString(),
        isFavorite: false
      };
      
      const updated = [...savedSearches, newSearch];
      setSavedSearches(updated);
      localStorage.setItem('advancedSearchSaved', JSON.stringify(updated));
      alert('Search saved successfully!');
    }
  };

  const handleLoadSearch = (search) => {
    if (search) {
      setSearchQuery(search.query);
      setFilters(search.filters);
    }
  };

  const handlePageChange = (newPage) => {
    console.log('📄 Page change requested from', page, 'to', newPage);
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleItemsPerPageChange = (newSize) => {
    console.log('📏 Items per page changed from', itemsPerPage, 'to', newSize);
    if (newSize !== itemsPerPage) {
      setItemsPerPage(newSize);
      setPage(1); // Reset to first page when changing page size
    }
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="advanced-search-container">
      <Toaster />
      
      {/* Top Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        onClear={() => setSearchQuery('')}
        onSaveSearch={handleSaveSearch}
        onLoadSearch={() => {/* Open saved search modal */}}
        isLoading={loading}
        savedSearches={savedSearches}
      />

      <div className="advanced-search-layout">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />

        <div className="advanced-search-main">
          {/* Active Filters Bar */}
          {activeFilters.length > 0 && (
            <ActiveFiltersBar
              filters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleResetFilters}
            />
          )}

          {/* Results Header */}
          <div ref={resultsRef} className="results-header">
            <div className="results-count">
              <span className="results-count-number">{totalResults}</span>
              <span className="results-count-label">candidates found</span>
              {loading && candidates.length > 0 && (
                <span className="results-count-loading" style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                  Updating...
                </span>
              )}
            </div>

            <div className="results-controls">
              {/* Page Size Selector */}
              <PageSizeSelector
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalResults={totalResults}
              />
              
              {/* Sort Dropdown */}
              <div className="results-sort">
                <label className="results-sort-label">Sort by:</label>
                <select
                  className="results-sort-select select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="latest">Latest Updated</option>
                  <option value="experienceHigh">Experience (High to Low)</option>
                  <option value="experienceLow">Experience (Low to High)</option>
                  <option value="salaryHigh">Salary (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="results-container" style={{ opacity: loading && candidates.length === 0 ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
            {loading && candidates.length === 0 ? (
              <div className="results-loading">
                <div className="loading-spinner-large" />
                <div className="loading-text">Searching candidates...</div>
              </div>
            ) : candidates && candidates.length > 0 ? (
              <div className="results-grid">
                {candidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onViewProfile={handleViewProfile}
                    onDownloadResume={handleDownloadResume}
                  />
                ))}
              </div>
            ) : (
              <div className="results-empty">
                <div className="empty-icon">
                  <Filter size={120} />
                </div>
                <h3 className="empty-title">No candidates found</h3>
                <p className="empty-message">
                  Try adjusting your filters or search query to find more results
                </p>
                <div className="empty-actions">
                  <button className="btn btn-primary" onClick={handleResetFilters}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Professional Pagination - Bottom Only */}
          {!loading && candidates.length > 0 && totalResults > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalResults={totalResults}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <button
        className="mobile-filter-toggle"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <Filter className="mobile-filter-icon" />
        {activeFilters.length > 0 && (
          <div className="filter-count-badge">{activeFilters.length}</div>
        )}
      </button>

      {/* Candidate Profile Modal */}
      {isProfileModalOpen && selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};

// Candidate Profile Modal Component
const CandidateProfileModal = ({ candidate, onClose }) => {
  const [downloadMessage, setDownloadMessage] = React.useState(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const {
    id,
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    profile = '',
    company = '',
    experience = 0,
    currentPackage = 0,
    expectedCTC = 0,
    location = '',
    noticePeriod = '',
    primarySkills = '',
    secondarySkills = '',
    status = '',
    education = '',
    employmentHistory = '',
    qualification = '',
    specialization = '',
    degree = '',
    passingYear = '',
    resumeUrl = '',
    alternatePhone = '',
    gender = '',
    dateOfBirth = ''
  } = candidate;

  const fullName = `${firstName} ${lastName}`.trim();

  const showMessage = (message, type = 'error') => {
    setDownloadMessage({ text: message, type });
    setTimeout(() => setDownloadMessage(null), 3000);
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      if (!resumeUrl || resumeUrl.trim() === '') {
        showMessage('Resume file not available', 'error');
        return;
      }

      setIsDownloading(true);
      const token = localStorage.getItem('auth_token');
      
      // If resumeUrl is a direct link, open it
      if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')) {
        window.open(resumeUrl, '_blank');
        showMessage('Download successful!', 'success');
        setIsDownloading(false);
        return;
      }

      // Otherwise, download from backend
      const response = await fetch(`http://localhost:8080/api/candidates/${id}/resume`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          showMessage('Resume file does not exist', 'error');
          setIsDownloading(false);
          return;
        }
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${firstName}_${lastName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showMessage('Download successful!', 'success');
      setIsDownloading(false);
    } catch (error) {
      showMessage('Download failed. Please try again.', 'error');
      setIsDownloading(false);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>×</button>
        
        <div className="profile-modal-header">
          <div className="profile-modal-avatar">
            {fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
          </div>
          <div className="profile-modal-title">
            <h2>{fullName}</h2>
            <p>{profile}</p>
          </div>
        </div>

        <div className="profile-modal-body">
          {/* Personal Information */}
          <div className="profile-section compact">
            <h3 className="profile-section-title">Personal Information</h3>
            <div className="profile-info-grid compact">
              <div className="profile-info-item">
                <span className="profile-label">Email</span>
                <span className="profile-value">{email || 'N/A'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Phone</span>
                <span className="profile-value">{phone || 'N/A'}</span>
              </div>
              {alternatePhone && (
                <div className="profile-info-item">
                  <span className="profile-label">Alternate Phone</span>
                  <span className="profile-value">{alternatePhone}</span>
                </div>
              )}
              <div className="profile-info-item">
                <span className="profile-label">Location</span>
                <span className="profile-value">{location || 'N/A'}</span>
              </div>
              {gender && (
                <div className="profile-info-item">
                  <span className="profile-label">Gender</span>
                  <span className="profile-value">{gender}</span>
                </div>
              )}
              {dateOfBirth && (
                <div className="profile-info-item">
                  <span className="profile-label">DOB</span>
                  <span className="profile-value">{new Date(dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Details */}
          <div className="profile-section compact">
            <h3 className="profile-section-title">Professional Details</h3>
            <div className="profile-info-grid compact">
              <div className="profile-info-item">
                <span className="profile-label">Experience</span>
                <span className="profile-value">{experience} {experience === 1 ? 'Year' : 'Years'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Current Company</span>
                <span className="profile-value">{company || 'N/A'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Notice Period</span>
                <span className="profile-value">{noticePeriod || 'N/A'}</span>
              </div>
              {status && (
                <div className="profile-info-item">
                  <span className="profile-label">Status</span>
                  <span className={`profile-status-badge status-${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Compensation */}
          <div className="profile-section compact">
            <h3 className="profile-section-title">Compensation</h3>
            <div className="profile-info-grid compact">
              <div className="profile-info-item">
                <span className="profile-label">Current CTC</span>
                <span className="profile-value profile-ctc">₹{currentPackage || 0} LPA</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Expected CTC</span>
                <span className="profile-value profile-ctc-expected">₹{expectedCTC || 0} LPA</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="profile-section compact">
            <h3 className="profile-section-title">Education</h3>
            {(() => {
              let educationEntries = [];
              
              // Try to parse education JSON
              if (education) {
                try {
                  const parsed = JSON.parse(education);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    educationEntries = parsed;
                  }
                } catch (e) {
                  // If not JSON, try old format
                  if (degree) {
                    educationEntries = [{
                      degree: degree,
                      specialization: specialization || '',
                      passingYear: passingYear || ''
                    }];
                  }
                }
              } else if (degree) {
                // Fallback to old single degree format
                educationEntries = [{
                  degree: degree,
                  specialization: specialization || '',
                  passingYear: passingYear || ''
                }];
              }
              
              if (educationEntries.length > 0) {
                return educationEntries.map((entry, index) => (
                  <div key={index} className="profile-info-grid compact" style={{ marginBottom: index < educationEntries.length - 1 ? '10px' : '0', paddingBottom: index < educationEntries.length - 1 ? '10px' : '0', borderBottom: index < educationEntries.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                    {entry.degree && (
                      <div className="profile-info-item">
                        <span className="profile-label">Degree</span>
                        <span className="profile-value">{entry.degree}</span>
                      </div>
                    )}
                    {entry.specialization && (
                      <div className="profile-info-item">
                        <span className="profile-label">Specialization</span>
                        <span className="profile-value">{entry.specialization}</span>
                      </div>
                    )}
                    {entry.institution && (
                      <div className="profile-info-item">
                        <span className="profile-label">Institution</span>
                        <span className="profile-value">{entry.institution}</span>
                      </div>
                    )}
                    {entry.passingYear && (
                      <div className="profile-info-item">
                        <span className="profile-label">Passing Year</span>
                        <span className="profile-value">{entry.passingYear}</span>
                      </div>
                    )}
                    {entry.percentage && (
                      <div className="profile-info-item">
                        <span className="profile-label">Percentage</span>
                        <span className="profile-value">{entry.percentage}%</span>
                      </div>
                    )}
                  </div>
                ));
              }
              
              return <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No education details available</p>;
            })()}
          </div>

          {/* Skills */}
          {(primarySkills || secondarySkills) && (
            <div className="profile-section compact">
              <h3 className="profile-section-title">Skills</h3>
              <div className="profile-skills-list compact">
                {primarySkills && primarySkills.split(',').map((skill, index) => (
                  <span key={`p-${index}`} className="profile-skill-tag primary">
                    {skill.trim()}
                  </span>
                ))}
                {secondarySkills && secondarySkills.split(',').map((skill, index) => (
                  <span key={`s-${index}`} className="profile-skill-tag secondary">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-modal-footer">
          <button className="profile-modal-btn secondary" onClick={onClose}>
            Close
          </button>
          <button className="profile-modal-btn primary" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? 'Downloading...' : 'Download Resume'}
          </button>
        </div>

        {downloadMessage && (
          <div className={`profile-modal-message ${downloadMessage.type}`}>
            <span className="message-icon">
              {downloadMessage.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="message-text">{downloadMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchNew;
