# QUICK FIX GUIDE - Multiple Education Entries

## Problem
Only one education entry is showing when multiple are added.

## Root Cause
The database was missing the `education` column to store multiple entries as JSON.

## Solution Steps

### Step 1: Run Database Migration ⚡

**Option A - Easy Way (Windows):**
```cmd
cd e:\Startica\Startica copy\startica-co\server
run-migration.bat
```
Follow the prompts and enter your database details.

**Option B - Manual Way:**
```cmd
cd e:\Startica\Startica copy\startica-co\server
mysql -u root -p your_database_name < add-education-columns.sql
```

### Step 2: Restart Backend 🔄
```cmd
cd e:\Startica\Startica copy\startica-co\server
mvn clean install
mvn spring-boot:run
```

OR if already running, just restart the server (Ctrl+C then run again)

### Step 3: Clear Frontend Cache 🗑️
In your browser:
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"

OR just do a hard refresh:
- Press `Ctrl + F5`

### Step 4: Test 🧪

1. **Add New Candidate:**
   - Go to "Add Candidate" form
   - Fill in basic details
   - Add multiple education entries using "+ Add Another Education" button
   - Save

2. **View Details:**
   - Go to Candidates page
   - Click "Full Details" on the candidate you just created
   - Verify all education entries are displayed

3. **Edit Candidate:**
   - Click "Edit" on any candidate
   - Verify all education entries load correctly
   - Add/remove entries
   - Save and verify

## What Changed

### Backend Changes:
✅ Added `education` column (TEXT) to store JSON array
✅ Added `experience_level` column (VARCHAR 120)
✅ Added `notice_period` column (VARCHAR 50)
✅ Updated `Candidate.java` model

### Frontend Changes:
✅ Added debugging logs in form submission
✅ Added education parsing in edit mode
✅ Added console logs in details popup
✅ Fixed education state initialization

### Database Changes:
✅ New columns added via migration script
✅ Existing data migrated from old format
✅ Backward compatibility maintained

## Debugging

If still not working, check:

### Backend Console:
```
Look for: "Submission data:" log
Should show: education: "[{...},{...}]"
```

### Browser Console (F12):
```
Look for:
- "Education entries before serialization:"
- "Filtered education entries:"
- "Education value to be saved:"
- "Education data:"
- "Parsed education:"
- "Final education entries:"
```

### Database Check:
```sql
SELECT id, first_name, education FROM candidates ORDER BY id DESC LIMIT 1;
```
Should show JSON array with multiple entries.

## Common Issues

### Issue 1: Backend not returning education field
**Fix:** Make sure backend server is restarted after adding columns

### Issue 2: Frontend showing only first entry
**Fix:** Check if education field is being sent in API response

### Issue 3: Data not saving
**Fix:** 
1. Check browser console for errors
2. Check if education column exists in database
3. Verify JSON format is correct

## Verify Success ✅

Multiple education entries should:
- ✅ Display in add/edit form
- ✅ Save to database as JSON array
- ✅ Load correctly when editing
- ✅ Show all entries in details popup
- ✅ Include all fields (degree, specialization, institution, passing year, percentage)

## Need Help?

Check the following files:
1. `MIGRATION-GUIDE.md` - Detailed migration instructions
2. `add-education-columns.sql` - The SQL script itself
3. Backend logs - For API errors
4. Browser console - For frontend errors
