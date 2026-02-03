import React from "react";
import "./candidate-filters.css";
import { RotateCcw } from "lucide-react";
import { CANDIDATE_STATUS } from "../utils/constants";

const EXPERIENCE_LEVELS = [
  "Fresher (0-1 year)",
  "Entry Level (1-2 years)",
  "Junior (2-4 years)",
  "Mid-Level (4-6 years)",
  "Senior (6-10 years)",
  "Lead (10+ years)",
  "Expert (15+ years)",
];

const LOCATIONS = [
  "Pune",
  "Mumbai",
  "Banglore",
  "Hydrabad",
  "Chennai",
  "Delhi",
];

const PROFILES = [
  "Software Developer",
  "Flutter Developer",
  "Java Developer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "React Developer",
  "HR",
  "QA Engineer",
];

const SKILLS = [
  "Java",
  "Spring Boot",
  "React",
  "Angular",
  "MySQL",
  "MongoDB",
  "Node.js",
  "AWS",
  "Docker",
  "Flutter",
];

const CTC_RANGES = [2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20, 25];

const DEGREES = [
  "BCA",
  "MCA",
  "BE Computer",
  "BTech",
  "MTech",
  "BSc",
  "MSc",
  "Diploma",
  "12th",
  "10th",
];

const NOTICE_PERIODS = [
  "Immediate",
  "15 Days",
  "1 Month",
  "2 Months",
  "3 Months",
  "Serving Notice",
];

const Gap = ["Yes", "No"];

const currentYear = new Date().getFullYear();

const CandidateFilters = ({ filters, onChange, onReset }) => {
  const activeFilterCount = Object.entries(filters).filter(([key, val]) => {
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "boolean") return val === true;
    return val && val.toString().trim() !== "";
  }).length;

  return (
    <div className="filter-wrapper">
      <div className="filter-top">
        <h3>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</h3>
        <button className="reset-btn" onClick={onReset}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Location */}
      <select
        value={filters.currentLocations[0] || ""}
        onChange={(e) =>
          onChange("currentLocations", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Location</option>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      {/* Profile */}
      <select
        value={filters.profile}
        onChange={(e) => onChange("profile", e.target.value)}
      >
        <option value="">Profile</option>
        {PROFILES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <input
        placeholder="Company"
        value={filters.company}
        onChange={(e) => onChange("company", e.target.value)}
      />

      {/* Experience Level */}
      <select
        value={filters.experienceLevel[0] || ""}
        onChange={(e) =>
          onChange("experienceLevel", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Experience Level</option>
        {EXPERIENCE_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={filters.status[0] || ""}
        onChange={(e) =>
          onChange("status", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Status</option>
        {Object.values(CANDIDATE_STATUS).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Degree */}
      <select
        value={filters.degree[0] || ""}
        onChange={(e) =>
          onChange("degree", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Degree</option>
        {DEGREES.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Passing Year Range */}
      <div className="range-group">
        <label>Passing Year</label>
        <div className="range-inputs">
          <input
            type="number"
            value={filters.passingYearRange[0]}
            min="1980"
            max={currentYear}
            onChange={(e) =>
              onChange("passingYearRange", [
                Number(e.target.value),
                filters.passingYearRange[1],
              ])
            }
          />
          <span>to</span>
          <input
            type="number"
            value={filters.passingYearRange[1]}
            min="1980"
            max={currentYear}
            onChange={(e) =>
              onChange("passingYearRange", [
                filters.passingYearRange[0],
                Number(e.target.value),
              ])
            }
          />
        </div>
      </div>

      {/* Primary Skill */}
      <select
        value={filters.primarySkills[0] || ""}
        onChange={(e) =>
          onChange("primarySkills", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Primary Skill</option>
        {SKILLS.map((skill) => (
          <option key={skill} value={skill}>
            {skill}
          </option>
        ))}
      </select>

      {/* Current CTC */}
      <select
        value={filters.currentCTC[0]}
        onChange={(e) =>
          onChange("currentCTC", [
            Number(e.target.value),
            filters.currentCTC[1],
          ])
        }
      >
        <option value="0">Min Current CTC</option>
        {CTC_RANGES.map((ctc) => (
          <option key={ctc} value={ctc}>
            {ctc} LPA+
          </option>
        ))}
      </select>

      {/* Expected CTC */}
      <select
        value={filters.expectedCTC[0]}
        onChange={(e) =>
          onChange("expectedCTC", [
            Number(e.target.value),
            filters.expectedCTC[1],
          ])
        }
      >
        <option value="0">Min Expected CTC</option>
        {CTC_RANGES.map((ctc) => (
          <option key={ctc} value={ctc}>
            {ctc} LPA+
          </option>
        ))}
      </select>

      {/* Notice Period */}
      <select
        value={filters.noticePeriod[0] || ""}
        onChange={(e) =>
          onChange("noticePeriod", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Notice Period</option>
        {NOTICE_PERIODS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Education Gap */}
      <select
        value={filters.educationGap[0] || ""}
        onChange={(e) =>
          onChange("educationGap", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Education Gap</option>
        <option value="No Gap">No Gap</option>
        <option value="0-1 Years">0-1 Years</option>
        <option value="1-2 Years">1-2 Years</option>
        <option value="2+ Years">2+ Years</option>
      </select>

      {/* Employment History */}
      <select
        value={filters.employmentHistory[0] || ""}
        onChange={(e) =>
          onChange("employmentHistory", e.target.value ? [e.target.value] : [])
        }
      >
        <option value="">Employment History</option>
        <option value="yes">Has Employment History</option>
        <option value="no">No Employment History</option>
      </select>
    </div>
  );
};

export default CandidateFilters;
