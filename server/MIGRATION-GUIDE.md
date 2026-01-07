# Database Migration Guide - Education & Experience Level Fields

## Overview
This migration adds support for multiple education entries and additional fields to the candidates table.

## New Fields Added:
1. **education** (TEXT) - Stores multiple education entries as JSON array
2. **experience_level** (VARCHAR 120) - Stores detailed experience level (e.g., "Mid-Level (4-6 years)")
3. **notice_period** (VARCHAR 50) - Stores notice period information

## Steps to Run Migration:

### Method 1: Using MySQL Command Line

1. **Open Command Prompt and navigate to server folder:**
   ```cmd
   cd e:\Startica\Startica copy\startica-co\server
   ```

2. **Connect to MySQL:**
   ```cmd
   mysql -u root -p
   ```
   Enter your password when prompted.

3. **Select your database:**
   ```sql
   USE your_database_name;
   ```

4. **Run the migration script:**
   ```sql
   SOURCE add-education-columns.sql;
   ```

### Method 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. Open the file `add-education-columns.sql`
4. Click "Execute" (lightning bolt icon) or press Ctrl+Shift+Enter

### Method 3: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Select your database
3. Click on "SQL" tab
4. Copy and paste the contents of `add-education-columns.sql`
5. Click "Go"

## Verification:

After running the migration, verify the changes:

```sql
-- Check if columns were added
DESCRIBE candidates;

-- Check a sample record
SELECT 
    id, 
    first_name, 
    last_name, 
    education,
    experience_level,
    notice_period
FROM candidates 
LIMIT 5;
```

## What This Migration Does:

1. **Adds new columns** to candidates table
2. **Migrates existing data** from old `degree` and `passing_year` columns to new `education` JSON format
3. **Copies experience data** to new `experience_level` column
4. **Maintains backward compatibility** by keeping old columns

## Data Format Examples:

### Education JSON Format:
```json
[
  {
    "degree": "BTech",
    "specialization": "Computer Science",
    "institution": "IIT Delhi",
    "passingYear": "2020",
    "percentage": "85%"
  },
  {
    "degree": "MCA",
    "specialization": "Software Engineering",
    "institution": "Delhi University",
    "passingYear": "2022",
    "percentage": "8.5 CGPA"
  }
]
```

## Backend Changes Required:

The `Candidate.java` model has been updated to include:
```java
@Column(name = "education", columnDefinition = "TEXT")
private String education;

@Column(name = "experience_level", length = 120)
private String experienceLevel;

@Column(name = "notice_period", length = 50)
private String noticePeriod;
```

## Rollback (if needed):

If you need to rollback the changes:

```sql
ALTER TABLE candidates 
DROP COLUMN education,
DROP COLUMN experience_level,
DROP COLUMN notice_period;
```

## Important Notes:

- ✅ The migration preserves all existing data
- ✅ Old columns (`degree`, `passing_year`) are kept for backward compatibility
- ✅ New records will use both old and new formats during transition period
- ⚠️ Make sure to backup your database before running any migration
- ⚠️ Test in development environment first

## After Migration:

1. Restart your Spring Boot backend server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Test creating a new candidate with multiple education entries
4. Test editing an existing candidate
5. Verify data is displayed correctly in candidate details popup

## Troubleshooting:

**Issue:** Column already exists
**Solution:** The column was already added, skip this migration

**Issue:** Syntax error near 'TEXT'
**Solution:** Make sure you're using MySQL 5.7+ or MariaDB 10.2+

**Issue:** Data not showing in frontend
**Solution:** 
1. Check browser console for errors
2. Verify backend is returning education field
3. Clear Redux state and refresh

## Support:

If you encounter any issues:
1. Check backend logs in console
2. Check browser console for frontend errors
3. Verify database column exists: `SHOW COLUMNS FROM candidates;`
4. Check data format: `SELECT education FROM candidates WHERE education IS NOT NULL LIMIT 1;`
