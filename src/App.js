// App.js - Main Application with Redux Integration

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import "./styles/advanced-search/index.css";
import {
  checkAuth,
  selectIsAuthenticated,
  selectAuthLoading,
  selectUserRole,
} from "./redux/slices/authSlice";
import { selectSidebarCollapsed } from "./redux/slices/uiSlice";
import { ROLES } from "./utils/constants";

// Components
import LoadingSpinner from "./components/common/LoadingSpinner";
import Sidebar from "./components/common/Sidebar";
import Topbar from "./components/layout/Topbar";
import LoginPage from "./Component/LoginPage";
import ZerlakLoginPage from "./Component/ZerlakLoginPage";
import RegistrationForm from "./Component/RegistrationForm";
import Dashboard from "./Component/Dashboard";
import Candidates from "./Component/Candidates";
import CandidateForm from "./Component/CandidateForm";
import History from "./Component/History";
import HRManagement from "./Component/HRManagement";
import HRForm from "./Component/HRForm";
import HRDetails from "./Component/HRDetails";
import Openings from "./Component/Openings";
import OpeningForm from "./Component/OpeningForm";
import Profile from "./Component/Profile";
import Analytics from "./Component/Analytics";
import AdminReports from "./Component/AdminReports";
import AdvancedSearch from "./Component/AdvancedSearch";
import AdvancedSearchNew from "./Component/AdvancedSearchNew";
import SearchDebugger from "./Component/SearchDebugger";
import HRPerformance from "./Component/HRPerformance";
import HRCandidateRemarks from "./Component/HRCandidateRemarks";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const authLoading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/zerlak-login"].includes(
    location.pathname
  );
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [userIsActive, setUserIsActive] = useState(true);

  // Check authentication on app load (silent - no toast on first load)
  useEffect(() => {
    dispatch(checkAuth()).finally(() => {
      setInitialCheckDone(true);
    });
  }, [dispatch]);

  // Track user activity to prevent unnecessary auth checks
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      setLastActivityTime(Date.now());
      setUserIsActive(true);
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);

  // Periodic token validation (every 30 minutes) - ONLY when user is inactive
  useEffect(() => {
    if (!isAuthenticated || !initialCheckDone) return;

    const AUTH_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes (increased from 5)
    const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes of no activity

    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityTime;
      const isUserInactive = timeSinceLastActivity > INACTIVITY_THRESHOLD;

      // Skip auth check if user is actively using the app (e.g., filling forms)
      if (!isUserInactive) {
        console.log("⏭️ Skipping auth check - user is active");
        return;
      }

      console.log(
        "🔐 Periodic auth check (user inactive for",
        Math.floor(timeSinceLastActivity / 60000),
        "minutes)..."
      );

      dispatch(checkAuth())
        .unwrap()
        .catch((err) => {
          console.error("Auth check failed:", err);

          // Only handle actual authentication errors, not network errors
          const isNetworkError =
            err && (err.includes("Network") || err.includes("Failed to fetch"));

          if (isNetworkError) {
            console.warn(
              "⚠️ Network error during auth check - maintaining session"
            );
            return; // Don't logout on network errors
          }

          // Check if account is deactivated
          if (
            err &&
            typeof err === "string" &&
            err.toLowerCase().includes("deactivate")
          ) {
            toast.error(
              "⚠️ Your account has been deactivated. Please contact your administrator.",
              {
                duration: 6000,
                style: {
                  background: "#FEF2F2",
                  color: "#991B1B",
                  border: "2px solid #FCA5A5",
                  fontWeight: "600",
                },
              }
            );
          } else if (err !== "No session found") {
            // Only show toast for actual session expiration, not initial load
            toast.error("Your session has expired. Please log in again.", {
              duration: 5000,
            });
          }
        });
    }, AUTH_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated, initialCheckDone, lastActivityTime]);

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <div className={isAuthPage ? "auth-only" : "app-shell"}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#333",
            padding: "16px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
          success: {
            iconTheme: {
              primary: "#16A34A",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff",
            },
          },
        }}
      />
      {!isAuthPage && <Sidebar />}
      <div
        className={
          isAuthPage
            ? ""
            : `content-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : ""}`
        }
      >
        {!isAuthPage && <Topbar />}
        <div className={isAuthPage ? "" : "content-inner"}>
          <Routes>
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/zerlak-login" element={<ZerlakLoginPage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search/advanced"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <div className="app-ui">
                    <AdvancedSearchNew />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-debug"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <SearchDebugger />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <Candidates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates/new"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <CandidateForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates/:id"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <CandidateForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr-management"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <HRManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr-management/new"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <HRForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr-management/:id"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <HRForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr-management/:id/view"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <HRDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hr-performance"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <HRPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/my-candidates"
              element={
                <ProtectedRoute allowedRoles={[ROLES.HR]}>
                  <HRCandidateRemarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/openings"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <Openings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/openings/new"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <OpeningForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/openings/edit/:id"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <OpeningForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
