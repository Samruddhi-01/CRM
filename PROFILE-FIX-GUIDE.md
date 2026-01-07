# Fix for Profile Page - Member Since & Last Login

## Changes Made

### Backend Changes

1. **LoginResponse.java** - Added fields to UserInfo:
   - `createdAt` (LocalDateTime)
   - `lastLogin` (LocalDateTime)
   - `phone` (String)

2. **AuthService.java** - Updated to populate new fields:
   - Login method now includes createdAt, lastLogin, and phone
   - RefreshToken method now includes createdAt, lastLogin, and phone

3. **User.java** - Added @JsonIgnore to password field for security

### Database Update Required

If you have existing users in the database without `created_at` timestamps, run this SQL:

```sql
-- Connect to your MySQL database first
USE privateappdb;

-- Update existing users to have created_at and updated_at timestamps
UPDATE accounts 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

UPDATE accounts 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL;

-- Verify the update
SELECT id, username, full_name, created_at, last_login, updated_at 
FROM accounts;
```

## How to Apply the Fix

### Option 1: Restart from IntelliJ IDEA (Recommended)

1. Open IntelliJ IDEA
2. Stop the running application (red stop button)
3. Run the application again (green play button)
4. Wait for the server to start (check console for "Started PrivateAppApplication")

### Option 2: Run Update Database Script

1. Open MySQL Workbench or MySQL command line
2. Connect to your database
3. Run the SQL script: `update-user-timestamps.sql`
4. Restart the backend server

### Step 3: Test the Fix

1. **Logout** from the application (important!)
2. **Login** again with your credentials
3. Go to **Profile** page
4. You should now see:
   - **Member Since**: Shows the month and year (e.g., "November 2025")
   - **Last Login**: Shows the date (e.g., "Nov 21")

## Troubleshooting

### If still showing "N/A":

1. **Check browser console** (F12) - Look for the debug logs:
   ```
   Profile - User data: {...}
   Profile - createdAt: ...
   Profile - lastLogin: ...
   ```

2. **Check if the data is in the response**:
   - Open Browser DevTools (F12)
   - Go to Network tab
   - Login again
   - Check the `/auth/login` response
   - Look for `createdAt` and `lastLogin` in the user object

3. **Clear browser localStorage**:
   - Open Browser Console (F12)
   - Run: `localStorage.clear()`
   - Refresh and login again

4. **Verify database has timestamps**:
   ```sql
   SELECT username, created_at, last_login FROM accounts;
   ```
   - If NULL, run the update script above

### If backend won't start:

Check that Maven is installed or use IntelliJ IDEA to run the application:
1. Right-click on `PrivateAppApplication.java`
2. Select "Run 'PrivateAppApplication'"

## Expected Result

After applying these changes and restarting:
- **Member Since**: Will show "November 2025" (or the actual creation month)
- **Last Login**: Will show "Nov 21" (or the actual last login date)

## Files Modified

Backend:
- `server/src/main/java/com/startica/privateapp/auth/dto/LoginResponse.java`
- `server/src/main/java/com/startica/privateapp/auth/service/AuthService.java`
- `server/src/main/java/com/startica/privateapp/model/User.java`

Frontend:
- `src/Component/Profile.js` (added debug logging)

Database:
- `server/update-user-timestamps.sql` (new migration script)
