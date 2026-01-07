# 🚀 Advanced Search - Quick Start Testing Guide

## Pre-Testing Checklist

### 1. Restart Backend Server
```powershell
cd "e:\Startica\Startica copy\startica-co\server"
# Kill any existing Java processes on port 8080
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start the backend
java -jar target\private-app-backend-0.0.1-SNAPSHOT.jar
```

### 2. Restart Frontend
```powershell
cd "e:\Startica\Startica copy\startica-co"
# Kill any existing npm processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start the frontend
npm start
```

### 3. Clear Browser Cache
- Press `Ctrl + Shift + R` to hard refresh
- Or clear cache from browser settings

---

## ✅ Testing Scenarios

### Test 1: Basic Search (No Filters)
1. Navigate to **Advanced Search** (sidebar menu)
2. Enter search query: "John" or "Developer"
3. **Expected**: Results appear, no active filters shown
4. **Check**: Filter count badge should show "Filters (0)"

### Test 2: Location Filter
1. Click on **Current Location** dropdown
2. Select "Pune" and "Mumbai"
3. **Expected**: 
   - See only candidates from these locations
   - Active filter chip: "Current Location: pune, mumbai"
   - Filter count: "Filters (1)"
4. Click ❌ on the filter chip
5. **Expected**: Filter removed, all locations shown again

### Test 3: Experience Filter
1. Adjust **Experience** slider to 5-10 years
2. **Expected**:
   - See only candidates with 5-10 years experience
   - Active filter chip: "Experience: 5-10 years"
   - Filter count increases
3. **Test variations**:
   - Min only: 5-30 → Shows 5+ years
   - Max only: 0-10 → Shows 0-10 years
   - Both: 5-15 → Shows 5-15 years

### Test 4: CTC Filters
1. Set **Current CTC** to ₹10-25 LPA
2. **Expected**: 
   - Candidates with current package in range
   - Filter chip: "Current CTC: ₹10-25 LPA"
3. Set **Expected CTC** to ₹15-30 LPA
4. **Expected**:
   - Both filters active
   - Filter count shows both

### Test 5: Skills Filter - ANY Mode
1. Select **Primary Skills**: Java, Python
2. Ensure **Match ANY skill** is selected (default)
3. **Expected**:
   - Candidates with Java OR Python
   - Filter chip: "Primary Skills: java, python"

### Test 6: Skills Filter - ALL Mode
1. Keep **Primary Skills**: Java, Python
2. Select **Match ALL skills** radio button
3. **Expected**:
   - Only candidates with BOTH Java AND Python
   - Fewer results than ANY mode

### Test 7: Education Filters
1. Enter **Qualification**: "B.Tech"
2. Adjust **Passing Year**: 2015-2020
3. **Expected**:
   - Candidates with B.Tech degree
   - Graduated between 2015-2020
   - Two filter chips active

### Test 8: Status Filter
1. Select **Application Status**: Shortlisted, Offered
2. **Expected**:
   - Only candidates with these statuses
   - Filter chip: "Status: shortlisted, offered"

### Test 9: Combination Filters
1. Apply multiple filters:
   - Location: Pune
   - Experience: 5-10 years
   - Skills: Java
   - Status: Shortlisted
2. **Expected**:
   - Results match ALL conditions (AND logic)
   - All 4 filter chips displayed
   - Filter count: "Filters (4)"

### Test 10: Reset Filters
1. Apply 3-4 filters
2. Click **Reset** button in filter sidebar
3. **Expected**:
   - All filters cleared
   - All filter chips removed
   - Filter count: "Filters (0)"
   - All results shown

### Test 11: Clear All Filters (Alternative)
1. Apply 3-4 filters
2. Click **Clear All** in active filters bar
3. **Expected**: Same as Reset button

### Test 12: Sorting
1. Apply some filters
2. Test each sort option:
   - **Relevance** → Default order
   - **Latest Updated** → Newest first
   - **Experience (High to Low)** → Most experienced first
   - **Experience (Low to High)** → Freshers first
   - **Salary (High to Low)** → Highest package first
3. **Expected**: Results reorder correctly

### Test 13: Pagination
1. Apply filters that return 20+ results
2. Test pagination:
   - Click page 2 → See next 20 results
   - Change "Per page" to 50 → See 50 results
   - Click Previous → Back to page 1
3. **Expected**: Pagination works smoothly

### Test 14: View Profile
1. Search for a candidate
2. Click **👁️ View Profile** button on a candidate card
3. **Expected**: Navigate to `/candidates/{id}` page

