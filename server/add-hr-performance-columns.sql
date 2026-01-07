-- ============================================================================
-- HR PERFORMANCE ANALYTICS - DATABASE SCHEMA UPDATES
-- ============================================================================
-- This script adds the necessary columns for HR Performance Analytics Module
-- Run this on your existing database to add the new fields
-- ============================================================================

USE privateappdb;

-- Add HR Remark and Admin Remark columns to candidates table
ALTER TABLE candidates
ADD COLUMN hr_remark TEXT COMMENT 'Remark added by HR who created the candidate',
ADD COLUMN admin_remark TEXT COMMENT 'Remark added by Admin for internal tracking';

-- Create indexes for performance optimization
CREATE INDEX idx_candidates_source_hr ON candidates(source_hr_id);
CREATE INDEX idx_candidates_status_hr ON candidates(status, source_hr_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify columns were added
-- DESCRIBE candidates;

-- Test query for HR performance overview
-- SELECT 
--     u.id as hr_id,
--     u.name as hr_name,
--     u.email as hr_email,
--     COUNT(c.id) as total_candidates,
--     SUM(CASE WHEN c.status = 'HIRED' THEN 1 ELSE 0 END) as hired_count,
--     SUM(CASE WHEN c.status = 'CONTACTED' THEN 1 ELSE 0 END) as contacted_count,
--     MAX(c.updated_at) as last_activity
-- FROM users u
-- LEFT JOIN candidates c ON u.id = c.source_hr_id
-- WHERE u.role = 'HR'
-- GROUP BY u.id, u.name, u.email;

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================
-- ALTER TABLE candidates DROP COLUMN hr_remark;
-- ALTER TABLE candidates DROP COLUMN admin_remark;
-- DROP INDEX idx_candidates_source_hr ON candidates;
-- DROP INDEX idx_candidates_status_hr ON candidates;
-- ============================================================================
