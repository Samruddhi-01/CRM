-- Add missing columns to candidates table
-- Run this script if the columns are not auto-created by Hibernate

USE privateappdb;

-- Add columns (ignore errors if they already exist)
ALTER TABLE candidates ADD COLUMN company VARCHAR(120);
ALTER TABLE candidates ADD COLUMN profile VARCHAR(120);
ALTER TABLE candidates ADD COLUMN degree VARCHAR(80);
ALTER TABLE candidates ADD COLUMN passing_year INT;
ALTER TABLE candidates ADD COLUMN experience VARCHAR(50);
ALTER TABLE candidates ADD COLUMN current_package VARCHAR(50);
ALTER TABLE candidates ADD COLUMN expected_ctc VARCHAR(50);
ALTER TABLE candidates ADD COLUMN gap VARCHAR(50);

-- Verify columns were added
DESCRIBE candidates;
