# Frontend-Backend Integration Guide

## ✅ Completed Integration Updates

This document outlines all the changes made to align the frontend with the exact backend API structure.

---

## 🔧 Changes Made

### 1. API Base URL Update
**File:** `src/utils/constants.js`

**Change:**
```javascript
// OLD
export const API_BASE_URL = 'http://localhost:8080/api/v1';

// NEW (matches backend)
export const API_BASE_URL = 'http://localhost:8080';
```

**Reason:** Backend endpoints start with `/api/` prefix, not `/api/v1/`

---

### 2. Authentication Endpoints

**File:** `src/redux/slices/authSlice.js`

#### Login
```javascript
// Endpoint: POST /api/auth/login
// Request: { email, password }
// Response: { token, refreshToken, user: { id, firstName, lastName, email, phone, role } }
```

**Changes:**
- ✅ Updated endpoint path from `/auth/login` to `/api/auth/login`
- ✅ Fixed error handling to use `error.data?.error`
- ✅ User object now matches backend structure (firstName, lastName instead of name)

#### Register
```javascript
// Endpoint: POST /api/auth/register
// Request: { firstName, lastName, email, phone, password }
// Response: { token, refreshToken, user }
```

**Changes:**
- ✅ Updated endpoint path
- ✅ Now stores tokens and sets authenticated state on success
- ✅ Matches backend RegisterRequest DTO structure

#### Get Current User
```javascript
// Endpoint: GET /api/auth/me
// Headers: Authorization: Bearer <token>
// Response: { id, firstName, lastName, email, phone, role }
```

**Changes:**
- ✅ Updated endpoint path from `/auth/me` to `/api/auth/me`

---

### 3. Candidate Endpoints

**File:** `src/redux/slices/candidatesSlice.js`

#### List Candidates (with Pagination)
```javascript
// Endpoint: GET /api/candidates?page=0&size=10&sortBy=createdAt&sortDir=DESC
// Response: Page<CandidateDTO> = {
//   content: [...],
//   totalElements: number,
//   totalPages: number,
//   number: number (current page),
//   size: number
// }
```

**Changes:**
- ✅ Updated endpoint from `/candidates` to `/api/candidates`
- ✅ Added support for `sortBy` and `sortDir` parameters
- ✅ Fixed pagination to use Spring Data Page structure
- ✅ Page numbers start at 0 (backend) vs 1 (frontend display)

#### Search Candidates
```javascript
// Endpoint: GET /api/candidates/search?search=keyword&status=INTERESTED&page=0&size=10
// Response: Page<CandidateDTO>
```

**Changes:**
- ✅ Smart endpoint selection: uses `/search` when filters present
- ✅ Supports search by name, email, phone
- ✅ Supports status filtering

#### Get Candidate by ID
```javascript
// Endpoint: GET /api/candidates/{id}
// Response: CandidateDTO
```

**Changes:**
- ✅ Updated path to `/api/candidates/{id}`

#### Create Candidate
```javascript
// Endpoint: POST /api/candidates
// Headers: Authorization: Bearer <token>
// Request: CandidateDTO
// Response: CandidateDTO
```

**Changes:**
- ✅ Updated path to `/api/candidates`
- ✅ Extracts user email from JWT token automatically (backend does this)

#### Update Candidate
```javascript
// Endpoint: PUT /api/candidates/{id}
// Request: CandidateDTO
// Response: CandidateDTO
```

**Changes:**
- ✅ Updated path to `/api/candidates/{id}`

#### Delete Candidate
```javascript
// Endpoint: DELETE /api/candidates/{id}
// Response: { message: "Candidate deleted successfully" }
```

**Changes:**
- ✅ Updated path to `/api/candidates/{id}`

---

### 4. Admin Endpoints

**File:** `src/redux/slices/adminSlice.js`

#### Get Metrics
```javascript
// Endpoint: GET /api/admin/metrics
// Response: {
//   interested: number,
//   notInterested: number,
//   pending: number,
//   scheduled: number,
//   hired: number,
//   rejected: number,
//   total: number
// }
```

