# Candidates Page Pagination Fix

## 🐛 Problem
The Candidates page was showing incorrect pagination - displaying only 30 total entries when there were actually 57 candidates in the database.

## 🔍 Root Cause

The issue was caused by **two conflicting page size variables**:

1. **`pageSize`** - From Redux state (`selectCandidatesPageSize`)
   - Used to calculate `totalPages`
   - Value: 30 (hardcoded in Redux initial state)

2. **`itemsPerPage`** - Local component state
   - Used in the actual API call to fetch candidates
   - Value: 10 (user-selected from dropdown)

### The Problem:
```javascript
// OLD CODE (BROKEN)
const pageSize = useSelector(selectCandidatesPageSize);  // = 30
const totalPages = Math.ceil(total / pageSize);          // 57 / 30 = 2 pages ❌

const [itemsPerPage, setItemsPerPage] = useState(10);
dispatch(fetchCandidates({ size: itemsPerPage }));       // Fetching with size=10
```

**Result**: Pagination calculated with pageSize=30, but API fetched with size=10
- Should show 6 pages (57 / 10 = 5.7 → 6 pages)
- Actually showed 2 pages (57 / 30 = 1.9 → 2 pages)

---

## ✅ Solution

**Use `itemsPerPage` consistently** for both calculating total pages AND fetching data.

### Changes Made:

**File**: `src/Component/Candidates.js`

#### 1. Removed Redux `pageSize` selector (Lines 7-16)
```javascript
// REMOVED
const pageSize = useSelector(selectCandidatesPageSize);
```

#### 2. Removed unused import (Lines 7-16)
```javascript
// Before
import {
  selectCandidatesPageSize,  // ❌ REMOVED
  ...
}

// After
import {
  fetchCandidates,
  deleteCandidate,
  updateCandidateStatus,
  selectCandidates,
  selectCandidatesLoading,
  selectCandidatesTotal,
  selectCandidatesPage,
  setPage,
}
```

#### 3. Moved `totalPages` calculation (Lines 43-45)
```javascript
// Before
const totalPages = Math.ceil(total / pageSize);  // ❌ Wrong variable

// After
const [itemsPerPage, setItemsPerPage] = useState(10);
const totalPages = Math.ceil(total / itemsPerPage);  // ✅ Correct
```

---

## 🧪 Testing

### Before Fix:
- 57 candidates in database
- Items per page: 10
- **Pagination showed**: 2 pages ❌
- **Should show**: 6 pages

### After Fix:
- 57 candidates in database
- Items per page: 10
- **Pagination shows**: 6 pages ✅
- **Calculation**: 57 / 10 = 5.7 → ceil(5.7) = 6 pages

### Test Scenarios:

1. **10 items per page**:
   - 57 candidates → 6 pages ✅

2. **25 items per page**:
   - 57 candidates → 3 pages ✅

3. **50 items per page**:
   - 57 candidates → 2 pages ✅

4. **100 items per page**:
   - 57 candidates → 1 page ✅

---

## 📊 Technical Details

### Data Flow (After Fix):

```
User selects items per page
         ↓
setItemsPerPage(value)
         ↓
itemsPerPage state updates
         ↓
┌────────────────────────┬─────────────────────┐
│                        │                     │
│  Calculate totalPages  │  Fetch candidates   │
│  (total / itemsPerPage)│  (size=itemsPerPage)│
│                        │                     │
└────────────────────────┴─────────────────────┘
         ↓                         ↓
    Pagination UI            API Request
    shows correct            fetches correct
    number of pages          number of items
```

### Key Principle:
**Single Source of Truth** - Use `itemsPerPage` for EVERYTHING related to page size.

---

## 🎯 Why This Happened

The Redux `pageSize` was likely:
1. Set to a default value of 30 in the initial state
2. Never updated when user changed items per page
3. Component was using local state (`itemsPerPage`) for API calls
4. But still using Redux state (`pageSize`) for pagination calculation

**Lesson**: When using local component state for a value, use it consistently everywhere, or sync it properly with Redux.

---

## 🔄 Similar Issues in Other Pages?

**Checked other pages**: No similar issues found
- **History.js**: Uses local state consistently ✅
- **Openings.js**: Uses Redux pagination state consistently ✅
- **HRManagement.js**: Uses local state consistently ✅

**Candidates.js** was unique in mixing Redux and local state for the same purpose.

---

## ✅ Verification Checklist

After fix:
- [x] Pagination shows correct number of pages
- [x] Changing items per page updates pagination correctly
- [x] All pages are accessible
- [x] Data loads correctly on each page
- [x] No console errors
- [x] Unused imports removed
- [x] Code is clean and consistent

---

## 📝 Notes

### Why Use Local State Instead of Redux?

Local component state (`itemsPerPage`) is preferred here because:
1. **Component-specific**: Items per page is a UI preference for this component only
2. **Simpler**: No need for Redux actions/reducers for a simple dropdown
3. **Performance**: Doesn't trigger Redux state changes
4. **Isolated**: Changes don't affect other components

### When to Use Redux?

Use Redux for:
- **`currentPage`**: Needs to be preserved when navigating away and back
- **`total`**: Server-provided total count
- **`candidates`**: Actual data fetched from API

---

**Status**: ✅ Fixed
**Date**: December 9, 2025
**File Modified**: `src/Component/Candidates.js`
**Lines Changed**: 7-16, 26-45
**Issue**: Incorrect pagination count (showed 2 pages instead of 6)
**Solution**: Use `itemsPerPage` consistently for both calculation and API calls
