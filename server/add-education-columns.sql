-- Add education, experience_level, and notice_period columns to candidates table

-- Add education column to store multiple education entries as JSON
ALTER TABLE candidates 
ADD COLUMN education TEXT AFTER employment_history;

-- Add experience_level column to store detailed experience level
ALTER TABLE candidates 
ADD COLUMN experience_level VARCHAR(120) AFTER education;

-- Add notice_period column
ALTER TABLE candidates 
ADD COLUMN notice_period VARCHAR(50) AFTER experience_level;

-- Update existing records to have education JSON from old degree/passing_year
UPDATE candidates 
SET education = CONCAT(
    '[{"degree":"', COALESCE(degree, ''), 
    '","specialization":"",',
    '"institution":"",',
    '"passingYear":"', COALESCE(passing_year, ''), 
    '","percentage":""}]'
)
WHERE degree IS NOT NULL AND degree != '';

-- Update experience_level from experience field for existing records
UPDATE candidates 
SET experience_level = experience
WHERE experience IS NOT NULL AND experience != '';

COMMIT;

-- Verify the changes
SELECT 
    id, 
    first_name, 
    last_name, 
    degree, 
    passing_year,
    education,
    experience,
    experience_level
FROM candidates 
LIMIT 5;
