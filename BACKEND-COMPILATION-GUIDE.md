# How to Apply Education Field Fix

## ⚠️ Important: Backend Compilation Required

The backend Java files have been updated to fix the education field issue. You need to **recompile the backend** for changes to take effect.

---

## Option 1: Install Maven (Recommended)

### Step 1: Install Maven
1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\Apache\maven` (or any location)
3. Add to PATH:
   - Open System Environment Variables
   - Add new entry: `C:\Program Files\Apache\maven\bin`
   - Restart PowerShell/Command Prompt

### Step 2: Verify Installation
```bash
mvn --version
```

Should show Maven version 3.x.x

### Step 3: Compile Backend
```bash
cd "e:\Startica\Startica copy\startica-co\server"
mvn clean package -DskipTests
```

### Step 4: Run Backend
```bash
.\start.bat
```

---

## Option 2: Use IDE (IntelliJ IDEA / Eclipse)

### IntelliJ IDEA:
1. Open the `server` folder as a Maven project
2. Wait for Maven to download dependencies
3. Right-click on `pom.xml` → Maven → Reload Project
4. Click **Build** → **Build Project** (Ctrl+F9)
5. Right-click on main class → **Run**

### Eclipse:
1. Import → Existing Maven Project
2. Select `server` folder
3. Right-click project → Maven → Update Project
4. Right-click → Run As → Maven Build
5. Goals: `clean package`
6. Run the JAR from target folder

---

## Option 3: Manual Compilation (Advanced)

If you have Java JDK installed but no Maven:

```bash
cd "e:\Startica\Startica copy\startica-co\server"

# Compile all Java files (requires all dependencies)
javac -d target/classes -cp "lib/*" src/main/java/com/startica/privateapp/**/*.java

# Run the application
java -cp "target/classes;lib/*" com.startica.privateapp.PrivateAppBackendApplication
```

**Note**: This requires manually downloading all dependencies (Spring Boot, MySQL connector, etc.)

---

## What Was Changed (Backend)

### Files Modified:
1. **CreateCandidateRequest.java** - Added `education`, `experienceLevel`, `noticePeriod` fields
2. **UpdateCandidateRequest.java** - Added same fields
3. **CandidateResponse.java** - Added same fields
4. **CandidateService.java** - Added field mappings in create, update, and response methods

### Changes Enable:
- ✅ Education JSON array saved to database
- ✅ Experience level saved (e.g., "Mid-Level (4-6 years)")
- ✅ Notice period saved (e.g., "1 Month", "Immediate")
- ✅ All fields returned in API responses
- ✅ Multiple education entries supported

---

## Testing After Compilation

### 1. Start Backend
```bash
cd server
.\start.bat
```

Wait for: `Started PrivateAppBackendApplication in X.XXX seconds`

### 2. Start Frontend
Open new terminal:
```bash
cd "e:\Startica\Startica copy\startica-co"
npm start
```

### 3. Test Create Candidate
1. Go to http://localhost:3000
2. Login as HR user
3. Click **Add Candidate**
4. Fill basic details
5. Add multiple education entries:
   - Click **+ Add Another Education**
   - Fill degree, specialization, institution, year, percentage
   - Add 2-3 education entries
6. Select experience level (e.g., "Mid-Level (4-6 years)")
7. Select notice period (e.g., "1 Month")
8. Submit form

### 4. Verify in Browser Console
Check browser console (F12) for:
```
Submitting candidate data: {
  education: "[{\"degree\":\"BCA\",\"specialization\":\"Computer Science\",...}]",
  educationEntries: [...],
  experienceLevel: "Mid-Level (4-6 years)",
  noticePeriod: "1 Month"
}
```

### 5. Verify in Database
Connect to MySQL:
```sql
USE startica_hr_db;

SELECT 
  id, 
  first_name, 
  last_name,
  education,
  experience_level,
  notice_period
FROM candidates 
ORDER BY id DESC 
LIMIT 1;
```

Should show:
- **education**: JSON array like `[{"degree":"BCA","specialization":"Computer Science",...}]`
- **experience_level**: e.g., "Mid-Level (4-6 years)"
- **notice_period**: e.g., "1 Month"

### 6. Test Display
1. Go to **Candidates** page
2. Find the newly created candidate
3. Click **View Profile** (eye icon)
4. Modal should show:
   - All education entries with degree, specialization, institution, year, percentage
   - Experience level
   - Notice period
   - All other details

### 7. Test Edit
1. Click **Edit** on candidate
2. Form should populate with all education entries
3. Modify one entry
4. Add another education entry
5. Submit
6. Verify changes saved and display correctly

---

## Troubleshooting

### Issue: "Maven not found"
**Solution**: Install Maven (Option 1 above) or use IDE (Option 2)

### Issue: Compilation errors
**Possible causes**:
- Outdated dependencies
- Java version mismatch (requires JDK 17+)

**Solution**:
```bash
mvn clean install -U
```

### Issue: Education still not saving
**Check**:
1. Backend recompiled? (Check JAR timestamp in target folder)
2. Backend running latest code? (Restart server)
3. Browser console shows education JSON? (Check debug log)
4. Database columns exist? (Check schema)

### Issue: "Cannot find symbol" errors
**Cause**: IDE not recognizing Lombok annotations
**Solution**: Install Lombok plugin in IDE

### Issue: Database connection error
**Check**:
- MySQL running
- Database credentials correct in `application.properties`
- Database `startica_hr_db` exists

---

## Quick Verification Checklist

Before testing:
- [ ] Backend compiled successfully (no errors)
- [ ] Backend server running on port 8080
- [ ] Frontend running on port 3000
- [ ] MySQL database running
- [ ] Browser console open for debugging

After testing:
- [ ] Education data appears in console log
- [ ] No errors in backend logs
- [ ] Candidate created successfully
- [ ] Education JSON in database
- [ ] All education entries display in modal
- [ ] Edit mode shows all entries correctly

---

## If Maven Installation Fails

You can still test the frontend changes (profile modal display) by:

1. Using existing candidates in database
2. The frontend display improvements will work even without backend compilation
3. New candidates won't save education correctly until backend is recompiled

**However**, to fully fix the issue, backend compilation is **required**.

---

## Next Steps

1. **Install Maven** (15 minutes) - Easiest and recommended
   OR
2. **Use IDE** (30 minutes) - If you already have IntelliJ/Eclipse
   OR
3. **Ask developer** to compile - Provide them the changed files

4. **After compilation**: Follow testing steps above

5. **Verify everything works** before marking as complete

---

## Summary

### What's Fixed:
✅ Backend DTOs now include education, experienceLevel, noticePeriod
✅ Service layer properly maps these fields
✅ API responses include all fields
✅ Frontend form already sends correct data
✅ Frontend display (modal) properly shows multiple education entries
✅ Backward compatibility maintained (old degree field still works)

### What's Needed:
⚠️ **Backend recompilation required** (Maven or IDE)
⚠️ **Server restart required** after compilation
✅ Frontend changes already applied (no compilation needed)

### Expected Result:
- Create candidate → Education JSON saved to database
- View candidate → All education entries displayed
- Edit candidate → All entries loaded in form
- Update candidate → Changes saved correctly

---

**Status**: Code changes complete, **compilation pending**
**Time Required**: 15-30 minutes (Maven install + compile)
**Impact**: Fixes education field saving issue completely
