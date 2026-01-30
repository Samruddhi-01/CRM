import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { performGlobalSearch, setQuery, clearSearch } from '../redux/slices/globalSearchSlice';
import './GlobalSearch.css';

const GlobalSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  
  const { results, isSearching, query } = useSelector(state => state.globalSearch);
  
  // Debounce search
  useEffect(() => {
    if (localQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        dispatch(setQuery(localQuery));
        dispatch(performGlobalSearch({
          query: localQuery,
          searchCandidates: true,
          searchJobOpenings: true,
          searchHRUsers: false,
          page: 0,
          size: 5
        }));
        setIsOpen(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
      dispatch(clearSearch());
    }
  }, [localQuery, dispatch]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };
  
  const handleCandidateClick = (id) => {
    navigate(`/candidates/${id}`);
    setIsOpen(false);
    setLocalQuery('');
    dispatch(clearSearch());
  };
  
  const handleOpeningClick = (id) => {
    navigate(`/openings/edit/${id}`);
    setIsOpen(false);
    setLocalQuery('');
    dispatch(clearSearch());
  };
  
  const handleViewAll = (type) => {
    if (type === 'candidates') {
      navigate('/candidates', { state: { searchQuery: localQuery } });
    } else if (type === 'openings') {
      navigate('/openings', { state: { searchQuery: localQuery } });
    }
    setIsOpen(false);
    setLocalQuery('');
    dispatch(clearSearch());
  };
  
  const hasResults = results.totalCandidates > 0 || results.totalJobOpenings > 0;
  
  return (
    <div className="global-search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="28" height="28" viewBox="0 0 20 20" fill="none">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          className="global-search-input"
          placeholder="Search candidates, openings..."
          value={localQuery}
          onChange={handleInputChange}
          onFocus={() => localQuery.length >= 2 && setIsOpen(true)}
        />
        {isSearching && <div className="search-loading-spinner"></div>}
        {localQuery && (
          <button 
            className="search-clear-btn"
            onClick={() => {
              setLocalQuery('');
              setIsOpen(false);
              dispatch(clearSearch());
            }}
          >
            ×
          </button>
        )}
      </div>
      
      {isOpen && localQuery.length >= 2 && (
        <div className="search-results-dropdown">
          {isSearching ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : hasResults ? (
            <>
              {/* Candidates Section */}
              {results.candidateResults && results.candidateResults.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">
                    <h4>Candidates ({results.totalCandidates})</h4>
                    {results.totalCandidates > results.candidateResults.length && (
                      <button className="view-all-btn" onClick={() => handleViewAll('candidates')}>
                        View All
                      </button>
                    )}
                  </div>
                  {results.candidateResults.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className="search-result-item"
                      onClick={() => handleCandidateClick(candidate.id)}
                    >
                      <div className="result-icon candidate-icon">C</div>
                      <div className="result-content">
                        <div className="result-title">{candidate.name}</div>
                        <div className="result-meta">
                          {candidate.experience && <span>{candidate.experience} exp</span>}
                          {candidate.skills && <span>{candidate.skills}</span>}
                          <span className={`status-badge ${candidate.status?.toLowerCase()}`}>
                            {candidate.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Job Openings Section */}
              {results.jobOpeningResults && results.jobOpeningResults.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">
                    <h4>Job Openings ({results.totalJobOpenings})</h4>
                    {results.totalJobOpenings > results.jobOpeningResults.length && (
                      <button className="view-all-btn" onClick={() => handleViewAll('openings')}>
                        View All
                      </button>
                    )}
                  </div>
                  {results.jobOpeningResults.map((opening) => (
                    <div 
                      key={opening.id} 
                      className="search-result-item"
                      onClick={() => handleOpeningClick(opening.id)}
                    >
                      <div className="result-icon opening-icon">J</div>
                      <div className="result-content">
                        <div className="result-title">{opening.title}</div>
                        <div className="result-meta">
                          <span>{opening.department}</span>
                          <span>{opening.location}</span>
                          <span className={`status-badge ${opening.status?.toLowerCase()}`}>
                            {opening.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {results.searchTimeMs > 0 && (
                <div className="search-footer">
                  Search completed in {results.searchTimeMs}ms
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2"/>
                <path d="M24 16v12M24 34v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No results found for "{localQuery}"</p>
              <span>Try different keywords</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