### Test 15: Download Resume
1. Click **⬇️ Download** button on a candidate card
2. **Expected**: 
   - Resume file downloads (if available)
   - Alert shows "Resume not found" (if unavailable)

---

## 🔍 What to Check in Browser Console

### Successful Search
Look for these logs:
```
🔍 Search Request: { query: "...", activeFilters: 3, page: 1, limit: 20 }
✅ Search Results: { totalCount: 45, resultsCount: 20, executionTime: "123ms" }
```

### Error Cases
```
❌ Search error: Session expired. Please login again.
❌ Search error: Search failed: 500
```

---

## 🔍 What to Check in Backend Console

### Successful Request
```
🔍 Advanced Search - Query: john, Filters: [currentLocations, minExperience, maxExperience]
📊 Database returned: 67 candidates
✅ After filtering: 45 candidates
⏱️  Search completed in 234ms
```

### Filter Application
```
Applying location filter: [pune, mumbai]
Applying experience filter: 5-10 years
Applying skills filter (ANY): [java, python]
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "No candidates found" with valid filters
**Cause**: Backend might not be running or filters too restrictive
**Solution**: 
- Check backend is running on port 8080
- Try removing some filters
- Check backend console for errors

### Issue 2: Filter count always shows (0)
**Cause**: Filters at default values
**Solution**: This is correct! Only non-default values count

### Issue 3: Clicking filter chip doesn't remove it
**Cause**: JavaScript error
**Solution**: Check browser console for errors

### Issue 4: Experience filter not working
**Cause**: Experience stored as string in various formats
**Solution**: Backend parses "5 years", "3-5 years", "10+ years" correctly

### Issue 5: Session expired error
**Cause**: JWT token expired
**Solution**: Login again

---

## ✅ Success Criteria

### All Tests Pass When:
- ✅ Filter count matches actual active filters
- ✅ Removing filter works correctly
- ✅ Reset clears all filters
- ✅ Results match applied filters
- ✅ Pagination works smoothly
- ✅ Sorting changes result order
- ✅ Console logs are clean (no errors)
- ✅ Backend logs show proper execution
- ✅ View Profile navigates correctly
- ✅ Download Resume works (when available)

---

## 📊 Performance Expectations

### Good Performance:
- Search response: < 500ms
- Filter update: < 300ms
- Page change: < 200ms
- Total candidates: Up to 1000 (fast)
- Total candidates: 1000-5000 (acceptable)
- Total candidates: 5000+ (may need optimization)

### If Performance Issues:
1. Check network tab → Should see small payloads
2. Check backend logs → Execution time should be logged
3. Try fewer filters → Should be faster
4. Check database indexes → All key fields should be indexed

---

## 🎯 Key Changes to Verify

### Frontend Behavior:
- ✅ No duplicate Advanced Search in sidebar
- ✅ Filter count excludes defaults
- ✅ Active filter chips show all applied filters
- ✅ Reset/Clear All works perfectly
- ✅ Clean console logs with emojis

### Backend Behavior:
- ✅ All filters actually filter results
- ✅ Experience parsing works with various formats
- ✅ CTC parsing works with "15 LPA" format
- ✅ Skills ANY/ALL mode works correctly
- ✅ Location filter handles multiple selections
- ✅ Passing year range works
- ✅ Status filter handles enum conversion

---

## 📝 Test Report Template

After testing, fill this out:

```
ADVANCED SEARCH TEST REPORT
Date: ___________
Tester: ___________

Basic Functionality:
[ ] Search with query works
[ ] Search without query works
[ ] Filters apply correctly
[ ] Filter removal works
[ ] Reset filters works

Individual Filters:
[ ] Location filter (current)
[ ] Location filter (preferred)
[ ] Experience range
[ ] Current CTC range
[ ] Expected CTC range
[ ] Notice period
[ ] Primary skills (ANY mode)
[ ] Primary skills (ALL mode)
[ ] Secondary skills
[ ] Qualification
[ ] Passing year range
[ ] Application status
[ ] Employment type

Advanced Features:
[ ] Combination of filters
[ ] Sorting options
[ ] Pagination
[ ] View profile
[ ] Download resume

Performance:
Search speed: _____ ms
Filter speed: _____ ms
Issues found: _____

Notes:
_______________________
_______________________
```

---

## 🚀 Ready to Test!

1. ✅ Restart backend and frontend
2. ✅ Clear browser cache
3. ✅ Login to the application
4. ✅ Navigate to Advanced Search
5. ✅ Follow test scenarios above
6. ✅ Check browser and backend consoles
7. ✅ Fill out test report

**Good luck testing! 🎉**
