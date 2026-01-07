// HRPerformanceStandalone.js - Admin HR Performance Analytics Dashboard (Standalone)

import React, { useEffect, useState } from "react";

// ----- Dummy HR overview data (replace with API later) -----
const DUMMY_HR_OVERVIEW = [
  {
    hrId: 1,
    fullName: "Snehal Pawar",
    email: "snehal.hr@example.com",
    totalCandidates: 15,
    hiredCount: 4,
    contactedCount: 8,
    pendingCount: 3,
    lastActivity: "2025-01-10T10:00:00Z",
  },
  {
    hrId: 2,
    fullName: "Rutuja Patil",
    email: "rutuja.hr@example.com",
    totalCandidates: 10,
    hiredCount: 2,
    contactedCount: 5,
    pendingCount: 3,
    lastActivity: "2025-02-02T14:30:00Z",
  },
];

// ----- Dummy candidates per HR -----
const DUMMY_HR_CANDIDATES = {
  1: {
    content: [
      {
        id: 101,
        fullName: "Akash Sharma",
        email: "akash@example.com",
        phone: "9876543210",
        profile: "Java Developer",
        experience: "3 years",
        appliedOpenings: ["Java Backend", "API Developer"],
        status: "INTERESTED",
        statusLabel: "Interested",
        hrRemark: "Good communication skills",
        adminRemark: "Schedule technical interview",
        createdAt: "2025-01-05T09:00:00Z",
      },
      {
        id: 102,
        fullName: "Priya Deshmukh",
        email: "priya@example.com",
        phone: "9876500000",
        profile: "React Developer",
        experience: "2 years",
        appliedOpenings: ["React Frontend"],
        status: "PENDING",
        statusLabel: "Pending",
        hrRemark: "",
        adminRemark: "",
        createdAt: "2025-01-08T11:15:00Z",
      },
    ],
    totalElements: 2,
    totalPages: 1,
  },
  2: {
    content: [
      {
        id: 201,
        fullName: "Rohan Patil",
        email: "rohan@example.com",
        phone: "9999000011",
        profile: "Full Stack Developer",
        experience: "4 years",
        appliedOpenings: ["Full Stack Role"],
        status: "CONTACTED",
        statusLabel: "Contacted",
        hrRemark: "Waiting for feedback",
        adminRemark: "",
        createdAt: "2025-02-01T10:30:00Z",
      },
    ],
    totalElements: 1,
    totalPages: 1,
  },
};

// ----- Simple Loading component -----
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div style={{ padding: "1rem", textAlign: "center" }}>
    <div style={{ marginBottom: "0.5rem" }}>⏳</div>
    <div>{message}</div>
  </div>
);

// ----- Helper: format date -----
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ----- Helper: status badge class -> style -----
const getStatusBadgeStyle = (status) => {
  const base = {
    display: "inline-flex",
    padding: "0.15rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: 500,
  };

  switch (status) {
    case "CONTACTED":
      return { ...base, background: "#e0f2fe", color: "#0369a1" };
    case "INTERESTED":
      return { ...base, background: "#dcfce7", color: "#166534" };
    case "HIRED":
      return { ...base, background: "#bbf7d0", color: "#15803d" };
    case "OFFERED":
      return { ...base, background: "#fef9c3", color: "#854d0e" };
    case "NOT_INTERESTED":
      return { ...base, background: "#fee2e2", color: "#b91c1c" };
    case "PENDING":
      return { ...base, background: "#f3f4f6", color: "#4b5563" };
    case "TELL_LATER":
      return { ...base, background: "#e5e7eb", color: "#374151" };
    default:
      return { ...base, background: "#e5e7eb", color: "#374151" };
  }
};

