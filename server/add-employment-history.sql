-- Add employment_history column to candidates table
-- This stores employment history as JSON array

ALTER TABLE candidates 
ADD COLUMN employment_history TEXT AFTER admin_remark;

-- Add comment for documentation
ALTER TABLE candidates 
MODIFY COLUMN employment_history TEXT 
COMMENT 'JSON array of employment history: [{company, designation, startYear, endYear, duration, isCurrent}]';
