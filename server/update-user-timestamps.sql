-- Update existing users to have created_at and updated_at timestamps
-- Run this SQL script if users already exist without proper timestamps

-- Update created_at for users that don't have it
UPDATE accounts 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

-- Update updated_at for users that don't have it
UPDATE accounts 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL;

-- Verify the update
SELECT id, username, full_name, created_at, last_login, updated_at 
FROM accounts;
