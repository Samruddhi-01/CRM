import React, { useState, useEffect, useRef, useCallback } from "react";
import { Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CandidateFilters from "../Component/CandidateFilters";
import SearchBar from "../components/advanced-search/SearchBar";
import ActiveFiltersBar from "../components/advanced-search/ActiveFiltersBar";
import CandidateTable from "../Component/CandidateTable";
import Pagination from "../components/advanced-search/Pagination";
import PageSizeSelector from "../components/advanced-search/PageSizeSelector";
import "../styles/advanced-search/index.css";
import "../styles/unified-app/enhanced-filter-layout.css";

const AdvancedSearchNew = () => {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
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
    skillMatchType: "ANY",
    degree: [],
    specialization: "",
    passingYearRange: [2000, currentYear],
    educationGap: [],
    employmentHistory: [],
    status: [],
    company: "",
    profile: "",
    excludeDuplicates: false,
    excludeBlocked: false,
    verifiedOnly: false,
  });

  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use ref to track if this is the first render
  const hasMounted = useRef(false);
  const resultsRef = useRef(null);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("advancedSearchSaved");
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = useCallback(async () => {
    setHasSearched(true);

    if (candidates.length === 0) setLoading(true);

    try {
      const cleanFilters = {};

      if (filters.currentLocations?.length)
        cleanFilters.locations = filters.currentLocations;
      if (filters.primarySkills?.length)
        cleanFilters.primarySkills = filters.primarySkills;
      if (filters.secondarySkills?.length)
        cleanFilters.secondarySkills = filters.secondarySkills;

      if (filters.experienceLevel?.length)
        cleanFilters.experienceLevel = filters.experienceLevel;
      if (filters.noticePeriod?.length)
        cleanFilters.noticePeriod = filters.noticePeriod;
      if (filters.degree?.length) cleanFilters.degree = filters.degree;
      if (filters.educationGap?.length)
        cleanFilters.educationGap = filters.educationGap;
      if (filters.employmentHistory?.length)
        cleanFilters.employmentHistory = filters.employmentHistory;

      if (filters.status?.length)
        cleanFilters.applicationStatus = filters.status;

      if (filters.minExperience > 0)
        cleanFilters.minExperience = filters.minExperience;

      if (filters.currentCTC[0] > 0 || filters.currentCTC[1] < 100) {
        cleanFilters.minCurrentCTC = filters.currentCTC[0];
        cleanFilters.maxCurrentCTC = filters.currentCTC[1];
      }

      if (filters.expectedCTC[0] > 0 || filters.expectedCTC[1] < 150) {
        cleanFilters.minExpectedCTC = filters.expectedCTC[0];
        cleanFilters.maxExpectedCTC = filters.expectedCTC[1];
      }

      if (filters.company) cleanFilters.company = filters.company;
      if (filters.profile) cleanFilters.profile = filters.profile;

      if (filters.skillMatchType !== "ANY")
        cleanFilters.skillMatchType = filters.skillMatchType;

      if (
        filters.passingYearRange[0] > 2000 ||
        filters.passingYearRange[1] < currentYear
      ) {
        cleanFilters.minPassingYear = filters.passingYearRange[0];
        cleanFilters.maxPassingYear = filters.passingYearRange[1];
      }

      const payload = {
        query: searchQuery?.trim() || "",
        filters: cleanFilters,
        sortBy,
        page,
        limit: itemsPerPage,
      };

      console.log("🔍 Advanced Search Payload:", payload);

      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        "http://localhost:8080/api/search/candidates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();

      setCandidates(data.results || []);
      setTotalResults(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("❌ Search error:", err);
      setCandidates([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, page, itemsPerPage, sortBy, currentYear]);

  // Debounced search - trigger when dependencies change
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const hasFilters =
      searchQuery.trim() !== "" ||
      filters.currentLocations.length > 0 ||
      filters.primarySkills.length > 0 ||
      filters.secondarySkills.length > 0 ||
      filters.experienceLevel.length > 0 ||
      filters.noticePeriod.length > 0 ||
      filters.degree.length > 0 ||
      filters.educationGap.length > 0 ||
      filters.employmentHistory.length > 0 ||
      filters.status.length > 0 ||
      filters.company.trim() !== "" ||
      filters.profile.trim() !== "" ||
      filters.excludeDuplicates ||
      filters.excludeBlocked ||
      filters.verifiedOnly ||
      filters.minExperience > 0 ||
      filters.skillMatchType !== "ANY" ||
      filters.passingYearRange[0] > 2000 ||
      filters.passingYearRange[1] < currentYear ||
      filters.currentCTC[0] > 0 ||
      filters.currentCTC[1] < 100 ||
      filters.expectedCTC[0] > 0 ||
      filters.expectedCTC[1] < 150;

    if (!hasFilters) return; // ⛔ Don't auto search when everything empty

    setHasSearched(true); // ✅ mark that user has initiated a search

    setPage(1);

    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filters, searchQuery, sortBy, itemsPerPage]);

  // Scroll to results when page changes
  useEffect(() => {
    if (!hasMounted.current || page === 1) return;

    const el = resultsRef.current;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }, [page]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    // 🧠 Mark that there is NO active search
    setHasSearched(false);

    // 🧼 Reset all filters
    setFilters({
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
      skillMatchType: "ANY",
      degree: [],
      specialization: "",
      passingYearRange: [2000, currentYear],
      educationGap: [],
      employmentHistory: [],
      status: [],
      company: "",
      profile: "",
      excludeDuplicates: false,
      excludeBlocked: false,
      verifiedOnly: false,
    });

    // 🔎 Clear search input
    setSearchQuery("");

    // 📄 Reset pagination
    setPage(1);

    // ❌ CLEAR RESULTS COMPLETELY
    setCandidates([]);
    setTotalResults(0);
    setTotalPages(1);

    // 🛑 Stop any loading state
    setLoading(false);
  };

  const getActiveFilters = () => {
    const active = [];

    const pushArray = (key, label, arr) => {
      if (!arr) return;

      // Convert string -> array
      if (typeof arr === "string") {
        if (arr.trim() !== "") {
          active.push({
            key,
            category: label,
            value: arr,
          });
        }
        return;
      }

      // Ensure array
      if (Array.isArray(arr) && arr.length > 0) {
        active.push({
          key,
          category: label,
          value: arr.join(", "),
        });
      }
    };

    const pushString = (key, label, val) => {
      if (val && val.trim() !== "") {
        active.push({
          key,
          category: label,
          value: val,
        });
      }
    };

    // Location
    pushArray("currentLocations", "Current Location", filters.currentLocations);

    // Experience level
    pushArray("experienceLevel", "Experience Level", filters.experienceLevel);

    // Minimum experience
    if (filters.minExperience > 0) {
      const years = Math.floor(filters.minExperience);
      const months = Math.round((filters.minExperience - years) * 10);

      const format = () => {
        if (years && months) return `${years}Y ${months}M`;
        if (years) return `${years} Year${years > 1 ? "s" : ""}`;
        return `${months} Month${months > 1 ? "s" : ""}`;
      };

      active.push({
        key: "minExperience",
        category: "Minimum Experience",
        value: format(),
      });
    }

    // Notice period
    pushArray("noticePeriod", "Notice Period", filters.noticePeriod);

    // Employment
    pushArray("employmentTypes", "Employment Type", filters.employmentTypes);

    // Skills
    pushArray("primarySkills", "Primary Skills", filters.primarySkills);
    pushArray("secondarySkills", "Secondary Skills", filters.secondarySkills);

    // Education
    pushArray("degree", "Degree", filters.degree);
    pushString("specialization", "Specialization", filters.specialization);
    pushArray("educationGap", "Education Gap", filters.educationGap);
    pushArray(
      "employmentHistory",
      "Employment History",
      filters.employmentHistory
    );

    // Company & profile
    pushString("company", "Company", filters.company);
    pushString("profile", "Profile", filters.profile);

    // Status
    pushArray("applicationStatus", "Status", filters.status);

    // Boolean flags
    if (filters.excludeDuplicates) {
      active.push({
        key: "excludeDuplicates",
        category: "Filter",
        value: "Exclude Duplicates",
      });
    }

    if (filters.excludeBlocked) {
      active.push({
        key: "excludeBlocked",
        category: "Filter",
        value: "Exclude Blocked",
      });
    }

    if (filters.verifiedOnly) {
      active.push({
        key: "verifiedOnly",
        category: "Filter",
        value: "Verified Only",
      });
    }

    return active;
  };

  const handleRemoveFilter = (key) => {
    // Handle special filter keys
    if (key === "minExperience") {
      setFilters((prev) => ({ ...prev, minExperience: 0 }));
    } else if (Array.isArray(filters[key])) {
      // Array filters (multi-select)
      handleFilterChange(key, []);
    } else if (typeof filters[key] === "boolean") {
      // Boolean filter
      handleFilterChange(key, false);
    } else if (key === "applicationStatus") {
      handleFilterChange("status", []);
    } else {
      // String filters
      handleFilterChange(key, "");
    }
  };

  const handleViewProfile = (candidate) => {
    console.log("👤 Opening candidate profile:", candidate.id);
    setSelectedCandidate(candidate);
    setIsProfileModalOpen(true);
  };

  const handleDownloadResume = async (candidate) => {
    try {
      console.log("📥 Downloading resume for candidate:", candidate.id);

      // Check if candidate has a resume URL
      if (!candidate.resumeUrl || candidate.resumeUrl.trim() === "") {
        toast.error("No resume available for this candidate", {
          duration: 3000,
          position: "top-center",
        });
        return;
      }

      const token = localStorage.getItem("auth_token");
      const resumeUrl = candidate.resumeUrl;

      // If resumeUrl is a direct link (http/https), open it
      if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
        // Open in new tab
        window.open(resumeUrl, "_blank");
        toast.success("Opening resume in new tab", {
          duration: 2000,
          position: "top-center",
        });
        return;
      }

      // Otherwise, try to download from backend
      const response = await fetch(
        `http://localhost:8080/api/candidates/${candidate.id}/resume`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Resume file not found on server", {
            duration: 3000,
            position: "top-center",
          });
          return;
        }
        throw new Error(`Failed to download resume: ${response.status}`);
      }

      // Get filename from header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
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
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Resume downloaded successfully", {
        duration: 2000,
        position: "top-center",
      });
      console.log("✅ Resume downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading resume:", error);
      toast.error("Failed to download resume. Please try again.", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleSaveSearch = () => {
    const searchName = prompt("Enter a name for this search:");
    if (searchName) {
      const newSearch = {
        id: Date.now(),
        name: searchName,
        query: searchQuery,
        filters: { ...filters },
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      const updated = [...savedSearches, newSearch];
      setSavedSearches(updated);
      localStorage.setItem("advancedSearchSaved", JSON.stringify(updated));
      toast.success("Search saved successfully!");
    }
  };

  const handleLoadSearch = (search) => {
    if (search) {
      setSearchQuery(search.query);
      setFilters(search.filters);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setPage(1);

    // ✅ Only search if user has already searched before
    if (hasSearched) {
      setTimeout(() => handleSearch(), 0);
    }
  };

  useEffect(() => {
    if (!hasMounted.current) return;

    // 🚫 Do not fetch on initial load
    if (!hasSearched) return;

    handleSearch();
  }, [page]);

  const activeFilters = getActiveFilters();

  return (
    <div className="advanced-search-container">
      <Toaster />

      {/* Top Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={() => {
          setPage(1);
          handleSearch();
        }}
        onClear={() => {
          setSearchQuery("");
          setCandidates([]);
          setTotalResults(0);
          setTotalPages(1);
          setHasSearched(false);
        }}
        onSaveSearch={handleSaveSearch}
        onLoadSearch={() => {}}
        isLoading={loading}
        savedSearches={savedSearches}
      />

      <div className="advanced-search-layout">
        {/* Left Filter Sidebar */}
        <CandidateFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
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
                <span
                  className="results-count-loading"
                  style={{
                    marginLeft: "10px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
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
                  <option value="experienceHigh">
                    Experience (High to Low)
                  </option>
                  <option value="experienceLow">
                    Experience (Low to High)
                  </option>
                  <option value="salaryHigh">Salary (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div
            className="results-container"
            style={{
              opacity: loading && candidates.length === 0 ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {loading && candidates.length === 0 ? (
              <div className="results-loading">
                <div className="loading-spinner-large" />
                <div className="loading-text">Searching candidates...</div>
              </div>
            ) : candidates && candidates.length > 0 ? (
              <div className="results-grid">
                <CandidateTable
                  candidates={candidates}
                  onViewProfile={handleViewProfile}
                  onDownloadResume={handleDownloadResume}
                />
              </div>
            ) : !hasSearched ? (
              // 🟡 Initial State (before any search)
              <div className="results-empty">
                <div className="empty-icon">
                  <Filter size={120} />
                </div>
                <h3 className="empty-title">Start your search</h3>
                <p className="empty-message">
                  Apply filters or type in the search bar to find candidates
                </p>
              </div>
            ) : (
              // 🔴 No Results After Search
              <div className="results-empty">
                <div className="empty-icon">
                  <Filter size={120} />
                </div>
                <h3 className="empty-title">No candidates found</h3>
                <p className="empty-message">
                  Try adjusting your filters or search query to find more
                  results
                </p>
                <div className="empty-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleResetFilters}
                  >
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
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    profile = "",
    company = "",
    experience = 0,
    currentPackage = 0,
    expectedCTC = 0,
    location = "",
    noticePeriod = "",
    primarySkills = "",
    secondarySkills = "",
    status = "",
    education = "",
    specialization = "",
    degree = "",
    passingYear = "",
    resumeUrl = "",
    alternatePhone = "",
    gender = "",
    dateOfBirth = "",
  } = candidate;

  const fullName = `${firstName} ${lastName}`.trim();

  const showMessage = (message, type = "error") => {
    setDownloadMessage({ text: message, type });
    setTimeout(() => setDownloadMessage(null), 3000);
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      if (!resumeUrl || resumeUrl.trim() === "") {
        showMessage("Resume file not available", "error");
        return;
      }

      setIsDownloading(true);
      const token = localStorage.getItem("auth_token");

      // If resumeUrl is a direct link, open it
      if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
        window.open(resumeUrl, "_blank");
        showMessage("Download successful!", "success");
        setIsDownloading(false);
        return;
      }

      // Otherwise, download from backend
      const response = await fetch(
        `http://localhost:8080/api/candidates/${id}/resume`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          showMessage("Resume file does not exist", "error");
          setIsDownloading(false);
          return;
        }
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${firstName}_${lastName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showMessage("Download successful!", "success");
      setIsDownloading(false);
    } catch (error) {
      showMessage("Download failed. Please try again.", "error");
      setIsDownloading(false);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div
        className="profile-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="profile-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="profile-modal-header">
          <div className="profile-modal-avatar">
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)}
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
                <span className="profile-value">{email || "N/A"}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Phone</span>
                <span className="profile-value">{phone || "N/A"}</span>
              </div>
              {alternatePhone && (
                <div className="profile-info-item">
                  <span className="profile-label">Alternate Phone</span>
                  <span className="profile-value">{alternatePhone}</span>
                </div>
              )}
              <div className="profile-info-item">
                <span className="profile-label">Location</span>
                <span className="profile-value">{location || "N/A"}</span>
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
                  <span className="profile-value">
                    {new Date(dateOfBirth).toLocaleDateString()}
                  </span>
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
                <span className="profile-value">
                  {experience} {experience === 1 ? "Year" : "Years"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Current Company</span>
                <span className="profile-value">{company || "N/A"}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Notice Period</span>
                <span className="profile-value">{noticePeriod || "N/A"}</span>
              </div>
              {status && (
                <div className="profile-info-item">
                  <span className="profile-label">Status</span>
                  <span
                    className={`profile-status-badge status-${status.toLowerCase()}`}
                  >
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
                <span className="profile-value profile-ctc">
                  ₹{currentPackage || 0} LPA
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Expected CTC</span>
                <span className="profile-value profile-ctc-expected">
                  ₹{expectedCTC || 0} LPA
                </span>
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
                    educationEntries = [
                      {
                        degree: degree,
                        specialization: specialization || "",
                        passingYear: passingYear || "",
                      },
                    ];
                  }
                }
              } else if (degree) {
                // Fallback to old single degree format
                educationEntries = [
                  {
                    degree: degree,
                    specialization: specialization || "",
                    passingYear: passingYear || "",
                  },
                ];
              }

              if (educationEntries.length > 0) {
                return educationEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="profile-info-grid compact"
                    style={{
                      marginBottom:
                        index < educationEntries.length - 1 ? "10px" : "0",
                      paddingBottom:
                        index < educationEntries.length - 1 ? "10px" : "0",
                      borderBottom:
                        index < educationEntries.length - 1
                          ? "1px solid #E5E7EB"
                          : "none",
                    }}
                  >
                    {entry.degree && (
                      <div className="profile-info-item">
                        <span className="profile-label">Degree</span>
                        <span className="profile-value">{entry.degree}</span>
                      </div>
                    )}
                    {entry.specialization && (
                      <div className="profile-info-item">
                        <span className="profile-label">Specialization</span>
                        <span className="profile-value">
                          {entry.specialization}
                        </span>
                      </div>
                    )}
                    {entry.institution && (
                      <div className="profile-info-item">
                        <span className="profile-label">Institution</span>
                        <span className="profile-value">
                          {entry.institution}
                        </span>
                      </div>
                    )}
                    {entry.passingYear && (
                      <div className="profile-info-item">
                        <span className="profile-label">Passing Year</span>
                        <span className="profile-value">
                          {entry.passingYear}
                        </span>
                      </div>
                    )}
                    {entry.percentage && (
                      <div className="profile-info-item">
                        <span className="profile-label">Percentage</span>
                        <span className="profile-value">
                          {entry.percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                ));
              }

              return (
                <p style={{ color: "#9CA3AF", fontSize: "13px" }}>
                  No education details available
                </p>
              );
            })()}
          </div>

          {/* Skills */}
          {(primarySkills || secondarySkills) && (
            <div className="profile-section compact">
              <h3 className="profile-section-title">Skills</h3>
              <div className="profile-skills-list compact">
                {primarySkills &&
                  primarySkills.split(",").map((skill, index) => (
                    <span
                      key={`p-${index}`}
                      className="profile-skill-tag primary"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                {secondarySkills &&
                  secondarySkills.split(",").map((skill, index) => (
                    <span
                      key={`s-${index}`}
                      className="profile-skill-tag secondary"
                    >
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
          <button
            className="profile-modal-btn primary"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "Downloading..." : "Download Resume"}
          </button>
        </div>

        {downloadMessage && (
          <div className={`profile-modal-message ${downloadMessage.type}`}>
            <span className="message-icon">
              {downloadMessage.type === "success" ? "✅" : "❌"}
            </span>
            <span className="message-text">{downloadMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchNew;
