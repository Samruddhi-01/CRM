# Advanced Search Debugging Guide

## ✅ Changes Completed

### Backend Improvements

#### 1. GlobalSearchService.java
- **Added null safety check** for currentUser to prevent NPE
- **Added try-catch block** with error handling and logging
- **Returns error response** instead of throwing exceptions
- **Console logging** to help diagnose issues:
  - Logs exceptions with stack traces
  - Returns error message in response

#### 2. GlobalSearchController.java
- **Added extensive logging** for debugging:
  - Request payload logging
  - Current user information
  - Search parameters (query, filters, sortBy, page, limit)
  - Results count
  - Error details with stack traces
- **Better error handling** returns proper error messages to frontend

#### 3. Backend Status
✅ **Server is running** on port 8080
✅ **Database connected** (MySQL 8.0.43)
✅ **Users initialized**:
   - Admin: admin@startica.com / admin123
   - HR: hr@startica.com / hr123

### Frontend Improvements

#### AdvancedSearchNew.js
**Added comprehensive debugging**:
1. Logs search payload before sending
2. Logs "Attempting to fetch from backend..."
3. Logs response status code
4. Captures and logs error text from response
5. Logs successful backend response data
6. **Shows user-visible alert** on error with details
7. All console messages help identify failure points

## 🔍 How to Debug Search Issues

### Step 1: Open Browser Console
1. Navigate to Advanced Search page
2. Press **F12** to open DevTools
3. Go to **Console** tab

### Step 2: Attempt a Search
1. Enter search criteria or leave empty
2. Click search or wait for auto-search
3. Watch console messages

### Step 3: Interpret Console Messages

#### ✅ If you see ALL these messages:
```
Search payload: {query: "", filters: {...}, sortBy: "relevance", page: 1, limit: 20}
Attempting to fetch from backend...
Response status: 200
Backend response: {results: [...], totalCount: 5, page: 1, totalPages: 1, executionTime: 123}
```
**Result**: ✅ Everything working! Check if results are displayed.

#### ❌ If stops at "Attempting to fetch...":
```
Search payload: {query: "", filters: {...}, ...}
Attempting to fetch from backend...
[Network error]
```
**Problem**: Backend not running or network issue
**Solution**: 
- Check if backend is running (see below)
- Check if port 8080 is accessible

#### ❌ If shows response status 401 or 403:
```
Response status: 401
Backend error: Unauthorized
```
**Problem**: Authentication issue
**Solution**:
- Ensure you're logged in
- Check if JWT token is being sent
- Log in again

#### ❌ If shows response status 500:
```
Response status: 500
Backend error: [error message]
```
**Problem**: Backend error
**Solution**:
- Check backend terminal for error logs
- Look for Java exceptions
- Database might be down

#### ❌ If response has 0 results:
```
Backend response: {results: [], totalCount: 0, page: 1, totalPages: 0}
```
**Problem**: No data or filters too restrictive
**Solution**:
- Check if candidates exist in database
- Try search with no filters
- Verify data was imported

## 🚀 Backend Server Commands

### Check if Backend is Running
```powershell
netstat -ano | findstr :8080
```
Should show `LISTENING` on port 8080.

### Start Backend Server
```powershell
cd "e:\Startica\Startica copy\startica-co\server"
java -jar target\private-app-backend-0.0.1-SNAPSHOT.jar
```

### View Backend Logs
When search is executed, you should see in backend terminal:
```
=== Advanced Search Request Received ===
Request payload: {query=, filters={...}, sortBy=relevance, page=1, limit=20}
Current user: hr@startica.com
Query: 
Filters: {...}
Sort: relevance, Page: 1, Limit: 20
Search completed. Results count: 5
=== End Advanced Search ===
```

## 📊 Working Filters

### ✅ Currently Working:
- **Text Search** (firstName, lastName, email, skills, profile)
- **Location Filter** (currentLocations array)
- **Skills Filter** (skills field pattern matching)
- **Status Filter** (candidate status)

