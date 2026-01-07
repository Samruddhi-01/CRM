# Pagination Fix - Advanced Search

## Issues Fixed

### Frontend (AdvancedSearchNew.js)
1. **State Management**: Added `totalPages` state to store backend response value
2. **Response Handling**: Now properly stores `totalPages` from backend instead of just logging it
3. **Calculation**: Removed local `totalPages` calculation, now uses backend value directly
4. **Debugging**: Added comprehensive console logging to track:
   - Page state changes
   - Button click events (Previous, Next, page numbers)
   - Search request parameters (including types)
   - Pagination state display

### Backend (GlobalSearchService.java & GlobalSearchController.java)
1. **Logging**: Added detailed pagination logging:
   - Request parameters (page, limit)
   - Skip count calculation
   - Total pages calculation
   - Results summary
2. **Verification**: Confirmed pagination logic is correct (1-based indexing)

## Changes Made

### Frontend Changes
**File**: `src/Component/AdvancedSearchNew.js`

1. Added new state:
```javascript
const [totalPages, setTotalPages] = useState(1);
```

2. Updated response handler:
```javascript
setTotalPages(data.totalPages || 1);
```

3. Added page change tracking:
```javascript
useEffect(() => {
  console.log('📄 Page state changed to:', page);
}, [page]);
```

4. Added click event logging for all pagination buttons

### Backend Changes
**File**: `server/src/main/java/com/startica/privateapp/search/service/GlobalSearchService.java`

```java
System.out.println("📄 Pagination: Requested page=" + page + ", limit=" + limit + ", skipCount=" + skipCount + ", totalFiltered=" + totalFiltered);
```

**File**: `server/src/main/java/com/startica/privateapp/search/controller/GlobalSearchController.java`

```java
System.out.println("📥 Search Request:");
System.out.println("   📄 Page: " + page + ", Limit: " + limit);
```

## How to Test

### 1. Start Backend
```powershell
cd server
.\run.bat
```

### 2. Start Frontend
```powershell
npm start
```

### 3. Test Pagination
1. Navigate to Advanced Search (`/advanced-search`)
2. Perform a search with filters that return multiple pages of results
3. **Open Browser Console** (F12) to see detailed logs
4. Test pagination controls:
   - Click "Next ›" button
   - Click "Previous ‹" button
   - Click page numbers (1, 2, 3...)
   - Click "First" (««) and "Last" (»») buttons

### 4. Check Console Logs

**Frontend logs to watch for:**
```
📄 Page state changed to: 2
➡️ Next button clicked. Current page: 1 Total pages: 5
➡️ Setting page to: 2
🔄 Dependencies changed - page: 2 itemsPerPage: 10
🔍 Search Request: { page: 2, limit: 10, pageType: 'number', limitType: 'number' }
✅ Search Results: { page: 2, totalPages: 5, totalCount: 45, resultsCount: 10 }
🔢 Pagination State: { currentPage: 2, totalPages: 5, totalResults: 45 }
```

**Backend logs to watch for:**
```
📥 Search Request:
   📄 Page: 2, Limit: 10
📄 Pagination: Requested page=2, limit=10, skipCount=10, totalFiltered=45
✅ Results: Showing 10 candidates on page 2 of 5 total pages
```

## Expected Behavior

### ✅ Correct Behavior:
1. **First Page**: Shows items 1-10 of total results
2. **Next Button**: Increments page, fetches next set of results
3. **Page Numbers**: Clicking "2" shows items 11-20
4. **Previous Button**: Decrements page, shows previous results
5. **Button States**:
   - Previous/First disabled on page 1
   - Next/Last disabled on last page
   - Current page number highlighted

### ❌ Previous Issues:
- Next button not working
- Page numbers not triggering new searches
- totalPages calculated incorrectly
- No feedback on pagination state

## Technical Details

### Pagination Flow:
1. User clicks Next button
2. `setPage()` updates page state
3. `useEffect` detects page change
4. Debounced search triggers after 300ms
5. Backend receives request with new page number
6. Backend calculates: `skipCount = (page - 1) * limit`
7. Backend returns paginated results with totalPages
8. Frontend updates candidates and totalPages state
9. UI re-renders with new data and pagination controls

### Key Formula:
```
skipCount = (page - 1) * limit
totalPages = Math.ceil(totalCount / limit)
showing = skip+1 to min(skip+limit, totalCount)
```

Example: page=2, limit=10, total=45
- skip = (2-1) * 10 = 10
- show items 11-20
- totalPages = ceil(45/10) = 5

## Troubleshooting

### If pagination still not working:

1. **Check Console for Errors**: Look for JavaScript or network errors
2. **Verify Backend is Running**: Check `http://localhost:8080/api/search/candidates`
3. **Check Authentication**: Ensure valid token in localStorage
4. **Verify Data**: Make sure search returns enough results for multiple pages
5. **Clear Cache**: Hard refresh browser (Ctrl+F5)
6. **Check Network Tab**: Verify API calls are being made with correct page parameter

### Common Issues:

**Issue**: Buttons disabled when they shouldn't be
**Fix**: Check `totalPages` state is correctly set from backend

**Issue**: Same data on all pages
**Fix**: Verify backend is receiving different page numbers

**Issue**: Page resets to 1 when clicking Next
**Fix**: Check if any filter changes are resetting page state

## API Endpoint

```
POST http://localhost:8080/api/search/candidates

Request Body:
{
  "query": "java developer",
  "filters": { ... },
  "sortBy": "relevance",
  "page": 2,
  "limit": 10
}

Response:
{
  "results": [...],
  "totalCount": 45,
  "page": 2,
  "totalPages": 5,
  "executionTime": 125
}
```

## Files Modified

### Frontend:
- `src/Component/AdvancedSearchNew.js`

### Backend:
- `server/src/main/java/com/startica/privateapp/search/service/GlobalSearchService.java`
- `server/src/main/java/com/startica/privateapp/search/controller/GlobalSearchController.java`

---

**Status**: ✅ FIXED - Comprehensive logging added to track issue
**Date**: December 6, 2025
**Testing Required**: Yes - Verify pagination works in all scenarios
