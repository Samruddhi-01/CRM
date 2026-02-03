// HRManagement.js - Professional HR Management Component

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Edit2, Power, Eye, UserPen, Trash2 } from "lucide-react";
import "../styles/unified-app/design-tokens.css";
import "../styles/unified-app/app-shell.css";
import "../styles/unified-app/app-filters.css";
import "../styles/unified-app/app-tables.css";
import "../styles/unified-app/app-responsive.css";
import "../styles/components/unified-table.css";
import "../styles/pages/hr-management-unified.css";
import "../styles/pages/hr-management-responsive.css";
import {
  fetchHRUsers,
  createHRUser,
  updateHRUser,
  updateHRStatus,
  selectHRUsers,
  selectHRLoading,
  selectHRError,
  clearError,
} from "../redux/slices/hrSlice";
import { fetchCandidates } from "../redux/slices/candidatesSlice";
import Sidebar from "../components/common/Sidebar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { deleteHRUser } from "../redux/slices/hrSlice";

const HRManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteHR, setSelectedDeleteHR] = useState(null);

  const openDeleteModal = (hr) => {
    setSelectedDeleteHR(hr);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDeleteHR(null);
  };

  const confirmDeleteHR = async () => {
    try {
      await dispatch(deleteHRUser(selectedDeleteHR.id)).unwrap();
      toast.success("HR deleted successfully!");
    } catch (e) {
      toast.error("Delete failed!");
    } finally {
      closeDeleteModal();
    }
  };

  //Active/Inactive Status
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatusHR, setSelectedStatusHR] = useState(null);

  const hrUsers = useSelector(selectHRUsers);
  const loading = useSelector(selectHRLoading);
  const error = useSelector(selectHRError);
  const allCandidates = useSelector((state) => state.candidates.candidates);

  const [showModal, setShowModal] = useState(false);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [selectedHR, setSelectedHR] = useState(null);
  const [hrCandidates, setHrCandidates] = useState([]);
  const [editingHR, setEditingHR] = useState(null);
  const [candidateCount, setCandidateCount] = useState({});
  const [selectedHRDetails, setSelectedHRDetails] = useState(null);
  const [showHRDetailsModal, setShowHRDetailsModal] = useState(false);

  // Pagination and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchHRUsers());
    dispatch(fetchCandidates({ page: 0, size: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (allCandidates.length > 0 && hrUsers.length > 0) {
      const counts = {};
      hrUsers.forEach((hr) => {
        counts[hr.id] = allCandidates.filter(
          (c) => c.sourceHrId === hr.id
        ).length;
      });
      setCandidateCount(counts);
    }
  }, [allCandidates, hrUsers]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleView = (hrId) => {
    navigate(`/hr-management/${hrId}/view`);
  };

  const handleViewDetails = (hr) => {
    setSelectedHRDetails(hr);
    setShowHRDetailsModal(true);
  };

  const closeHRDetailsModal = () => {
    setShowHRDetailsModal(false);
    setSelectedHRDetails(null);
  };

  const handleEdit = (hrId) => {
    navigate(`/hr-management/${hrId}`);
  };

  // Debug: Monitor modal state changes
  useEffect(() => {
    console.log("showModal state changed to:", showModal);
  }, [showModal]);

  useEffect(() => {
    console.log("showCandidatesModal state changed to:", showCandidatesModal);
  }, [showCandidatesModal]);

  const handleOpenModal = (hr = null) => {
    console.log("=== OPEN MODAL CALLED ===");
    console.log("HR data:", hr);
    console.log("Current showModal state:", showModal);
    if (hr) {
      setEditingHR(hr);
      setFormData({
        username: hr.username,
        password: "",
        fullName: hr.fullName,
        email: hr.email,
        phone: hr.phone || "",
      });
    } else {
      setEditingHR(null);
      setFormData({
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
      });
    }
    setFormErrors({});
    console.log("Setting showModal to TRUE");
    setShowModal(true);
    console.log("showModal should now be:", true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHR(null);
    setFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!editingHR && !formData.password) {
      errors.password = "Password is required";
    }

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = { ...formData };

      if (editingHR && !submitData.password) {
        delete submitData.password;
      }

      if (editingHR) {
        await dispatch(
          updateHRUser({ id: editingHR.id, data: submitData })
        ).unwrap();
        toast.success("HR user updated successfully!", {
          duration: 3000,
          position: "top-center",
        });
      } else {
        await dispatch(createHRUser(submitData)).unwrap();
        toast.success("HR user created successfully!", {
          duration: 3000,
          position: "top-center",
        });
      }

      handleCloseModal();
    } catch (error) {
      toast.error(error.message || error || "Operation failed!", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const openStatusModal = (hr) => {
    setSelectedStatusHR(hr);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedStatusHR(null);
  };

  const confirmStatusChange = async () => {
    console.log("Dispatching status change", selectedStatusHR.id);

    try {
      await dispatch(
        updateHRStatus({
          id: selectedStatusHR.id,
          active: !selectedStatusHR.active,
        })
      ).unwrap();

      toast.success("Status updated!");
    } catch (e) {
      toast.error("Failed");
    } finally {
      closeStatusModal();
    }
  };

  useEffect(() => {
    console.log("Modal state:", showStatusModal);
  }, [showStatusModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleViewCandidates = (hr) => {
    console.log("=== VIEW CANDIDATES CALLED ===");
    console.log("HR:", hr);
    console.log("All candidates count:", allCandidates.length);
    console.log("Current showCandidatesModal:", showCandidatesModal);

    setSelectedHR(hr);
    const candidates = allCandidates.filter((c) => c.sourceHrId === hr.id);
    console.log("Filtered candidates count:", candidates.length);
    console.log("Filtered candidates:", candidates);

    setHrCandidates(candidates);
    console.log("Setting showCandidatesModal to TRUE");
    setShowCandidatesModal(true);
    console.log("showCandidatesModal should now be:", true);
  };

  const handleCloseCandidatesModal = () => {
    setShowCandidatesModal(false);
    setSelectedHR(null);
    setHrCandidates([]);
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      PENDING: "warning",
      INTERESTED: "success",
      NOT_INTERESTED: "danger",
    };
    return statusClass[status] || "info";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter HR users based on search query
  const filteredHRUsers = hrUsers.filter((hr) => {
    const query = searchQuery.toLowerCase();
    return (
      hr.fullName.toLowerCase().includes(query) ||
      hr.username.toLowerCase().includes(query) ||
      hr.email.toLowerCase().includes(query) ||
      (hr.phone && hr.phone.includes(query))
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredHRUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHRUsers = filteredHRUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search query or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            className={`pagination-btn pagination-number ${
              currentPage === i ? "active" : ""
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(
          <span key={i} className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }
    return buttons;
  };

  if (loading && hrUsers.length === 0) {
    return (
      <>
        <Sidebar />
        <div className="hr-management-page">
          <div className="hr-management-container">
            <div className="loading-container">
              <LoadingSpinner />
              <span className="loading-text">Loading HR users...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Sidebar />
      {/* Create/Edit HR Modal - Render at root level */}
      {showModal && (
        <div
          className="modal-overlay hr-management-modal"
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay")) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h2>{editingHR ? "Edit HR User" : "Add New HR User"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`form-input ${
                      formErrors.fullName ? "error" : ""
                    }`}
                    required
                  />
                  {formErrors.fullName && (
                    <span className="form-error">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Username <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    disabled={editingHR}
                    className={`form-input ${
                      formErrors.username ? "error" : ""
                    }`}
                    required
                  />
                  {formErrors.username && (
                    <span className="form-error">{formErrors.username}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={`form-input ${formErrors.email ? "error" : ""}`}
                    required
                  />
                  {formErrors.email && (
                    <span className="form-error">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength="10"
                    className={`form-input ${formErrors.phone ? "error" : ""}`}
                  />
                  {formErrors.phone && (
                    <span className="form-error">{formErrors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Password{" "}
                    {!editingHR && <span style={{ color: "#dc2626" }}>*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      editingHR
                        ? "Leave blank to keep current"
                        : "Enter password"
                    }
                    className={`form-input ${
                      formErrors.password ? "error" : ""
                    }`}
                    required={!editingHR}
                  />
                  {formErrors.password && (
                    <span className="form-error">{formErrors.password}</span>
                  )}
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-base btn-neutral btn-md"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-base btn-primary btn-md"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : editingHR ? "Update HR" : "Create HR"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* HR Details Modal - Candidate-like View Popup */}
      {showHRDetailsModal && selectedHRDetails && (
        <div className="hr-details-modal-overlay" onClick={closeHRDetailsModal}>
          <div
            className="hr-details-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hr-details-modal-header">
              <h2 className="hr-details-modal-title">HR Profile</h2>
              <button
                className="hr-details-modal-close"
                onClick={closeHRDetailsModal}
              >
                ✕
              </button>
            </div>
            <div className="hr-details-modal-body">
              <div className="hr-detail-section">
                <h3 className="hr-section-title">Personal Information</h3>
                <div className="hr-detail-grid">
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">Full Name</span>
                    <span className="hr-detail-value">
                      {selectedHRDetails.fullName}
                    </span>
                  </div>
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">Username</span>
                    <span className="hr-detail-value">
                      {selectedHRDetails.username}
                    </span>
                  </div>
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">Email Address</span>
                    <span className="hr-detail-value">
                      {selectedHRDetails.email}
                    </span>
                  </div>
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">Phone Number</span>
                    <span
                      className={`hr-detail-value ${
                        !selectedHRDetails.phone ? "empty" : ""
                      }`}
                    >
                      {selectedHRDetails.phone || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hr-detail-section">
                <h3 className="hr-section-title">Account Information</h3>
                <div className="hr-detail-grid">
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">Status</span>
                    <span className="hr-detail-value">
                      <span
                        className={`status-badge ${
                          selectedHRDetails.active
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {selectedHRDetails.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </span>
                  </div>
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">Last Login</span>
                    <span className="hr-detail-value">
                      {formatDate(selectedHRDetails.lastLogin)}
                    </span>
                  </div>
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">Account Created</span>
                    <span className="hr-detail-value">
                      {formatDate(selectedHRDetails.createdAt)}
                    </span>
                  </div>
                  <div className="hr-detail-item">
                    <span className="hr-detail-label">
                      Total Candidates Added
                    </span>
                    <span className="hr-detail-value">
                      {candidateCount[selectedHRDetails.id] || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Candidates Modal - Render at root level */}
      {showCandidatesModal && selectedHR && (
        <div
          className="modal-overlay hr-management-modal"
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay")) {
              handleCloseCandidatesModal();
            }
          }}
        >
          <div
            className="modal modal-large"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h2>Candidates Added by {selectedHR?.fullName}</h2>
              <button
                className="modal-close"
                onClick={handleCloseCandidatesModal}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {hrCandidates.length === 0 ? (
                <div className="empty-state">
                  <p>No candidates found for this HR</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="table-professional">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Profile</th>
                        <th>Experience</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hrCandidates.map((candidate) => (
                        <tr key={candidate.id}>
                          <td className="table-name-cell">
                            {candidate.firstName} {candidate.lastName}
                          </td>
                          <td>{candidate.email}</td>
                          <td>{candidate.phone}</td>
                          <td>{candidate.company || "-"}</td>
                          <td>{candidate.profile || "-"}</td>
                          <td>{candidate.experience || "-"}</td>
                          <td>
                            <span
                              className={`badge-base badge-${getStatusBadge(
                                candidate.status
                              )}`}
                            >
                              {candidate.status}
                            </span>
                          </td>
                          <td>{formatDate(candidate.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-base btn-neutral btn-md"
                onClick={handleCloseCandidatesModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="main-wrapper">
        <main className="content">
          <div className="app-ui hr-management-page">
            {/* Page Header */}
            <div className="page-header">
              <div>
                <h1 className="page-header-title">HR Management</h1>
              </div>
              <div className="page-header-actions">
                <button
                  className="btn-primary-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Add HR button clicked");
                    navigate("/hr-management/new");
                  }}
                  type="button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add New HR
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="filter-card">
              <div className="filter-grid">
                <div className="form-group col-1">
                  <label className="form-label">Search</label>
                  <div className="search-input-wrapper">
                    <svg
                      className="search-input-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Name, username, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group col-1">
                  <label className="form-label">Show Entries</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="form-select"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>

            {/* HR Users Table */}
            <div className="table-card">
              <div className="table-header">
                <h2 className="table-title">
                  {filteredHRUsers.length} HR Users
                </h2>
              </div>

              {filteredHRUsers.length === 0 ? (
                <div className="table-empty">
                  <div className="table-empty-icon">📋</div>
                  <h3 className="table-empty-title">No Data Found</h3>
                  <p className="table-empty-text">
                    {searchQuery
                      ? "No HR users found matching your search"
                      : "No HR users found"}
                  </p>
                  {!searchQuery && (
                    <div className="table-empty-action">
                      <button
                        type="button"
                        className="btn-primary-cta"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Empty state: Add HR button clicked");
                          navigate("/hr-management/new");
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add First HR User
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Table Header with Show Entries - Matching Job Openings */}
                  <div className="table-header-section">
                    <div className="table-header-wrapper">
                      <div className="results-info">
                        <p className="results-count">
                          Showing <strong>{currentHRUsers.length}</strong> of{" "}
                          <strong>{filteredHRUsers.length}</strong> HR users
                        </p>
                      </div>
                      <div className="show-entries-wrapper">
                        <label className="show-entries-label">
                          Show entries:
                        </label>
                        <select
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                          className="show-entries-select"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Unified Table System */}
                  <div className="unified-table-section">
                    <div className="unified-table-wrapper">
                      <table
                        className="unified-table"
                        role="table"
                        aria-label="HR Users"
                      >
                        <thead>
                          <tr>
                            <th>NAME</th>
                            <th>USERNAME</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th className="text-center">CANDIDATES</th>
                            <th>STATUS</th>
                            <th>LAST LOGIN</th>
                            <th>CREATED</th>
                            <th className="text-center">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentHRUsers.map((hr) => (
                            <tr key={hr.id}>
                              <td className="cell-name">{hr.fullName}</td>
                              <td>{hr.username}</td>
                              <td className="cell-email">{hr.email}</td>
                              <td className="cell-phone">{hr.phone || "—"}</td>
                              <td className="text-center">
                                {candidateCount[hr.id] &&
                                candidateCount[hr.id] > 0 ? (
                                  <button
                                    type="button"
                                    className="hr-candidate-count"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleViewCandidates(hr);
                                    }}
                                    aria-label={`View ${
                                      candidateCount[hr.id]
                                    } candidates for ${hr.fullName}`}
                                  >
                                    {candidateCount[hr.id]}
                                  </button>
                                ) : (
                                  <span className="text-muted">0</span>
                                )}
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${
                                    hr.active
                                      ? "status-active"
                                      : "status-inactive"
                                  }`}
                                >
                                  {hr.active ? "ACTIVE" : "INACTIVE"}
                                </span>
                              </td>
                              <td>{formatDate(hr.lastLogin)}</td>
                              <td className="cell-date">
                                {formatDate(hr.createdAt)}
                              </td>
                              <td className="cell-actions">
                                <div
                                  className="unified-action-buttons"
                                  role="group"
                                  aria-label={`Actions for ${hr.fullName}`}
                                >
                                  <button
                                    type="button"
                                    className="unified-action-btn unified-btn-edit"
                                    onClick={() => handleEdit(hr.id)}
                                    title="Edit HR User"
                                    aria-label={`Edit ${hr.fullName}`}
                                  >
                                    {/* <Edit2 size={14} /> */}
                                    <UserPen />
                                  </button>

                                  <button
                                    type="button"
                                    className="unified-action-btn unified-btn-view"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleViewDetails(hr);
                                    }}
                                    title="View HR Details"
                                    aria-label={`View details for ${hr.fullName}`}
                                  >
                                    <Eye size={14} />
                                  </button>

                                  {hr.active ? (
                                    <button
                                      type="button"
                                      className="unified-action-btn unified-btn-pause"
                                      onClick={() => openStatusModal(hr)}
                                      title="Deactivate HR User"
                                    >
                                      <Power size={18} />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="unified-action-btn unified-btn-delete"
                                      onClick={() => openDeleteModal(hr)}
                                      title="Delete HR User"
                                    >
                                      <Trash2 size={60} strokeWidth={1.75} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination - Matching Job Openings Style */}
                  {totalPages > 0 && (
                    <div className="pagination-wrapper-centered">
                      <div className="pagination-container">
                        <button
                          className="pagination-btn pagination-btn-prev"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          title="Previous Page"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                          >
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                          <span>Previous</span>
                        </button>

                        <div className="pagination-numbers">
                          {renderPaginationButtons()}
                        </div>

                        <button
                          className="pagination-btn pagination-btn-next"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          title="Next Page"
                        >
                          <span>Next</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      </div>

                      <div className="pagination-info">
                        <span>
                          Page <strong>{currentPage}</strong> of{" "}
                          <strong>{totalPages}</strong>
                        </span>
                        <span className="pagination-separator">•</span>
                        <span>
                          Total <strong>{filteredHRUsers.length}</strong>{" "}
                          entries
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Status Modal */}
          {showStatusModal && selectedStatusHR && (
            <div className="modal-overlayy hr-management-modal">
              <div className="modal">
                <div className="modal-header">
                  <h2>Confirm Action</h2>
                  <button className="modal-close" onClick={closeStatusModal}>
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  <p>
                    Are you sure you want to
                    <strong>
                      {selectedStatusHR.active ? " deactivate " : " activate "}
                    </strong>
                    this HR user?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-base btn-neutral btn-md"
                    onClick={closeStatusModal}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn-base btn-danger btn-md"
                    onClick={confirmStatusChange}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Yes, Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete HR Modal */}
          {showDeleteModal && selectedDeleteHR && (
            <div className="modal-overlayy hr-management-modal">
              <div className="modal">
                <div className="modal-header">
                  <h2>Confirm Delete</h2>
                  <button className="modal-close" onClick={closeDeleteModal}>
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  <div className="delete-icon">⚠</div>
                  <p>
                    Are you sure you want to
                    <strong> permanently delete </strong>
                    <br />
                    {selectedDeleteHR.fullName}?
                    <br />
                    This action <strong>cannot be undone.</strong>
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-base btn-neutral btn-md"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn-base btn-danger btn-md"
                    onClick={confirmDeleteHR}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default HRManagement;
