import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/pages/analytics.css';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { fetchCandidates } from '../redux/slices/candidatesSlice';
import { fetchOpenings } from '../redux/slices/openingsSlice';
import { 
  fetchOverviewMetrics, 
  fetchMonthlyStatistics,
  fetchHRPerformance 
} from '../redux/slices/analyticsSlice';

const Analytics = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  // Redux data - Real data from backend APIs
  const candidates = useSelector(state => state.candidates.candidates || []);
  const openings = useSelector(state => state.openings.openings || []);
  const overviewMetrics = useSelector(state => state.analytics.overviewMetrics);
  const monthlyStatistics = useSelector(state => state.analytics.monthlyStatistics);
  const hrPerformance = useSelector(state => state.analytics.hrPerformance);
  const analyticsLoading = useSelector(state => state.analytics.loading);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(fetchCandidates({ size: 10000 })), // Fetch all for client-side analytics
        dispatch(fetchOpenings()),
        dispatch(fetchOverviewMetrics()),
        dispatch(fetchMonthlyStatistics()),
        dispatch(fetchHRPerformance())
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data - Use backend data when available, fallback to client-side
  const analytics = {
    // Candidate Statistics from backend
    totalCandidates: overviewMetrics?.totalCandidates || candidates.length || 0,
    interestedCandidates: overviewMetrics?.interestedCount || candidates.filter(c => c.status === 'INTERESTED' || c.status === 'Interested').length,
    notInterestedCandidates: overviewMetrics?.notInterestedCount || candidates.filter(c => c.status === 'NOT_INTERESTED' || c.status === 'Not Interested').length,
    pendingCandidates: overviewMetrics?.pendingCount || candidates.filter(c => c.status === 'PENDING' || c.status === 'Pending').length,
    hiredCandidates: overviewMetrics?.hiredCount || candidates.filter(c => c.status === 'HIRED' || c.status === 'Hired').length,
    contactedCandidates: overviewMetrics?.contactedCount || candidates.filter(c => c.status === 'CONTACTED' || c.status === 'Contacted').length,
    offeredCandidates: overviewMetrics?.offeredCount || candidates.filter(c => c.status === 'OFFERED' || c.status === 'Offered').length,
    tellLaterCandidates: overviewMetrics?.tellLaterCount || candidates.filter(c => c.status === 'TELL_LATER' || c.status === 'Tell Later').length,

    // Opening Statistics
    totalOpenings: openings.length,
    activeOpenings: openings.filter(o => o.status === 'ACTIVE').length,
    closedOpenings: openings.filter(o => o.status === 'CLOSED').length,
    onHoldOpenings: openings.filter(o => o.status === 'ON_HOLD').length,
    draftOpenings: openings.filter(o => o.status === 'DRAFT').length,

    // Application Statistics
    totalApplications: openings.reduce((sum, o) => sum + (o.applicationsCount || 0), 0),
    totalPositions: openings.reduce((sum, o) => sum + (o.positions || 0), 0),
  };

  // Calculate rates
  const conversionRate = analytics.totalCandidates > 0 
    ? ((analytics.hiredCandidates / analytics.totalCandidates) * 100).toFixed(1)
    : 0;

  const interestRate = analytics.totalCandidates > 0
    ? ((analytics.interestedCandidates / analytics.totalCandidates) * 100).toFixed(1)
    : 0;

  const fillRate = analytics.totalPositions > 0
    ? ((analytics.hiredCandidates / analytics.totalPositions) * 100).toFixed(1)
    : 0;

  // Candidate Status Distribution - Real data with all statuses
  const candidateStatusData = [
    { name: 'Interested', value: analytics.interestedCandidates, color: '#10B981' },
    { name: 'Not Interested', value: analytics.notInterestedCandidates, color: '#EF4444' },
    { name: 'Pending', value: analytics.pendingCandidates, color: '#F59E0B' },
    { name: 'Hired', value: analytics.hiredCandidates, color: '#3B82F6' },
    { name: 'Contacted', value: analytics.contactedCandidates, color: '#8B5CF6' },
    { name: 'Offered', value: analytics.offeredCandidates, color: '#06B6D4' },
    { name: 'Tell Later', value: analytics.tellLaterCandidates, color: '#64748B' },
  ].filter(item => item.value > 0); // Only show statuses with data

  // Opening Status Distribution - Real data with filtering
  const openingStatusData = [
    { name: 'Active', value: analytics.activeOpenings, color: '#10B981' },
    { name: 'Closed', value: analytics.closedOpenings, color: '#64748B' },
    { name: 'On Hold', value: analytics.onHoldOpenings, color: '#F59E0B' },
    { name: 'Draft', value: analytics.draftOpenings, color: '#94A3B8' },
  ].filter(item => item.value > 0); // Only show statuses with data

  // Department Distribution - Real data grouped by department
  const departmentData = React.useMemo(() => {
    const deptMap = {};
    
    openings.forEach(opening => {
      const dept = opening.department || 'Other';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          name: dept,
          openings: 0,
          positions: 0,
          active: 0,
          applications: 0
        };
      }
      deptMap[dept].openings += 1;
      deptMap[dept].positions += opening.positions || 0;
      deptMap[dept].applications += opening.applicationsCount || 0;
      if (opening.status === 'ACTIVE') {
        deptMap[dept].active += 1;
      }
    });

    return Object.values(deptMap).sort((a, b) => b.openings - a.openings);
  }, [openings]);

  // Monthly Trend Data - Real data from backend
  const monthlyTrendData = React.useMemo(() => {
    if (!monthlyStatistics) return [];

    // Convert monthly statistics to chart format
    const months = Object.keys(monthlyStatistics).sort();
    const last6Months = months.slice(-6);

    return last6Months.map((monthKey) => {
      const [year, month] = monthKey.split('-');
      const date = new Date(year, month - 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Get candidates for this month from backend data
      const candidatesCount = monthlyStatistics[monthKey] || 0;
      
      // Calculate openings and hired for this month from candidates data
      const monthDate = new Date(year, month - 1, 1);
      const nextMonthDate = new Date(year, month, 1);
      
      const candidatesThisMonth = candidates.filter(c => {
        const createdDate = new Date(c.createdAt);
        return createdDate >= monthDate && createdDate < nextMonthDate;
      });
      
      const openingsThisMonth = openings.filter(o => {
        const createdDate = new Date(o.createdAt || o.postedDate);
        return createdDate >= monthDate && createdDate < nextMonthDate;
      }).length;
      
      const hiredThisMonth = candidatesThisMonth.filter(c => 
        c.status === 'HIRED' || c.status === 'Hired'
      ).length;

      return {
        month: monthName,
        candidates: candidatesCount,
        openings: openingsThisMonth,
        hired: hiredThisMonth,
      };
    });
  }, [monthlyStatistics, candidates, openings]);

  // Experience Level Distribution - Real data from candidates
  const experienceData = React.useMemo(() => {
    const expMap = {};
    
    candidates.forEach(candidate => {
      const exp = candidate.experience || 'Not Specified';
      expMap[exp] = (expMap[exp] || 0) + 1;
    });

    return Object.entries(expMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [candidates]);

  // Skills Distribution (top 10) - Real data from candidates
  const skillsData = React.useMemo(() => {
    const skillsMap = {};
    
    candidates.forEach(candidate => {
      const skills = candidate.skills?.split(',').map(s => s.trim()).filter(s => s) || [];
      skills.forEach(skill => {
        skillsMap[skill] = (skillsMap[skill] || 0) + 1;
      });
    });

    return Object.entries(skillsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [candidates]);

  // Export to PDF
  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics Report - ${new Date().toLocaleDateString()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            background: white;
            color: #1E293B;
          }
          .header {
            text-align: center;
            padding-bottom: 30px;
            border-bottom: 3px solid #3B82F6;
            margin-bottom: 40px;
          }
          .header h1 {
            font-size: 32px;
            color: #1E293B;
            margin-bottom: 10px;
          }
          .header p {
            color: #64748B;
            font-size: 16px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          .summary-card {
            background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
            border: 2px solid #10B981;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
          }
          .summary-card h3 {
            font-size: 14px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          .summary-card .value {
            font-size: 36px;
            font-weight: 700;
            color: #3B82F6;
            margin-bottom: 5px;
          }
          .summary-card .label {
            font-size: 12px;
            color: #94A3B8;
          }
          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 24px;
            font-weight: 700;
            color: #1E293B;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E2E8F0;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .metric-card {
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 15px;
          }
          .metric-card .metric-label {
            font-size: 12px;
            color: #64748B;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .metric-card .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: #1E293B;
          }
          .status-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #F8FAFC;
            border-radius: 8px;
            border-left: 4px solid #3B82F6;
          }
          .status-item .label {
            font-weight: 600;
            color: #475569;
          }
          .status-item .value {
            font-size: 24px;
            font-weight: 700;
            color: #1E293B;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table th {
            background: #F1F5F9;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            border-bottom: 2px solid #E2E8F0;
          }
          table td {
            padding: 12px;
            border-bottom: 1px solid #F1F5F9;
            color: #64748B;
          }
          table tr:hover {
            background: #F8FAFC;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #E2E8F0;
            text-align: center;
            color: #94A3B8;
            font-size: 12px;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .badge-success { background: #D1FAE5; color: #047857; }
          .badge-warning { background: #FEF3C7; color: #B45309; }
          .badge-danger { background: #FEE2E2; color: #DC2626; }
          .badge-info { background: #DBEAFE; color: #1E40AF; }
          @media print {
            body { padding: 20px; }
            .summary-grid { grid-template-columns: repeat(2, 1fr); }
            .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 HR Management Analytics Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Candidates</h3>
            <div class="value">${analytics.totalCandidates}</div>
            <div class="label">All time</div>
          </div>
          <div class="summary-card">
            <h3>Job Openings</h3>
            <div class="value">${analytics.totalOpenings}</div>
            <div class="label">${analytics.activeOpenings} active</div>
          </div>
          <div class="summary-card">
            <h3>Applications</h3>
            <div class="value">${analytics.totalApplications}</div>
            <div class="label">Total received</div>
          </div>
          <div class="summary-card">
            <h3>Hired</h3>
            <div class="value">${analytics.hiredCandidates}</div>
            <div class="label">${conversionRate}% conversion</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Key Performance Indicators</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Conversion Rate</div>
              <div class="metric-value">${conversionRate}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Interest Rate</div>
              <div class="metric-value">${interestRate}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Position Fill Rate</div>
              <div class="metric-value">${fillRate}%</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Candidate Status Distribution</h2>
          <div class="status-grid">
            <div class="status-item">
              <span class="label">Interested</span>
              <span class="value">${analytics.interestedCandidates}</span>
            </div>
            <div class="status-item">
              <span class="label">Pending</span>
              <span class="value">${analytics.pendingCandidates}</span>
            </div>
            <div class="status-item">
              <span class="label">Not Interested</span>
              <span class="value">${analytics.notInterestedCandidates}</span>
            </div>
            <div class="status-item">
              <span class="label">Hired</span>
              <span class="value">${analytics.hiredCandidates}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Job Opening Status</h2>
          <div class="status-grid">
            <div class="status-item">
              <span class="label">Active Openings</span>
              <span class="value">${analytics.activeOpenings}</span>
            </div>
            <div class="status-item">
              <span class="label">Closed Openings</span>
              <span class="value">${analytics.closedOpenings}</span>
            </div>
            <div class="status-item">
              <span class="label">On Hold</span>
              <span class="value">${analytics.onHoldOpenings}</span>
            </div>
            <div class="status-item">
              <span class="label">Draft</span>
              <span class="value">${analytics.draftOpenings}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Department Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Openings</th>
                <th>Positions</th>
              </tr>
            </thead>
            <tbody>
              ${departmentData.map(dept => `
                <tr>
                  <td><strong>${dept.name}</strong></td>
                  <td>${dept.openings}</td>
                  <td>${dept.positions}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Top Skills in Demand</h2>
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Candidates</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${skillsData.slice(0, 10).map(skill => `
                <tr>
                  <td><strong>${skill.name}</strong></td>
                  <td>${skill.count}</td>
                  <td>${((skill.count / analytics.totalCandidates) * 100).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This report was automatically generated by HR Management System</p>
          <p>© ${new Date().getFullYear()} All rights reserved</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="app-root">
        <Sidebar />
        <div className="main-wrapper">
          <main className="content">
            <div className="analytics-container">
              <div className="analytics-loading">
                <LoadingSpinner />
                <span>Loading analytics data...</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <Sidebar />
      <div className="main-wrapper">
        <main className="content">
          <div className="analytics-container">
            {/* Header */}
            <div className="analytics-header">
              <div className="analytics-header-content">
                <h1>Analytics Dashboard</h1>
                <p>Comprehensive insights and performance metrics</p>
              </div>
              <div className="analytics-header-actions">
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="analytics-date-select"
                  title="Select date range"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="180">Last 6 months</option>
                  <option value="365">Last year</option>
                  <option value="all">All time</option>
                </select>
                <button className="analytics-export-btn" onClick={exportToPDF}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export PDF
                </button>
                <button className="analytics-refresh-btn" onClick={loadData}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="analytics-summary-grid">
              <div className="analytics-summary-card card-blue">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{analytics.totalCandidates}</div>
                  <div className="summary-label">Total Candidates</div>
                  <div className="summary-trend positive">
                    <span>↑ {analytics.interestedCandidates} interested</span>
                  </div>
                </div>
              </div>

              <div className="analytics-summary-card card-green">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{analytics.totalOpenings}</div>
                  <div className="summary-label">Job Openings</div>
                  <div className="summary-trend positive">
                    <span>{analytics.activeOpenings} active</span>
                  </div>
                </div>
              </div>

              <div className="analytics-summary-card card-purple">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{analytics.totalApplications}</div>
                  <div className="summary-label">Applications</div>
                  <div className="summary-trend">
                    <span>Total received</span>
                  </div>
                </div>
              </div>

              <div className="analytics-summary-card card-orange">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{analytics.hiredCandidates}</div>
                  <div className="summary-label">Hired</div>
                  <div className="summary-trend positive">
                    <span>{conversionRate}% conversion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="analytics-kpi-grid">
              <div className="analytics-kpi-card">
                <div className="kpi-label">Conversion Rate</div>
                <div className="kpi-value">{conversionRate}%</div>
                <div className="kpi-description">Hired / Total Candidates</div>
                <div className="kpi-progress">
                  <div className="kpi-progress-bar" style={{ width: `${conversionRate}%` }}></div>
                </div>
              </div>

              <div className="analytics-kpi-card">
                <div className="kpi-label">Interest Rate</div>
                <div className="kpi-value">{interestRate}%</div>
                <div className="kpi-description">Interested / Total Candidates</div>
                <div className="kpi-progress">
                  <div className="kpi-progress-bar kpi-progress-green" style={{ width: `${interestRate}%` }}></div>
                </div>
              </div>

              <div className="analytics-kpi-card">
                <div className="kpi-label">Position Fill Rate</div>
                <div className="kpi-value">{fillRate}%</div>
                <div className="kpi-description">Hired / Total Positions</div>
                <div className="kpi-progress">
                  <div className="kpi-progress-bar kpi-progress-purple" style={{ width: `${fillRate}%` }}></div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="analytics-charts-grid">
              {/* Candidate Status Pie Chart */}
              <div className="analytics-chart-card">
                <div className="chart-card-header">
                  <h3>Candidate Status Distribution</h3>
                  <p>{analytics.totalCandidates} total candidates</p>
                </div>
                <div className="chart-wrapper">
                  {candidateStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={candidateStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {candidateStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94A3B8' }}>
                      <p>No candidate data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Opening Status Pie Chart */}
              <div className="analytics-chart-card">
                <div className="chart-card-header">
                  <h3>Opening Status Distribution</h3>
                  <p>{analytics.totalOpenings} total openings</p>
                </div>
                <div className="chart-wrapper">
                  {openingStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={openingStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {openingStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94A3B8' }}>
                      <p>No opening data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Trends Line Chart */}
              <div className="analytics-chart-card chart-card-wide">
                <div className="chart-card-header">
                  <h3>Monthly Trends</h3>
                  <p>Candidates, Openings & Hires over time (Last 6 months)</p>
                </div>
                <div className="chart-wrapper">
                  {monthlyTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyTrendData}>
                        <defs>
                          <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOpenings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="month" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                          labelStyle={{ fontWeight: 600, color: '#1E293B' }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="candidates" 
                          stroke="#3B82F6" 
                          fillOpacity={1} 
                          fill="url(#colorCandidates)" 
                          name="Candidates"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="openings" 
                          stroke="#10B981" 
                          fillOpacity={1} 
                          fill="url(#colorOpenings)" 
                          name="Openings"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="hired" 
                          stroke="#F59E0B" 
                          fillOpacity={1} 
                          fill="url(#colorHired)" 
                          name="Hired"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94A3B8' }}>
                      <p>No monthly trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Department Bar Chart */}
              <div className="analytics-chart-card">
                <div className="chart-card-header">
                  <h3>Department Overview</h3>
                  <p>Openings and positions by department</p>
                </div>
                <div className="chart-wrapper">
                  {departmentData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={departmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="name" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                          labelStyle={{ fontWeight: 600, color: '#1E293B' }}
                        />
                        <Legend />
                        <Bar dataKey="openings" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Openings" />
                        <Bar dataKey="positions" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Positions" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94A3B8' }}>
                      <p>No department data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Skills Bar Chart */}
              {skillsData.length > 0 && (
                <div className="analytics-chart-card">
                  <div className="chart-card-header">
                    <h3>Top Skills in Demand</h3>
                    <p>Most common skills across {candidates.length} candidates</p>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={skillsData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis type="number" stroke="#64748B" />
                        <YAxis dataKey="name" type="category" stroke="#64748B" width={120} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                          labelStyle={{ fontWeight: 600, color: '#1E293B' }}
                          formatter={(value) => [`${value} candidates`, 'Count']}
                        />
                        <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} name="Candidates" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Experience Distribution */}
              {experienceData.length > 0 && (
                <div className="analytics-chart-card">
                  <div className="chart-card-header">
                    <h3>Experience Level Distribution</h3>
                    <p>Candidate experience breakdown</p>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={experienceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="name" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                          labelStyle={{ fontWeight: 600, color: '#1E293B' }}
                          formatter={(value) => [`${value} candidates`, 'Count']}
                        />
                        <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Candidates" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* HR Performance Chart */}
              {hrPerformance && hrPerformance.length > 0 && (
                <div className="analytics-chart-card">
                  <div className="chart-card-header">
                    <h3>HR Performance Overview</h3>
                    <p>Candidate management by {hrPerformance.length} HR team member{hrPerformance.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={hrPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="hrName" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                          labelStyle={{ fontWeight: 600, color: '#1E293B' }}
                          formatter={(value) => [`${value} candidates`, 'Total']}
                        />
                        <Legend />
                        <Bar dataKey="totalCandidates" fill="#3B82F6" name="Total Candidates" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