### ❌ Not Working (Known Limitations):
- **Experience Range** - Field is String, not numeric
- **Salary/CTC Range** - Fields are String, not numeric
- **Notice Period** - Field doesn't exist in database
- **Verified Status** - Field doesn't exist in database

## 🔧 Testing Steps

### Test 1: Basic Search (No Filters)
1. Go to Advanced Search page
2. Leave all filters empty
3. Press search
4. **Expected**: See all candidates in database

### Test 2: Text Search
1. Enter a name in search box (e.g., "John")
2. Press search
3. **Expected**: See candidates with "John" in name/email/skills

### Test 3: Location Filter
1. Select a location from dropdown
2. Press search
3. **Expected**: See candidates from that location

### Test 4: Skills Filter
1. Add skill(s) from dropdown
2. Press search
3. **Expected**: See candidates with those skills

## 📝 Backend Console Output Examples

### Successful Search:
```
=== Advanced Search Request Received ===
Request payload: {query=, filters={location=[Mumbai], skills=[Java]}, sortBy=relevance, page=1, limit=20}
Current user: hr@startica.com
Query: 
Filters: {location=[Mumbai], skills=[Java]}
Sort: relevance, Page: 1, Limit: 20
Search completed. Results count: 3
=== End Advanced Search ===
```

### Error Example:
```
=== Advanced Search Error ===
Error: Role-based filter failed
java.lang.NullPointerException: Cannot invoke "User.getRole()" because "currentUser" is null
    at GlobalSearchService.advancedCandidateSearch(...)
```

## 🎯 Quick Checks

1. **Is backend running?** → Check terminal or `netstat -ano | findstr :8080`
2. **Are you logged in?** → Check if user email shows in navbar
3. **Is database connected?** → Backend startup should show MySQL connection
4. **Any candidates in DB?** → Try empty search to see all results
5. **Console errors?** → Check browser F12 Console tab
6. **Backend errors?** → Check backend terminal output

## 📞 Common Issues & Solutions

### Issue: "Search failed: Failed to fetch"
**Cause**: Backend not running or CORS issue
**Solution**: 
1. Start backend server
2. Verify CORS is enabled (it is: `@CrossOrigin(origins = "*")`)

### Issue: Empty results but backend shows count > 0
**Cause**: Frontend not parsing response correctly
**Solution**: Check console for "Backend response" - if data is there, issue is in rendering

### Issue: Search freezes/hangs
**Cause**: Request timeout or backend hung
**Solution**: 
1. Check backend terminal for errors
2. Restart backend
3. Check database connection

### Issue: "User not authenticated"
**Cause**: JWT token expired or not sent
**Solution**: 
1. Log out and log back in
2. Check if token is in localStorage
3. Verify fetch includes credentials

## 🎉 Success Indicators

✅ Backend shows "Application ready!"
✅ Console shows all 4 log messages
✅ Response status is 200
✅ Backend shows "Search completed. Results count: X"
✅ Candidates appear in UI
✅ Can click on candidate cards
✅ Filters update results correctly

## 📚 Additional Resources

- **Backend API**: http://localhost:8080/api/search/candidates
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Payload**:
```json
{
  "query": "",
  "filters": {
    "location": ["Mumbai"],
    "skills": ["Java"],
    "status": ["ACTIVE"]
  },
  "sortBy": "relevance",
  "page": 1,
  "limit": 20
}
```

- **Response**:
```json
{
  "results": [...],
  "totalCount": 10,
  "page": 1,
  "totalPages": 1,
  "executionTime": 145
}
```

---

## 🔥 Ready to Test!

Your search functionality now has:
✅ Backend running on port 8080
✅ Comprehensive error logging
✅ User-friendly error alerts
✅ Detailed console debugging
✅ Backend request/response logging
✅ Error handling and recovery

**Next Step**: Open browser, navigate to Advanced Search, and follow the debugging steps above!