const HRPerformance = () => {
  // overview
  const [hrOverview, setHrOverview] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // selected HR detail
  const [selectedHRId, setSelectedHRId] = useState(null);
  const [selectedHRName, setSelectedHRName] = useState("");
  const [hrCandidates, setHrCandidates] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
  });
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  // filters & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // inline edit state
  const [editingAdminRemark, setEditingAdminRemark] = useState(null);
  const [adminRemarkValue, setAdminRemarkValue] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // -------- Load overview on mount (simulated) --------
  useEffect(() => {
    setOverviewLoading(true);
    setTimeout(() => {
      setHrOverview(DUMMY_HR_OVERVIEW);
      setOverviewLoading(false);
    }, 400);
  }, []);

  // -------- Load HR candidates when HR / filters / page change --------
  useEffect(() => {
    if (!selectedHRId) return;

    setCandidatesLoading(true);
    setTimeout(() => {
      let data = DUMMY_HR_CANDIDATES[selectedHRId] || {
        content: [],
        totalElements: 0,
        totalPages: 0,
      };

      // apply search & status filter client-side
      let filtered = data.content.filter((c) => {
        let ok = true;

        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          const text =
            `${c.fullName} ${c.email ?? ""} ${c.phone ?? ""}`.toLowerCase();
          if (!text.includes(term)) ok = false;
        }

        if (statusFilter) {
          if (c.status !== statusFilter) ok = false;
        }

        return ok;
      });

      const pageSize = 10;
      const totalElements = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
      const page = Math.min(currentPage, totalPages - 1);
      const start = page * pageSize;
      const end = start + pageSize;

      setHrCandidates({
        content: filtered.slice(start, end),
        totalElements,
        totalPages,
      });
      setCurrentPage(page);
      setCandidatesLoading(false);
    }, 400);
  }, [selectedHRId, searchQuery, statusFilter, currentPage]);

  // -------- Handlers --------

  const handleSelectHR = (hr) => {
    setSelectedHRId(hr.hrId);
    setSelectedHRName(hr.fullName);
    setCurrentPage(0);
    setSearchQuery("");
    setStatusFilter("");
    setEditingAdminRemark(null);
    setEditingStatus(null);
  };

  const handleBackToOverview = () => {
    setSelectedHRId(null);
    setSelectedHRName("");
    setHrCandidates({ content: [], totalElements: 0, totalPages: 0 });
    setSearchQuery("");
    setStatusFilter("");
    setCurrentPage(0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleEditAdminRemark = (candidate) => {
    setEditingAdminRemark(candidate.id);
    setAdminRemarkValue(candidate.adminRemark || "");
  };

  const handleSaveAdminRemark = async (candidateId) => {
    setUpdateLoading(true);
    setTimeout(() => {
      setHrCandidates((prev) => ({
        ...prev,
        content: prev.content.map((c) =>
          c.id === candidateId ? { ...c, adminRemark: adminRemarkValue } : c
        ),
      }));
      setEditingAdminRemark(null);
      setAdminRemarkValue("");
      setUpdateLoading(false);
    }, 300);
  };

  const handleCancelAdminRemark = () => {
    setEditingAdminRemark(null);
    setAdminRemarkValue("");
  };

  const handleEditStatus = (candidate) => {
    setEditingStatus(candidate.id);
    setStatusValue(candidate.status);
  };

  const handleSaveStatus = async (candidateId) => {
    setUpdateLoading(true);
    setTimeout(() => {
      setHrCandidates((prev) => ({
        ...prev,
        content: prev.content.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                status: statusValue,
                statusLabel:
                  statusValue
                    .toLowerCase()
                    .split("_")
                    .map((s) => s[0].toUpperCase() + s.slice(1))
                    .join(" ") || c.statusLabel,
              }
            : c
        ),
      }));
      setEditingStatus(null);
      setStatusValue("");
      setUpdateLoading(false);
    }, 300);
  };

  const handleCancelStatus = () => {
    setEditingStatus(null);
    setStatusValue("");
  };

  // -------- Render --------

  if (overviewLoading && hrOverview.length === 0) {
    return <LoadingSpinner message="Loading HR performance data..." />;
  }

  return (
    <div
      className="hr-performance-page"
      style={{
        padding: "1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            className="page-title"
            style={{ margin: 0, color: "#0f172a", fontSize: "1.5rem" }}
          >
            HR Performance Analytics
          </h1>
          <p
            className="page-subtitle"
            style={{ margin: "0.3rem 0 0", color: "#64748b" }}
          >
            Monitor HR team performance and candidate management
          </p>
        </div>
        {selectedHRId && (
          <button
            className="btn btn-secondary"
            onClick={handleBackToOverview}
            style={{
              padding: "0.5rem 0.9rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#e2e8f0",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            ← Back to Overview
          </button>
        )}
      </div>

      <div className="hr-performance-container" style={{ display: "flex" }}>
        {/* MASTER: HR Overview */}
        {!selectedHRId && (
          <div style={{ width: "100%" }}>
            <div
              className="section-header"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <h2
                className="section-title"
                style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}
              >
                HR Team Overview
              </h2>
              <span
                className="badge badge-primary"
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  background: "#0f172a",
                  color: "#fff",
                }}
              >
                {hrOverview.length} HR Users
              </span>
            </div>

            <div
              className="hr-overview-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {hrOverview.map((hr) => (
                <div
                  key={hr.hrId}
                  className="hr-overview-card"
                  onClick={() => handleSelectHR(hr)}
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "1rem",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    className="hr-card-header"
                    style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
                  >
                    <div
                      className="hr-avatar"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "999px",
                        background: "#0f172a",
                        color: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                      }}
                    >
                      {hr.fullName.charAt(0)}
                    </div>
                    <div className="hr-info">
                      <h3
                        className="hr-name"
                        style={{ margin: 0, fontSize: "1rem", color: "#0f172a" }}
                      >
                        {hr.fullName}
                      </h3>
                      <p
                        className="hr-email"
                        style={{ margin: "0.15rem 0 0", fontSize: "0.85rem", color: "#64748b" }}
                      >
                        {hr.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className="hr-metrics"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    <div className="hr-metric">
                      <span className="metric-label" style={{ color: "#94a3b8" }}>
                        Total Candidates
                      </span>
                      <div className="metric-value" style={{ fontWeight: 600 }}>
                        {hr.totalCandidates}
                      </div>
                    </div>
                    <div className="hr-metric">
                      <span className="metric-label" style={{ color: "#94a3b8" }}>
                        Hired
                      </span>
                      <div className="metric-value" style={{ fontWeight: 600, color: "#16a34a" }}>
                        {hr.hiredCount}
                      </div>
                    </div>
                    <div className="hr-metric">
                      <span className="metric-label" style={{ color: "#94a3b8" }}>
                        Contacted
                      </span>
                      <div className="metric-value" style={{ fontWeight: 600, color: "#0284c7" }}>
                        {hr.contactedCount}
                      </div>
                    </div>
                    <div className="hr-metric">
                      <span className="metric-label" style={{ color: "#94a3b8" }}>
                        Pending
                      </span>
                      <div className="metric-value" style={{ fontWeight: 600, color: "#f59e0b" }}>
                        {hr.pendingCount}
                      </div>
                    </div>
                  </div>

                  <div
                    className="hr-card-footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    <span
                      className="last-activity"
                      style={{ fontSize: "0.8rem", color: "#94a3b8" }}
                    >
                      Last Activity: {formatDate(hr.lastActivity)}
                    </span>
                    <button
                      className="btn btn-sm btn-primary"
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "999px",
                        border: "none",
                        background: "#0f172a",
                        color: "#e5e7eb",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      View Candidates →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hrOverview.length === 0 && !overviewLoading && (
              <div
                className="empty-state"
                style={{ textAlign: "center", marginTop: "3rem" }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
                <h3 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>
                  No HR Users Found
                </h3>
                <p style={{ color: "#64748b", marginBottom: "0.5rem" }}>
                  There are currently no HR users with assigned candidates.
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  Create HR accounts or assign candidates to start tracking performance.
                </p>
              </div>
            )}
          </div>
        )}

        {/* DETAIL: HR Candidates */}
        {selectedHRId && (
          <div className="hr-candidates-section" style={{ width: "100%" }}>
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <h2
                  className="section-title"
                  style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}
                >
                  Candidates – {selectedHRName}
                </h2>
                <p
                  className="section-subtitle"
                  style={{ margin: "0.2rem 0 0", color: "#64748b" }}
                >
                  {hrCandidates.totalElements} total candidates
                </p>
              </div>
            </div>

            {/* Filters */}
            <div
              className="candidates-filters"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="search-form"
                style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
              >
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{
                    padding: "0.45rem 0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    minWidth: "220px",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0f172a",
                    color: "#e5e7eb",
                    cursor: "pointer",
                  }}
                >
                  Search
                </button>
              </form>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="status-filter"
                style={{
                  padding: "0.45rem 0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                }}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="INTERESTED">Interested</option>
                <option value="CONTACTED">Contacted</option>
                <option value="OFFERED">Offered</option>
                <option value="HIRED">Hired</option>
                <option value="NOT_INTERESTED">Not Interested</option>
              </select>
            </div>

            {/* Candidates Table */}
            {candidatesLoading ? (
              <LoadingSpinner message="Loading candidates..." />
            ) : (
              <div
                className="table-container"
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  padding: "1rem",
                  overflowX: "auto",
                }}
              >
                <table
                  className="candidates-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "900px",
                    fontSize: "0.9rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        Candidate
                      </th>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        Contact
                      </th>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        Profile
                      </th>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        Applied To
                      </th>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        Status
                      </th>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        HR Remark
                      </th>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        Admin Remark
                      </th>
                      <th style={{ textAlign: "left", padding: "0.5rem" }}>
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hrCandidates.content.map((candidate) => (
                      <tr
                        key={candidate.id}
                        style={{ borderBottom: "1px solid #e5e7eb" }}
                      >
                        <td style={{ padding: "0.5rem" }}>
                          <div className="candidate-info">
                            <strong>{candidate.fullName}</strong>
                          </div>
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          <div className="contact-info">
                            <div>{candidate.email}</div>
                            <div
                              className="text-muted"
                              style={{ color: "#6b7280", fontSize: "0.8rem" }}
                            >
                              {candidate.phone}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          <div className="profile-info">
                            <div>{candidate.profile || "N/A"}</div>
                            <div
                              className="text-muted"
                              style={{ color: "#6b7280", fontSize: "0.8rem" }}
                            >
                              {candidate.experience || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {candidate.appliedOpenings &&
                          candidate.appliedOpenings.length > 0 ? (
                            <div
                              className="applied-openings"
                              style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}
                            >
                              {candidate.appliedOpenings
                                .slice(0, 2)
                                .map((opening, idx) => (
                                  <span
                                    key={idx}
                                    className="opening-badge"
                                    style={{
                                      padding: "0.15rem 0.4rem",
                                      borderRadius: "999px",
                                      background: "#eff6ff",
                                      color: "#1d4ed8",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {opening}
                                  </span>
                                ))}
                              {candidate.appliedOpenings.length > 2 && (
                                <span
                                  className="opening-badge"
                                  style={{
                                    padding: "0.15rem 0.4rem",
                                    borderRadius: "999px",
                                    background: "#e5e7eb",
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  +{candidate.appliedOpenings.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ color: "#9ca3af", fontSize: "0.85rem" }}
                            >
                              None
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {editingStatus === candidate.id ? (
                            <div
                              className="inline-edit"
                              style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}
                            >
                              <select
                                value={statusValue}
                                onChange={(e) => setStatusValue(e.target.value)}
                                className="status-select"
                                style={{
                                  padding: "0.3rem 0.4rem",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="INTERESTED">Interested</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="OFFERED">Offered</option>
                                <option value="HIRED">Hired</option>
                                <option value="NOT_INTERESTED">Not Interested</option>
                                <option value="TELL_LATER">Tell Later</option>
                              </select>
                              <button
                                onClick={() => handleSaveStatus(candidate.id)}
                                className="btn-icon btn-save"
                                disabled={updateLoading}
                                style={{
                                  border: "none",
                                  background: "#16a34a",
                                  color: "#fff",
                                  borderRadius: "4px",
                                  padding: "0.2rem 0.3rem",
                                  cursor: "pointer",
                                }}
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelStatus}
                                className="btn-icon btn-cancel"
                                style={{
                                  border: "none",
                                  background: "#ef4444",
                                  color: "#fff",
                                  borderRadius: "4px",
                                  padding: "0.2rem 0.3rem",
                                  cursor: "pointer",
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div
                              className="status-display"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <span
                                className="status-badge"
                                style={getStatusBadgeStyle(candidate.status)}
                              >
                                {candidate.statusLabel}
                              </span>
                              <button
                                onClick={() => handleEditStatus(candidate)}
                                className="btn-icon btn-edit"
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                }}
                              >
                                ✎
                              </button>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          <div
                            className="remark-cell"
                            title={candidate.hrRemark}
                            style={{
                              maxWidth: "180px",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              fontSize: "0.85rem",
                            }}
                          >
                            {candidate.hrRemark || (
                              <span
                                className="text-muted"
                                style={{ color: "#9ca3af" }}
                              >
                                No remark
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {editingAdminRemark === candidate.id ? (
                            <div className="inline-edit-textarea">
                              <textarea
                                value={adminRemarkValue}
                                onChange={(e) => setAdminRemarkValue(e.target.value)}
                                className="remark-textarea"
                                rows={2}
                                placeholder="Add admin remark..."
                                style={{
                                  width: "100%",
                                  padding: "0.4rem",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  fontSize: "0.85rem",
                                  resize: "vertical",
                                }}
                              />
                              <div
                                className="edit-actions"
                                style={{
                                  display: "flex",
                                  gap: "0.3rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                <button
                                  onClick={() => handleSaveAdminRemark(candidate.id)}
                                  className="btn btn-sm btn-primary"
                                  disabled={updateLoading}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#0f172a",
                                    color: "#e5e7eb",
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelAdminRemark}
                                  className="btn btn-sm btn-secondary"
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1",
                                    background: "#e2e8f0",
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="remark-display">
                              <div
                                className="remark-cell"
                                title={candidate.adminRemark}
                                style={{
                                  maxWidth: "180px",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {candidate.adminRemark || (
                                  <span
                                    className="text-muted"
                                    style={{ color: "#9ca3af" }}
                                  >
                                    No remark
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleEditAdminRemark(candidate)}
                                className="btn-icon btn-edit"
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                  marginTop: "0.2rem",
                                }}
                              >
                                ✎
                              </button>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {formatDate(candidate.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {hrCandidates.content.length === 0 && (
                  <div
                    className="empty-state"
                    style={{
                      textAlign: "center",
                      padding: "1.5rem 0.5rem 0.5rem",
                      color: "#6b7280",
                    }}
                  >
                    No candidates found
                  </div>
                )}

                {/* Pagination */}
                {hrCandidates.totalPages > 1 && (
                  <div
                    className="pagination"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.75rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentPage === 0}
                      className="btn btn-secondary"
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        background: "#e2e8f0",
                        cursor: currentPage === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      ← Previous
                    </button>
                    <span className="page-info" style={{ color: "#64748b" }}>
                      Page {currentPage + 1} of {hrCandidates.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(hrCandidates.totalPages - 1, prev + 1)
                        )
                      }
                      disabled={currentPage >= hrCandidates.totalPages - 1}
                      className="btn btn-secondary"
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        background: "#e2e8f0",
                        cursor:
                          currentPage >= hrCandidates.totalPages - 1
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRPerformance;
