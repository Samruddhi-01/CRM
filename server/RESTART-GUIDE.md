# Backend Restart Guide

## What Changed?

The following files were updated to support all candidate fields:

### DTO Files Updated:
1. **CreateCandidateRequest.java** - Added fields: company, profile, degree, passingYear, experience, currentPackage, expectedCTC, gap, status
2. **UpdateCandidateRequest.java** - Added same fields as above
3. **CandidateResponse.java** - Added same fields to return data

### Service File Updated:
4. **CandidateService.java** - Updated to save/update/map all new fields

## How to Apply Changes

### Option 1: Using start.bat (Recommended)
```bash
cd server
start.bat
```

### Option 2: Using Maven directly
```bash
cd server
mvnw clean package
java -jar target/privateapp-0.0.1-SNAPSHOT.jar
```

### Option 3: Stop and Restart
1. Press `Ctrl+C` in the terminal running the backend
2. Run `start.bat` again

## What Will Happen

When you restart the backend:

1. ✅ Maven will recompile all Java files
2. ✅ Hibernate will detect the new fields in Candidate.java entity
3. ✅ Database columns will be auto-created (company, profile, degree, etc.)
4. ✅ API endpoints will accept and return all fields
5. ✅ Frontend forms will now save all data properly

## Verify It Works

After restart, test by:
1. Go to "Add Candidate" form
2. Fill in all fields including Company, Profile, Degree, etc.
3. Click Save
4. Check the candidate list - all fields should be visible
5. Edit the candidate - all fields should be loaded

## Database Columns

The following columns will be added to the `candidates` table:
- company (VARCHAR 120)
- profile (VARCHAR 120)
- degree (VARCHAR 80)
- passing_year (INT)
- experience (VARCHAR 50)
- current_package (VARCHAR 50)
- expected_ctc (VARCHAR 50)
- gap (VARCHAR 50)

## Troubleshooting

If fields still don't save:
1. Check backend console for errors
2. Verify database connection in console logs
3. Check if columns were created: `DESCRIBE candidates;` in MySQL
4. Clear browser cache and reload frontend