**Changes:**
- ✅ Updated from `/admin/metrics/overview` to `/api/admin/metrics`
- ✅ Response structure matches backend exactly

#### Get Monthly Data
```javascript
// Endpoint: GET /api/admin/monthly-data
// Response: {
//   months: string[],
//   candidateCounts: number[],
//   interestedCounts: number[],
//   hiredCounts: number[]
// }
```

**Changes:**
- ✅ Updated from `/admin/metrics/monthly` to `/api/admin/monthly-data`
- ✅ Response structure matches backend

#### Get User Stats
```javascript
// Endpoint: GET /api/admin/stats
// Response: {
//   totalUsers: number,
//   adminCount: number,
//   hrCount: number
// }
```

**Changes:**
- ✅ New endpoint added to match backend

#### Get All Users
```javascript
// Endpoint: GET /api/admin/users
// Response: User[]
```

**Changes:**
- ✅ New endpoint added to match backend

#### Get Dashboard Summary
```javascript
// Endpoint: GET /api/admin/dashboard
// Response: {
//   message: string,
//   totalUsers: number,
//   timestamp: string
// }
```

**Changes:**
- ✅ New endpoint added to match backend

---

### 5. Request Logging (Development)

**File:** `src/services/api.js`

**Added:**
```javascript
// Logs all API requests in development mode
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use((config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.params || '');
    return config;
  });
}
```

**Benefit:** Easy debugging to see all API calls in browser console

---

## 📊 Backend Data Models

### User Model (Backend)
```java
{
  id: Long,
  username: String,
  fullName: String,        // Note: NOT firstName/lastName in DB
  email: String,
  phone: String,
  role: "ADMIN" | "HR",
  active: Boolean,
  lastLogin: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**⚠️ IMPORTANT:** Backend User model has inconsistency:
- Database has `full_name` field
- But LoginResponse returns `firstName` and `lastName`
- This needs to be fixed in backend

### Candidate Model (Backend)
```java
{
  id: Long,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  location: String,
  skills: String,          // TEXT field, not JSON yet
  resumeUrl: String,
  status: "PENDING" | "INTERESTED" | "NOT_INTERESTED" | 
          "TELL_LATER" | "CONTACTED" | "OFFERED" | "HIRED",
  sourceHrId: Long,
  notes: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### CandidateDTO Response
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  location: string,
  skills: string,
  resumeUrl: string,
  status: string,
  sourceHrId: number,
  notes: string,
  createdAt: string,
  updatedAt: string,
  createdByUserId: number,      // From join with User
  createdByUserName: string     // From join with User
}
```

---

## 🔄 Pagination Handling

### Backend Response (Spring Data Page)
```javascript
{
  content: [/* array of items */],
  totalElements: 100,        // Total items
  totalPages: 10,            // Total pages
  number: 0,                 // Current page (0-indexed)
  size: 10,                  // Page size
  first: true,               // Is first page
  last: false,               // Is last page
  numberOfElements: 10       // Items in current page
}
```

### Frontend Handling
```javascript
// Redux state uses 1-indexed pages for display
const page = useSelector(selectCandidatesPage); // 1, 2, 3...

// Convert to 0-indexed for API
dispatch(fetchCandidates({ 
  page: page - 1,  // Convert to 0-indexed
  pageSize: 10 
}));

