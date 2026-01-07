# Quick Start Guide - After Error Fixes

## Changes Summary

### ✅ All Critical Errors Fixed

1. **Ambiguous Mapping** - Resolved endpoint conflicts
2. **Repository Queries** - Fixed query validation errors
3. **Missing Imports** - Added required `@Param` annotations

---

## How to Start the Application

### Step 1: Clean and Rebuild
```bash
cd "E:\Startica\Staetica copy\startica-co\server"
mvn clean install -DskipTests
```

### Step 2: Run the Application
```bash
mvn spring-boot:run
```

Or run from IDE:
- Open `PrivateAppApplication.java`
- Click Run

---

## Updated API Endpoints

### For HR Users (Role: HR)

**New Endpoints** - To access ONLY your own candidates:
```
GET    /api/hr/my-candidates
GET    /api/hr/my-candidates?search=john&status=PENDING
PUT    /api/hr/my-candidates/{candidateId}/hr-remark
PUT    /api/hr/my-candidates/{candidateId}/status
```

**Existing Endpoints** - Full candidate management:
```
GET    /api/hr/candidates              (All candidates)
POST   /api/hr/candidates              (Create candidate)
PUT    /api/hr/candidates/{id}         (Update candidate)
DELETE /api/hr/candidates/{id}         (Delete candidate)
PATCH  /api/hr/candidates/{id}/status  (Update status)
```

### For Admin Users (Role: ADMIN)

**HR Performance Analytics**:
```
GET /api/admin/hr-performance/overview
GET /api/admin/hr-performance/{hrId}/candidates
PUT /api/admin/hr-performance/candidates/{candidateId}/admin-remark
PUT /api/admin/hr-performance/candidates/{candidateId}/status
```

**Full Access** to all `/api/hr/*` endpoints too

---

## Testing with Postman

### 1. Login as HR User
```json
POST /api/auth/login
{
  "username": "hr_user",
  "password": "password"
}
```

### 2. Get My Candidates (HR's own)
```
GET /api/hr/my-candidates?page=0&size=10&sortBy=createdAt&sortDir=DESC
Headers: Authorization: Bearer {token}
```

### 3. Get All Candidates (includes others)
```
GET /api/hr/candidates?page=0&size=10
Headers: Authorization: Bearer {token}
```

### 4. Update HR Remark
```json
PUT /api/hr/my-candidates/1/hr-remark
Headers: Authorization: Bearer {token}
{
  "hrRemark": "Excellent candidate, proceeding to next round"
}
```

---

## Database Requirements

Ensure MySQL is running and configured:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/startica_hr
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## Expected Behavior

### On Startup
You should see:
```
Started PrivateAppApplication in X seconds
Tomcat started on port(s): 8080 (http)
```

### No More Errors
- ✅ No ambiguous mapping errors
- ✅ No query validation errors
- ✅ No missing symbol errors
- ✅ All repositories initialized successfully

---

## Frontend Integration

### Update Frontend Calls

If you have a frontend application calling the old HR endpoint, update:

**Old Code**:
```javascript
// HR user getting their candidates
fetch('/api/hr/candidates', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

**New Code**:
```javascript
// HR user getting ONLY their own candidates
fetch('/api/hr/my-candidates', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// OR to get all candidates (if HR needs to see all)
fetch('/api/hr/candidates', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

---

## Verification Steps

1. ✅ Application starts without errors
2. ✅ Can login as HR user
3. ✅ Can access `/api/hr/my-candidates`
4. ✅ Can access `/api/hr/candidates`
5. ✅ Can create/update candidates
6. ✅ Admin can access performance metrics

---

## Troubleshooting

### If you still see errors:

1. **Clean the project**:
   ```bash
   mvn clean
   ```

2. **Rebuild IDE indexes** (IntelliJ):
   - File > Invalidate Caches / Restart
   - Choose "Invalidate and Restart"

3. **Check MySQL connection**:
   ```bash
   mysql -u root -p
   USE startica_hr;
   SHOW TABLES;
   ```

4. **Check application.properties**:
   - Verify database URL
   - Verify credentials
   - Verify port (8080)

---

## Support

If you encounter any issues:

1. Check `ERRORS-FIXED.md` for details on what was changed
2. Check application logs for specific error messages
3. Verify all repository files have `@Param` imports
4. Ensure no duplicate endpoint mappings exist

---

**Last Updated**: November 23, 2025  
**Status**: Ready to run ✅

