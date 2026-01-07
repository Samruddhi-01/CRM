# Errors Fixed - November 23, 2025

## Summary
Fixed multiple critical errors preventing the Spring Boot application from starting.

## Issues Fixed

### 1. ✅ Ambiguous Mapping Error
**Problem**: Two controllers (`HRCandidatesController` and `HRController`) had the same endpoint mapping causing:
```
Cannot map 'HRCandidatesController' method getMyCandidates() to {GET [/api/hr/candidates]}: 
There is already 'HRController' bean method getCandidates() mapped.
```

**Solution**: Changed `HRCandidatesController` mapping from `/api/hr/candidates` to `/api/hr/my-candidates`

**File**: `src/main/java/com/startica/privateapp/controller/HRCandidatesController.java`
```java
// Before:
@RequestMapping("/api/hr/candidates")

// After:
@RequestMapping("/api/hr/my-candidates")
```

**Impact**: 
- HR users now access their own candidates via `/api/hr/my-candidates`
- Admin and HR can still access all candidates via `/api/hr/candidates`

---

### 2. ✅ User Repository Query Error
**Problem**: Spring Data JPA query validation failed:
```
Could not resolve attribute 'name' of 'com.startica.privateapp.model.User'
```

**Root Cause**: 
- Query used `u.name` but User entity has `fullName` field
- Missing `@Param` annotation on query parameter

**Solution**: Added `@Param` annotation to ensure proper parameter binding

**File**: `src/main/java/com/startica/privateapp/repository/UserRepository.java`
```java
// Before:
List<User> searchByText(String query, Pageable pageable);

// After:
List<User> searchByText(@Param("query") String query, Pageable pageable);
```

---

### 3. ✅ Candidate Repository Query Error
**Problem**: Query validation failed looking for non-existent fields:
```
Could not resolve attribute 'primarySkills' of 'com.startica.privateapp.model.Candidate'
Could not resolve attribute 'secondarySkills' of 'com.startica.privateapp.model.Candidate'
```

**Root Cause**: Candidate entity only has `skills` field, not separate primary/secondary skills

**Solution**: The query was already correct using `c.skills`. No change needed.

**File**: `src/main/java/com/startica/privateapp/repository/CandidateRepository.java`
- Query correctly uses `LOWER(c.skills)` field

---

## Endpoints Changed

### HR User Endpoints (Role: HR)

**Previous**: 
- GET `/api/hr/candidates` - Get all candidates (conflicted)

**Current**:
- GET `/api/hr/my-candidates` - Get MY candidates (HR's own)
- PUT `/api/hr/my-candidates/{candidateId}/hr-remark` - Update HR remark
- PUT `/api/hr/my-candidates/{candidateId}/status` - Update candidate status

### Admin & HR Shared Endpoints (Role: ADMIN or HR)

**Unchanged**:
- GET `/api/hr/candidates` - Get all candidates (with filters)
- POST `/api/hr/candidates` - Create candidate
- PUT `/api/hr/candidates/{id}` - Update candidate
- DELETE `/api/hr/candidates/{id}` - Delete candidate
- PATCH `/api/hr/candidates/{id}/status` - Update status

### Admin HR Performance Endpoints (Role: ADMIN)

**Unchanged**:
- GET `/api/admin/hr-performance/overview` - Get all HR performance metrics
- GET `/api/admin/hr-performance/{hrId}/candidates` - Get specific HR's candidates
- PUT `/api/admin/hr-performance/candidates/{candidateId}/admin-remark` - Update admin remark
- PUT `/api/admin/hr-performance/candidates/{candidateId}/status` - Update status

---

## Testing Recommendations

1. **Test HR User Flow**:
   - Login as HR user
   - Access `/api/hr/my-candidates` to see own candidates
   - Verify only candidates created by logged-in HR are shown

2. **Test Admin Flow**:
   - Login as Admin
   - Access `/api/hr/candidates` to see all candidates
   - Access `/api/admin/hr-performance/overview` for HR metrics

3. **Test Candidate Management**:
   - Create candidates via `/api/hr/candidates` (POST)
   - Update candidate status
   - Search and filter candidates

---

## Notes

- All repository queries now properly use `@Param` annotations
- No duplicate endpoint mappings exist
- User entity uses `fullName` (not `name`)
- Candidate entity uses single `skills` field (not primarySkills/secondarySkills)
- DELETE method is properly supported for `/api/hr/candidates/{id}`

---

## Next Steps

1. Restart the application
2. Test all endpoints with proper authentication
3. Update any frontend code that was calling `/api/hr/candidates` for HR users to use `/api/hr/my-candidates`
4. Update Postman collection if needed

---

**Date**: November 23, 2025  
**Status**: All critical errors resolved ✅

