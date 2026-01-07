-- ============================================================================
-- ADVANCED SEARCH PERFORMANCE INDEXES
-- ============================================================================
-- This script creates indexes for optimizing advanced search queries
-- Run this after your main database schema setup
-- ============================================================================

USE privateappdb;

-- ============================================================================
-- CANDIDATE INDEXES FOR SEARCH OPTIMIZATION
-- ============================================================================

-- Text search fields
CREATE INDEX idx_candidate_firstname ON candidates(first_name);
CREATE INDEX idx_candidate_lastname ON candidates(last_name);
CREATE INDEX idx_candidate_email_search ON candidates(email);
CREATE INDEX idx_candidate_phone_search ON candidates(phone);

-- Skills search (for LIKE queries)
CREATE INDEX idx_candidate_skills ON candidates(skills(255));

-- Experience and package filtering
CREATE INDEX idx_candidate_experience ON candidates(experience(50));
CREATE INDEX idx_candidate_current_package ON candidates(current_package(50));
CREATE INDEX idx_candidate_expected_ctc ON candidates(expected_ctc(50));

-- Location filtering
CREATE INDEX idx_candidate_location ON candidates(location);

-- Status filtering (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_candidate_status ON candidates(status);

-- Date range filtering (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_candidate_created_at ON candidates(created_at);
CREATE INDEX IF NOT EXISTS idx_candidate_updated_at ON candidates(updated_at);

-- HR relationship (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_candidate_source_hr ON candidates(source_hr_id);

-- Composite indexes for common filter combinations
CREATE INDEX idx_candidate_status_created ON candidates(status, created_at);
CREATE INDEX idx_candidate_location_status ON candidates(location, status);
CREATE INDEX idx_candidate_hr_created ON candidates(source_hr_id, created_at);

-- Full-text search index for text fields (MySQL 5.7+)
ALTER TABLE candidates ADD FULLTEXT INDEX idx_candidate_fulltext (first_name, last_name, skills);

-- ============================================================================
-- JOB OPENING INDEXES FOR SEARCH OPTIMIZATION
-- ============================================================================

-- Text search fields
CREATE INDEX idx_opening_title ON openings(title);
CREATE INDEX idx_opening_skills_search ON openings(skills(255));

-- Department and location filtering (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_opening_department ON openings(department);
CREATE INDEX idx_opening_location ON openings(location);

-- Type filtering
CREATE INDEX idx_opening_type ON openings(type);

-- Experience filtering
CREATE INDEX idx_opening_experience ON openings(experience(100));

-- Salary filtering
CREATE INDEX idx_opening_min_salary ON openings(min_salary(50));
CREATE INDEX idx_opening_max_salary ON openings(max_salary(50));

-- Status filtering (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_opening_status ON openings(status);

-- Date filtering (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_opening_created_at ON openings(created_at);
CREATE INDEX IF NOT EXISTS idx_opening_updated_at ON openings(updated_at);

-- HR relationship (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_opening_created_by ON openings(created_by);

-- Composite indexes for common filter combinations
CREATE INDEX idx_opening_dept_status ON openings(department, status);
CREATE INDEX idx_opening_location_status ON openings(location, status);
CREATE INDEX idx_opening_status_created ON openings(status, created_at);
CREATE INDEX idx_opening_created_by_status ON openings(created_by, status);

-- Full-text search index for text fields (MySQL 5.7+)
ALTER TABLE openings ADD FULLTEXT INDEX idx_opening_fulltext (title, department, location, skills);

-- ============================================================================
-- USER INDEXES FOR SEARCH OPTIMIZATION
-- ============================================================================

-- Text search fields (email already indexed)
CREATE INDEX idx_user_name ON users(name);

-- Role filtering (already exists but verifying)
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);

-- Status filtering (if is_active column exists)
-- CREATE INDEX idx_user_is_active ON users(is_active);

-- Full-text search index
ALTER TABLE users ADD FULLTEXT INDEX idx_user_fulltext (name, email);

-- ============================================================================
-- ANALYSIS AND VERIFICATION
-- ============================================================================

-- View all indexes on candidates table
-- SHOW INDEXES FROM candidates;

-- View all indexes on openings table
-- SHOW INDEXES FROM openings;

-- View all indexes on users table
-- SHOW INDEXES FROM users;

-- Analyze tables for query optimization
ANALYZE TABLE candidates;
ANALYZE TABLE openings;
ANALYZE TABLE users;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. FULLTEXT indexes are only supported on InnoDB in MySQL 5.6+
-- 2. Index on string columns with length (255) to optimize memory usage
-- 3. Composite indexes should match your most common WHERE clause combinations
-- 4. Run ANALYZE TABLE periodically to keep statistics up-to-date
-- 5. Monitor slow queries using:
--    SET GLOBAL slow_query_log = 'ON';
--    SET GLOBAL long_query_time = 2;
-- 6. Use EXPLAIN to analyze query performance:
--    EXPLAIN SELECT * FROM candidates WHERE status = 'PENDING' AND location = 'Bangalore';
-- ============================================================================

-- Optional: Drop indexes if needed (uncomment to use)
/*
DROP INDEX idx_candidate_firstname ON candidates;
DROP INDEX idx_candidate_lastname ON candidates;
DROP INDEX idx_candidate_fulltext ON candidates;
DROP INDEX idx_opening_fulltext ON openings;
-- ... add more as needed
*/
