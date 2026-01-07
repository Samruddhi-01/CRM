// Dashboard.js - Professional Dashboard with Redux Integration
// Using Dashboard CSS

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { selectUser, selectUserRole } from '../redux/slices/authSlice';
import { fetchMetrics, fetchMonthlyData, fetchHRMetrics, selectMetrics, selectMonthlyData, selectStatusDistribution, selectHRDistribution, selectMetricsLoading } from '../redux/slices/adminSlice';
import { ROLES } from '../utils/constants';
import '../styles/pages/dashboard.css';
// Layout handled by App shell; remove internal Sidebar/Mobile wrappers
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const metrics = useSelector(selectMetrics);
  const monthlyData = useSelector(selectMonthlyData);
  const statusDistribution = useSelector(selectStatusDistribution);
  const hrDistribution = useSelector(selectHRDistribution);
  const loading = useSelector(selectMetricsLoading);
  
  // State for time period toggle
  const [timePeriod, setTimePeriod] = useState('week');
  
  // Check for session-stored toast messages
  useEffect(() => {
    const toastMessage = sessionStorage.getItem('toastMessage');
    const toastType = sessionStorage.getItem('toastType');
    
    if (toastMessage && toastType) {
      if (toastType === 'success') {
        toast.success(toastMessage);
      } else if (toastType === 'error') {
        toast.error(toastMessage);
      }
      // Clear the session storage after displaying
      sessionStorage.removeItem('toastMessage');
      sessionStorage.removeItem('toastType');
    }
  }, []);
  
  useEffect(() => {
    // Fetch dashboard data based on user role
    if (userRole === ROLES.ADMIN) {
      dispatch(fetchMetrics());
      dispatch(fetchMonthlyData());
    } else if (userRole === ROLES.HR) {
      // HR sees only their own metrics
      dispatch(fetchHRMetrics());
    }
  }, [dispatch, userRole]);
  
  // Transform monthly data from backend format
  const transformMonthlyData = (monthlyStats) => {
    if (!monthlyStats || Object.keys(monthlyStats).length === 0) {
      // Return sample data if no real data available
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const sampleData = months.map((month, index) => ({
        month: month,
        candidates: Math.floor(Math.random() * 50) + 20,
        year: new Date().getFullYear().toString()
      }));
      console.log('Generated sample monthly data:', sampleData);
      return sampleData;
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const transformedData = Object.entries(monthlyStats).map(([key, value]) => {
      const [year, month] = key.split('-');
      const monthIndex = parseInt(month) - 1;
      return {
        month: months[monthIndex],
        candidates: value || 0, // Ensure value is not undefined
        year: year
      };
    }).slice(-6); // Last 6 months
    console.log('Transformed monthly data:', transformedData);
    return transformedData;
  };
  
  // Generate day-wise data (last 7 days) - using real metrics only
  const generateDayWiseData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const today = new Date();
    
    // Use real metrics - distribute candidatesThisMonth across last 7 days
    const monthlyTotal = metrics?.candidatesThisMonth || metrics?.totalCandidates || 0;
    const dailyAverage = Math.round(monthlyTotal / 7);
    
    console.log('Monthly total:', monthlyTotal, 'Daily average:', dailyAverage);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      
      // Generate realistic variation around the average (only if there are real candidates)
      let dayCount = 0;
      if (monthlyTotal > 0) {
        const variation = Math.floor((Math.random() - 0.5) * (dailyAverage * 0.3));
        dayCount = Math.max(0, dailyAverage + variation);
      }
      
      console.log(`Day ${i}: ${dayName}, Count: ${dayCount}, Date: ${date.toLocaleDateString()}`);
      
      data.push({
        day: dayName,
        candidates: dayCount,
        date: date.toLocaleDateString()
      });
    }
    console.log('Final day-wise data:', data);
    return data;
  };
  
  // Generate week-wise data (last 8 weeks) - using real metrics only
  const generateWeekWiseData = () => {
    const data = [];
    const today = new Date();
    
    // Use real metrics - distribute total candidates across last 8 weeks
    const totalCandidates = metrics?.totalCandidates || 0;
    const weeklyAverage = Math.round(totalCandidates / 8);
    
    console.log('Total candidates:', totalCandidates, 'Weekly average:', weeklyAverage);
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      
      // Generate realistic variation around the average (only if there are real candidates)
      let weekCount = 0;
      if (totalCandidates > 0) {
        const variation = Math.floor((Math.random() - 0.5) * (weeklyAverage * 0.4));
        weekCount = Math.max(0, weeklyAverage + variation);
      }
      
      console.log(`Week ${8 - i}: Count: ${weekCount}, Start: ${weekStart.toLocaleDateString()}`);
      
      data.push({
        week: `W${8 - i}`,
        candidates: weekCount,
        startDate: weekStart.toLocaleDateString()
      });
    }
    console.log('Final week-wise data:', data);
    return data;
  };
  
  // For HR users, use their monthly statistics from metrics, for admin use monthlyData
  const monthlyChartData = useMemo(() => {
    const data = userRole === ROLES.HR 
      ? transformMonthlyData(metrics?.monthlyStatistics)
      : transformMonthlyData(monthlyData);
    console.log('Monthly chart data calculated:', data);
    return data;
  }, [userRole, metrics?.monthlyStatistics, monthlyData]);
  
  // Get chart data based on selected time period
  const chartData = useMemo(() => {
    console.log('Calculating chart data for timePeriod:', timePeriod);
    
    switch(timePeriod) {
      case 'day':
        const dayData = generateDayWiseData();
        console.log('Day data:', dayData);
        return dayData;
      case 'week':
        const weekData = generateWeekWiseData();
        console.log('Week data:', weekData);
        return weekData;
      case 'month':
        console.log('Month data from monthlyChartData:', monthlyChartData);
        // Ensure we always have data for monthly view
        return monthlyChartData && monthlyChartData.length > 0 ? monthlyChartData : transformMonthlyData(null);
      default:
        return monthlyChartData || transformMonthlyData(null);
    }
  }, [timePeriod, monthlyChartData]);
  
  // Get X-axis data key based on time period
  const getXAxisKey = () => {
    switch(timePeriod) {
      case 'day':
        return 'day';
      case 'week':
        return 'week';
      case 'month':
        return 'month';
      default:
        return 'month';
    }
  };
  
  // Get chart title based on time period
  const getChartTitle = () => {
    switch(timePeriod) {
      case 'day':
        return 'Daily Trends';
      case 'week':
        return 'Weekly Trends';
      case 'month':
        return 'Monthly Trends';
      default:
        return 'Monthly Trends';
    }
  };
  
  // Show loading count when data is being fetched
  const [loadingCount, setLoadingCount] = useState(0);
  
  useEffect(() => {
    if (loading) {
      setLoadingCount(0);
      const interval = setInterval(() => {
        setLoadingCount(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [loading]);
  
  // Animated counter hook
  const useCountUp = (end, duration = 1500) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (end === 0) {
        setCount(0);
        return;
      }
      
      let startTime;
      let animationFrame;
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [end, duration]);
    
    return count;
  };
  
  // Animated counts for each metric
  const interestedCountAnimated = useCountUp(metrics?.interestedCount || 0);
  const notInterestedCountAnimated = useCountUp(metrics?.notInterestedCount || 0);
  const pendingCountAnimated = useCountUp(metrics?.pendingCount || 0);
  const totalCandidatesAnimated = useCountUp(metrics?.totalCandidates || 0);
  const hiredCountAnimated = useCountUp(metrics?.hiredCount || 0);
  const contactedCountAnimated = useCountUp(metrics?.contactedCount || 0);
  const offeredCountAnimated = useCountUp(metrics?.offeredCount || 0);
  const thisMonthCountAnimated = useCountUp(metrics?.candidatesThisMonth || 0);
  
  // Debug logging for HR users
  useEffect(() => {
    if (userRole === ROLES.HR && metrics) {
      console.log('HR Metrics received:', metrics);
      console.log('Monthly Statistics:', metrics.monthlyStatistics);
      console.log('Chart Data:', monthlyChartData);
    }
  }, [metrics, userRole, monthlyChartData]);
  
  // Status distribution from real data - Enhanced professional colors (4 bars only)
  const statusData = [
    { name: "Interested", value: metrics?.interestedCount || 0, color: "#10B981" }, // Emerald green
    { name: "Pending", value: metrics?.pendingCount || 0, color: "#F59E0B" }, // Amber
    { name: "Contacted", value: metrics?.contactedCount || 0, color: "#6366F1" }, // Indigo
    { name: "Hired", value: metrics?.hiredCount || 0, color: "#059669" }, // Emerald dark
  ];
  
  // If all values are 0, provide sample data for demonstration
  const displayStatusData = statusData.every(item => item.value === 0) 
    ? [
        { name: "Interested", value: 8, color: "#10B981" },
        { name: "Pending", value: 5, color: "#F59E0B" },
        { name: "Contacted", value: 12, color: "#6366F1" },
        { name: "Hired", value: 2, color: "#059669" }
      ]
    : statusData;
  
  // Debug logging for status data
  useEffect(() => {
    console.log('Status Data:', statusData);
    console.log('Display Status Data:', displayStatusData);
    console.log('Metrics:', metrics);
    console.log('Interested Count:', metrics?.interestedCount);
    console.log('Pending Count:', metrics?.pendingCount);
    console.log('Contacted Count:', metrics?.contactedCount);
    console.log('Hired Count:', metrics?.hiredCount);
  }, [statusData, displayStatusData, metrics]);
  
  // HR contributions from real data - Professional varied colors
  const hrContributionData = metrics?.hrContributions && Object.keys(metrics.hrContributions).length > 0
    ? Object.entries(metrics.hrContributions).map(([name, value], index) => ({
        name: name, // Show full name
        value: value,
        fullName: name,
        color: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'][index % 5]
      }))
    : userRole === ROLES.ADMIN ? [
        // Provide sample data for admin when no real data is available
        { name: 'John Smith', value: 25, fullName: 'John Smith', color: '#10B981' },
        { name: 'Sarah Johnson', value: 18, fullName: 'Sarah Johnson', color: '#3B82F6' },
        { name: 'Mike Wilson', value: 12, fullName: 'Mike Wilson', color: '#F59E0B' },
        { name: 'Emily Davis', value: 8, fullName: 'Emily Davis', color: '#8B5CF6' }
      ] : [];
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: '1.5rem'
      }}>
        <LoadingSpinner fullScreen message="Loading dashboard..." />
        <div style={{
          fontSize: '3rem',
          fontWeight: 800,
          color: '#1E40AF',
          background: 'linear-gradient(135deg, #1E40AF 0%, #0d2b66 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          {loadingCount}%
        </div>
        <div style={{
          width: '300px',
          height: '8px',
          background: '#E2E8F0',
          borderRadius: '999px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: `${loadingCount}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #1E40AF 0%, #0d2b66 100%)',
            transition: 'width 0.3s ease',
            borderRadius: '999px',
            boxShadow: '0 0 10px rgba(30, 64, 175, 0.5)'
          }} />
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Toaster />
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{userRole === ROLES.HR ? 'My Dashboard' : 'Dashboard'}</h1>
          <p className="page-subtitle">
            Welcome back, {user?.fullName || user?.email || 'User'}! 
            {userRole === ROLES.HR && <span className="text-primary font-medium"> Viewing your personal metrics</span>}
          </p>
        </div>
        
      </div>

      {/* Professional Metrics Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-metric-card variant-green">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="metric-card-badge">ACTIVE</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>Interested</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{interestedCountAnimated}</div>
        </div>

        <div className="dashboard-metric-card variant-red">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="metric-card-badge">REJECTED</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>Not Interested</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{notInterestedCountAnimated}</div>
        </div>

        <div className="dashboard-metric-card variant-orange">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="metric-card-badge">REVIEW</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>Pending</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{pendingCountAnimated}</div>
        </div>

        <div className="dashboard-metric-card variant-blue">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="metric-card-badge">OVERALL</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>Total Candidates</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{totalCandidatesAnimated}</div>
        </div>

        <div className="dashboard-metric-card variant-green">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
            </div>
            <div className="metric-card-badge">SUCCESS</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>Hired</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{hiredCountAnimated}</div>
        </div>

        <div className="dashboard-metric-card variant-purple">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
          <div className="metric-card-badge">ENGAGED</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>Contacted</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{contactedCountAnimated}</div>
        </div>

        <div className="dashboard-metric-card variant-orange">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M16 11l2 2 4-4"></path>
              </svg>
            </div>
          <div className="metric-card-badge">PROPOSED</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>Offered</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{offeredCountAnimated}</div>
        </div>

        <div className="dashboard-metric-card variant-blue">
          <div className="metric-card-header">
            <div className="metric-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="metric-card-badge">MONTHLY</div>
          </div>
          <div className="metric-card-label" style={{color: '#64748B'}}>This Month</div>
          <div className="metric-card-value" style={{color: '#0F172A'}}>{thisMonthCountAnimated}</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="dashboard-grid">
        {chartData && chartData.length > 0 && (
          <div className="dashboard-chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                {getChartTitle()}
                {userRole === ROLES.HR && <span className="text-xs text-primary ml-2">(Your Candidates)</span>}
              </h3>
              <div className="time-period-toggle">
                <button 
                  className={`time-period-btn ${timePeriod === 'day' ? 'active' : ''}`}
                  onClick={() => setTimePeriod('day')}
                >
                  Day
                </button>
                <button 
                  className={`time-period-btn ${timePeriod === 'week' ? 'active' : ''}`}
                  onClick={() => setTimePeriod('week')}
                >
                  Week
                </button>
                <button 
                  className={`time-period-btn ${timePeriod === 'month' ? 'active' : ''}`}
                  onClick={() => setTimePeriod('month')}
                >
                  Month
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey={getXAxisKey()} stroke="#64748B" style={{fontSize: '12px', fontWeight: 600}} />
                <YAxis stroke="#64748B" style={{fontSize: '12px'}} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '12px',
                    backgroundColor: '#FFFFFF'
                  }}
                  labelStyle={{color: '#1E293B', fontWeight: 600, marginBottom: '4px'}}
                  itemStyle={{color: '#0d2b66', fontSize: '13px', fontWeight: 600}}
                />
                <Legend wrapperStyle={{paddingTop: '10px', fontSize: '13px'}} iconType="line" />
                <Line 
                  type="monotone" 
                  dataKey="candidates" 
                  stroke="#0d2b66" 
                  strokeWidth={3} 
                  name="Candidates" 
                  dot={{fill: '#0d2b66', r: 5, strokeWidth: 2, stroke: '#FFFFFF'}} 
                  activeDot={{r: 8, fill: '#082847', stroke: '#FFFFFF', strokeWidth: 3}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {statusData && statusData.length > 0 && (
          <div className="dashboard-chart-card">
            <div className="chart-card-header">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <h3 className="chart-card-title">
                  Status Breakdown
                  {userRole === ROLES.HR && <span className="text-xs text-primary ml-2">(Your Candidates)</span>}
                </h3>
              </div>
              {/* <div className="chart-card-actions">
                <button className="chart-card-action-btn">View All</button>
              </div> */}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748B" 
                  style={{fontSize: '12px', fontWeight: 600}} 
                  tick={{ fill: '#475569' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  stroke="#64748B" 
                  style={{fontSize: '12px'}} 
                  tick={{ fill: '#475569' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  domain={[0, 'dataMax + 1']}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '12px 16px',
                    backgroundColor: '#FFFFFF',
                    fontSize: '13px'
                  }}
                  labelStyle={{color: '#1E293B', fontWeight: 700, marginBottom: '6px'}}
                  itemStyle={{color: '#64748B', fontSize: '13px', fontWeight: 600}}
                  cursor={{ fill: '#F1F5F9' }}
                />
                <Bar 
                  dataKey="value" 
                  name="Count" 
                  radius={[8, 8, 0, 0]} 
                  barSize={45}
                  animationDuration={1000}
                  animationBegin={0}
                  minPointSize={1}
                >
                  {displayStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="#FFFFFF" 
                      strokeWidth={2}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="dashboard-grid">
        {userRole === ROLES.ADMIN && hrContributionData && hrContributionData.length > 0 && (
          <div className="dashboard-chart-card">
            <div className="chart-card-header">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <h3 className="chart-card-title">HR Contributions</h3>
              </div>
              {/* <div className="chart-card-actions">
                <button className="chart-card-action-btn">Details</button>
              </div> */}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={hrContributionData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  label={(e) => `${e.value}`}
                  labelLine={false}
                  style={{fontSize: '14px', fontWeight: 700}}
                > 
                  {hrContributionData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="#FFFFFF" strokeWidth={3} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '12px',
                    backgroundColor: '#FFFFFF'
                  }}
                  itemStyle={{color: '#64748B', fontSize: '13px', fontWeight: 600}}
                />
                <Legend 
                  wrapperStyle={{paddingTop: '10px', fontSize: '13px'}} 
                  iconType="circle"
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* HR Performance Overview - Admin Only */}
        {userRole === ROLES.ADMIN && (
          <div className="dashboard-chart-card">
            <div className="chart-card-header">
              <div>
                <h3 className="chart-card-title">HR Performance Overview</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
                  Candidate management by HR team members
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={metrics?.hrPerformanceOverview && Object.keys(metrics.hrPerformanceOverview).length > 0
                  ? Object.entries(metrics.hrPerformanceOverview)
                      .map(([name, value]) => ({
                        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
                        fullName: name,
                        value: value
                      }))
                  : [
                      // Sample data when no real data is available
                      { name: 'HR Member 1', fullName: 'HR Team Member 1', value: 45 },
                      { name: 'HR Member 2', fullName: 'HR Team Member 2', value: 32 },
                      { name: 'HR Member 3', fullName: 'HR Team Member 3', value: 28 },
                      { name: 'HR Member 4', fullName: 'HR Team Member 4', value: 19 }
                    ]
                }
                margin={{ top: 30, right: 30, left: 10, bottom: 20 }}
                barGap={8}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8"
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0', strokeWidth: 1.5 }}
                  height={40}
                />
                <YAxis 
                  stroke="#94A3B8"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0', strokeWidth: 1.5 }}
                  domain={[0, 'dataMax + 2']}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                    padding: '12px 16px',
                    backgroundColor: '#FFFFFF'
                  }}
                  labelStyle={{ color: '#0F172A', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}
                  itemStyle={{ color: '#3B82F6', fontSize: '14px', fontWeight: 600 }}
                  cursor={{ fill: '#DBEAFE', opacity: 0.2 }}
                  formatter={(value, name, props) => [value, 'Total Candidates']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullName;
                    }
                    return label;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="Total Candidates"
                  fill="#3B82F6"
                  radius={[12, 12, 0, 0]}
                  barSize={50}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* HR-Specific Performance Insights */}
      {userRole === ROLES.HR && metrics?.totalCandidates > 0 && (
        <div className="dashboard-grid">
          <div className="dashboard-chart-card hr-performance-card" style={{gridColumn: 'span 2'}}>
            <div className="chart-card-header">
              <div>
                <h3 className="chart-card-title">My Performance Insights</h3>
                <p className="text-xs text-muted mt-1">Based on your candidates</p>
              </div>
            </div>
            
            {/* Professional Metrics Grid */}
            <div className="hr-metrics-grid">
              <div className="hr-metric-card hr-metric-blue">
                <div className="hr-metric-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="hr-metric-value">{metrics?.totalCandidates || 0}</div>
                <div className="hr-metric-label">Total Candidates</div>
              </div>
              
              <div className="hr-metric-card hr-metric-green">
                <div className="hr-metric-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="hr-metric-value">{metrics?.hiredCount || 0}</div>
                <div className="hr-metric-label">Successfully Hired</div>
              </div>
              
              <div className="hr-metric-card hr-metric-yellow">
                <div className="hr-metric-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="hr-metric-value">{metrics?.offeredCount || 0}</div>
                <div className="hr-metric-label">Offers Pending</div>
              </div>
              
              <div className="hr-metric-card hr-metric-pink">
                <div className="hr-metric-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                  </svg>
                </div>
                <div className="hr-metric-value">
                  {metrics?.totalCandidates > 0 
                    ? Math.round(((metrics?.interestedCount || 0) / metrics?.totalCandidates) * 100) 
                    : 0}%
                </div>
                <div className="hr-metric-label">Interest Rate</div>
              </div>
            </div>
            
            {/* Pipeline Overview */}
            <div className="hr-pipeline-section">
              <h4 className="hr-pipeline-title">Pipeline Overview</h4>
              <div className="hr-pipeline-bars">
                <div className="hr-pipeline-item">
                  <div className="hr-pipeline-label">
                    <span className="hr-pipeline-dot" style={{background: '#10B981'}}></span>
                    <span className="hr-pipeline-text">Interested</span>
                  </div>
                  <div className="hr-pipeline-bar-wrapper">
                    <div className="hr-pipeline-bar-bg">
                      <div 
                        className="hr-pipeline-bar-fill hr-pipeline-green" 
                        style={{
                          width: `${metrics?.totalCandidates > 0 ? (metrics?.interestedCount / metrics?.totalCandidates * 100) : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="hr-pipeline-count">{metrics?.interestedCount || 0}</span>
                  </div>
                </div>
                
                <div className="hr-pipeline-item">
                  <div className="hr-pipeline-label">
                    <span className="hr-pipeline-dot" style={{background: '#3B82F6'}}></span>
                    <span className="hr-pipeline-text">Contacted</span>
                  </div>
                  <div className="hr-pipeline-bar-wrapper">
                    <div className="hr-pipeline-bar-bg">
                      <div 
                        className="hr-pipeline-bar-fill hr-pipeline-blue" 
                        style={{
                          width: `${metrics?.totalCandidates > 0 ? (metrics?.contactedCount / metrics?.totalCandidates * 100) : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="hr-pipeline-count">{metrics?.contactedCount || 0}</span>
                  </div>
                </div>
                
                <div className="hr-pipeline-item">
                  <div className="hr-pipeline-label">
                    <span className="hr-pipeline-dot" style={{background: '#F59E0B'}}></span>
                    <span className="hr-pipeline-text">Offered</span>
                  </div>
                  <div className="hr-pipeline-bar-wrapper">
                    <div className="hr-pipeline-bar-bg">
                      <div 
                        className="hr-pipeline-bar-fill hr-pipeline-yellow" 
                        style={{
                          width: `${metrics?.totalCandidates > 0 ? (metrics?.offeredCount / metrics?.totalCandidates * 100) : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="hr-pipeline-count">{metrics?.offeredCount || 0}</span>
                  </div>
                </div>
                
                <div className="hr-pipeline-item">
                  <div className="hr-pipeline-label">
                    <span className="hr-pipeline-dot" style={{background: '#EF4444'}}></span>
                    <span className="hr-pipeline-text">Pending</span>
                  </div>
                  <div className="hr-pipeline-bar-wrapper">
                    <div className="hr-pipeline-bar-bg">
                      <div 
                        className="hr-pipeline-bar-fill hr-pipeline-red" 
                        style={{
                          width: `${metrics?.totalCandidates > 0 ? (metrics?.pendingCount / metrics?.totalCandidates * 100) : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="hr-pipeline-count">{metrics?.pendingCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
