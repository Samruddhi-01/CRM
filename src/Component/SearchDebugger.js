// SearchDebugger.js - Temporary debugging component to test search functionality
// Remove this file after confirming searches work properly

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performGlobalSearch } from '../redux/slices/globalSearchSlice';
import { performCandidateSearch } from '../redux/slices/candidateSearchSlice';
import { performOpeningSearch } from '../redux/slices/openingSearchSlice';

const SearchDebugger = () => {
  const dispatch = useDispatch();
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [testError, setTestError] = useState(null);
  
  const globalSearch = useSelector(state => state.globalSearch);
  const candidateSearch = useSelector(state => state.candidateSearch);
  const openingSearch = useSelector(state => state.openingSearch);
  
  const testGlobalSearch = async () => {
    setTestError(null);
    setTestResults(null);
    
    try {
      const result = await dispatch(performGlobalSearch({
        query: testQuery || 'test',
        searchCandidates: true,
        searchJobOpenings: true,
        searchHRUsers: false,
        page: 0,
        size: 5
      })).unwrap();
      
      setTestResults({
        type: 'Global Search',
        data: result,
        candidates: result.candidateResults?.length || 0,
        openings: result.jobOpeningResults?.length || 0
      });
    } catch (error) {
      setTestError({
        type: 'Global Search',
        message: error.toString(),
        details: error
      });
    }
  };
  
  const testCandidateSearch = async () => {
    setTestError(null);
    setTestResults(null);
    
    try {
      const result = await dispatch(performCandidateSearch({
        textQuery: testQuery || '',
        primarySkills: [],
        skillMatchMode: 'ANY',
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      })).unwrap();
      
      setTestResults({
        type: 'Candidate Search',
        data: result,
        total: result.totalElements || 0,
        results: result.content?.length || 0
      });
    } catch (error) {
      setTestError({
        type: 'Candidate Search',
        message: error.toString(),
        details: error
      });
    }
  };
  
  const testOpeningSearch = async () => {
    setTestError(null);
    setTestResults(null);
    
    try {
      const result = await dispatch(performOpeningSearch({
        textQuery: testQuery || '',
        departments: [],
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      })).unwrap();
      
      setTestResults({
        type: 'Opening Search',
        data: result,
        total: result.totalElements || 0,
        results: result.content?.length || 0
      });
    } catch (error) {
      setTestError({
        type: 'Opening Search',
        message: error.toString(),
        details: error
      });
    }
  };
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      margin: '20px',
      fontFamily: 'monospace'
    }}>
      <h2 style={{ color: '#1E3A8A' }}>🔧 Search Functionality Debugger</h2>
      <p style={{ color: '#64748B' }}>Test each search endpoint to verify authentication and API calls</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Test Query (optional):
        </label>
        <input
          type="text"
          value={testQuery}
          onChange={(e) => setTestQuery(e.target.value)}
          placeholder="Enter search query..."
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            border: '2px solid #E2E8F0',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={testGlobalSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1E3A8A',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test Global Search
        </button>
        
        <button
          onClick={testCandidateSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#7C2D12',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test Candidate Search
        </button>
        
        <button
          onClick={testOpeningSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#047857',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test Opening Search
        </button>
      </div>
      
      {/* Redux State Display */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#1E3A8A' }}>Redux State:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <strong>Global Search:</strong>
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify({
                isSearching: globalSearch.isSearching,
                totalCandidates: globalSearch.results.totalCandidates,
                totalOpenings: globalSearch.results.totalJobOpenings,
                error: globalSearch.error
              }, null, 2)}
            </pre>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <strong>Candidate Search:</strong>
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify({
                isSearching: candidateSearch.isSearching,
                totalResults: candidateSearch.results.totalElements,
                error: candidateSearch.error
              }, null, 2)}
            </pre>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <strong>Opening Search:</strong>
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify({
                isSearching: openingSearch.isSearching,
                totalResults: openingSearch.results.totalElements,
                error: openingSearch.error
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      
      {/* Test Results */}
      {testResults && (
        <div style={{
          backgroundColor: '#D1FAE5',
          border: '2px solid #065F46',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#065F46', margin: '0 0 10px 0' }}>✅ Success: {testResults.type}</h3>
          <pre style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '300px',
            fontSize: '12px'
          }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
      
      {/* Test Errors */}
      {testError && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '2px solid #991B1B',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#991B1B', margin: '0 0 10px 0' }}>❌ Error: {testError.type}</h3>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{testError.message}</p>
          <pre style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '300px',
            fontSize: '12px'
          }}>
            {JSON.stringify(testError.details, null, 2)}
          </pre>
          
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#FEF2F2', borderRadius: '4px' }}>
            <strong>Common Issues:</strong>
            <ul style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Backend not running (check http://localhost:8080)</li>
              <li>JWT token expired (try logout and login again)</li>
              <li>Search endpoints not implemented on backend</li>
              <li>Database doesn't have any records</li>
              <li>CORS issues (check backend CORS configuration)</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#E0E7FF',
        borderRadius: '8px',
        border: '1px solid #3730A3'
      }}>
        <h4 style={{ color: '#3730A3', margin: '0 0 10px 0' }}>📋 How to Use:</h4>
        <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#1E293B' }}>
          <li>Optional: Enter a search query (leave empty for testing without query)</li>
          <li>Click one of the test buttons to make an API call</li>
          <li>Check the results or errors displayed below</li>
          <li>Verify Redux state is updating correctly</li>
          <li>If successful, the regular search components should also work</li>
          <li>If errors occur, check the console and backend logs</li>
        </ol>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
          <strong>Quick Checks:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '13px' }}>
            <li>Backend running: <code>http://localhost:8080/actuator/health</code></li>
            <li>JWT Token: Check browser localStorage → <code>authToken</code></li>
            <li>Network tab: Look for 401/403 (auth issue) or 404 (endpoint not found)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchDebugger;