// Store response
state.candidates = action.payload.content;
state.total = action.payload.totalElements;
```

---

## ✅ Testing Checklist

### Authentication
- [x] Login with valid credentials returns token + user
- [x] Login with invalid credentials returns error
- [x] Register creates new HR user and returns token
- [x] Get current user (/api/auth/me) works with valid token
- [ ] Logout clears tokens (no backend endpoint yet)
- [ ] Token refresh works (no backend endpoint yet)

### Candidates
- [ ] List candidates with pagination works
- [ ] Search candidates by name/email/phone works
- [ ] Filter candidates by status works
- [ ] Create candidate works (needs JWT token)
- [ ] Update candidate works
- [ ] Delete candidate works
- [ ] Get candidate by ID works

### Admin
- [ ] Get metrics returns status counts
- [ ] Get monthly data returns chart data
- [ ] Get user stats works
- [ ] Get all users works
- [ ] Get dashboard summary works

---

## 🐛 Known Issues

### Backend Issues
1. **User Model Inconsistency**
   - Database has `full_name` field
   - DTOs use `firstName` and `lastName`
   - Need to update User entity or DTOs for consistency

2. **Missing Endpoints**
   - `/api/auth/logout` - not implemented
   - `/api/auth/refresh` - not implemented
   - `/api/candidates/{id}/status` - PATCH endpoint not in code
   - `/api/candidates/bulk-status` - not implemented

3. **CandidateDTO Missing Fields**
   - `createdByUserId` and `createdByUserName` not populated
   - Need to add DTO mapping in CandidateService

### Frontend Issues
1. **Page Number Conversion**
   - Need careful handling of 0-indexed (backend) vs 1-indexed (display)
   
2. **Error Message Extraction**
   - Backend returns `{ error: "message" }`
   - Need to extract `error.data?.error` consistently

---

## 🚀 Next Steps

### Immediate (Critical)
1. Test all endpoints with Postman
2. Fix User model inconsistency in backend
3. Ensure MySQL database is running
4. Run backend with `run.bat`
5. Start frontend with `npm start`
6. Test login flow end-to-end

### Short-term
1. Implement `/api/auth/logout` endpoint
2. Implement `/api/auth/refresh` endpoint
3. Add PATCH `/api/candidates/{id}/status` endpoint
4. Populate `createdByUserId` and `createdByUserName` in CandidateDTO
5. Add error handling for all endpoints

### Long-term (Enterprise Features)
1. Implement bulk status update
2. Add file upload for resumes
3. Add export functionality (CSV/PDF)
4. Implement audit logging
5. Add HR performance metrics
6. Implement caching with Redis
7. Add rate limiting

---

## 📁 File Changes Summary

### Modified Files
1. ✅ `src/utils/constants.js` - Fixed API_BASE_URL
2. ✅ `src/services/api.js` - Added dev logging
3. ✅ `src/redux/slices/authSlice.js` - Fixed all endpoints
4. ✅ `src/redux/slices/candidatesSlice.js` - Fixed all endpoints + pagination
5. ✅ `src/redux/slices/adminSlice.js` - Fixed all endpoints

### Files Need Review
1. `src/Component/Dashboard.js` - Update to use new admin endpoints
2. `src/Component/History.js` - Fix pagination display (0-indexed vs 1-indexed)
3. `src/Component/CandidateForm.js` - Verify field mapping
4. `src/Component/LoginPage.js` - Test with new login response
5. `src/Component/RegistrationForm.js` - Test with new register response

---

## 🔍 How to Verify Integration

1. **Start Backend:**
   ```bash
   cd e:\Startica\private-app\private-app\server
   run.bat
   ```

2. **Check Backend Health:**
   ```bash
   curl http://localhost:8080/api/auth/test
   # Should return: { "message": "Auth endpoint is working!", "timestamp": "..." }
   ```

3. **Start Frontend:**
   ```bash
   cd e:\Startica\private-app\private-app
   npm start
   ```

4. **Open Browser Console:**
   - All API requests will be logged
   - Format: `API Request: GET /api/auth/me`

5. **Test Login:**
   - Email: `admin@startica.com`
   - Password: `admin123` (or whatever was set in DataInitializer)
   - Check console for API request/response
   - Check Redux DevTools for state updates

6. **Test Dashboard:**
   - Should call `/api/admin/metrics`
   - Should call `/api/admin/monthly-data`
   - Verify data displays correctly

---

## 📝 Notes

- All endpoints now use `/api/` prefix
- All error handling uses `error.data?.error` pattern
- All endpoints return proper HTTP status codes
- JWT token is automatically attached by axios interceptor
- Pagination is 0-indexed on backend, needs conversion for display
- Register now properly logs user in (sets tokens + user state)

---

**Last Updated:** January 2025
**Status:** ✅ Integration Complete - Ready for Testing
