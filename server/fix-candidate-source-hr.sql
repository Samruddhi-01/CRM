-- Fix candidates with NULL source_hr_id
-- This script updates candidates that don't have a source HR assigned

-- Step 1: Find the first HR user in the system
SET @first_hr_id = (
    SELECT id 
    FROM users 
    WHERE role = 'HR' 
    ORDER BY created_at ASC 
    LIMIT 1
);

-- Step 2: Check if we found an HR user
SELECT 
    CASE 
        WHEN @first_hr_id IS NOT NULL THEN CONCAT('Found HR user with ID: ', @first_hr_id)
        ELSE 'WARNING: No HR users found in the system'
    END AS status;

-- Step 3: Show candidates that need fixing
SELECT 
    COUNT(*) as candidates_without_hr,
    GROUP_CONCAT(id) as candidate_ids
FROM candidates 
WHERE source_hr_id IS NULL;

-- Step 4: Update candidates without source_hr_id
-- Only if we have an HR user to assign to
UPDATE candidates 
SET source_hr_id = @first_hr_id,
    updated_at = CURRENT_TIMESTAMP
WHERE source_hr_id IS NULL 
AND @first_hr_id IS NOT NULL;

-- Step 5: Show results
SELECT 
    CONCAT('Updated ', ROW_COUNT(), ' candidates') as result;

-- Step 6: Verify the fix
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    c.source_hr_id,
    u.full_name as hr_name,
    c.status
FROM candidates c
LEFT JOIN users u ON c.source_hr_id = u.id
WHERE c.source_hr_id IS NOT NULL
ORDER BY c.created_at DESC
LIMIT 10;
