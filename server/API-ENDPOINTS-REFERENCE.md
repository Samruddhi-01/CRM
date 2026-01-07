# API Endpoints Reference

## 🔴 Common Error: Missing /api Prefix

**❌ WRONG**: `/hr/metrics`  
**✅ CORRECT**: `/api/hr/metrics`

All API endpoints in this application are prefixed with `/api`.

---

## HR Endpoints (Role: HR or ADMIN)

### Base URL: `/api/hr`

#### Dashboard & Metrics
```
GET /api/hr/metrics
```
- Returns HR dashboard metrics for the logged-in HR user
- Requires: JWT token (HR or ADMIN role)

#### Candidate Management
```
GET    /api/hr/candidates
POST   /api/hr/candidates
GET    /api/hr/candidates/{id}
PUT    /api/hr/candidates/{id}
DELETE /api/hr/candidates/{id}
PATCH  /api/hr/candidates/{id}/status
```

#### Bulk Operations
```
POST /api/hr/candidates/bulk-status
POST /api/hr/candidates/bulk-delete
```

#### History & Audit
```
GET /api/hr/candidates/{id}/history
```

---

## HR Personal Candidates (Role: HR only)

### Base URL: `/api/hr/my-candidates`

**New endpoints for HR users to manage ONLY their own candidates:**

```
GET /api/hr/my-candidates
PUT /api/hr/my-candidates/{candidateId}/hr-remark
PUT /api/hr/my-candidates/{candidateId}/status
```

---

## Admin Endpoints (Role: ADMIN only)

### Admin Dashboard Metrics
```
GET /api/admin/metrics/overview
GET /api/admin/metrics/monthly?months=6
GET /api/admin/metrics/hr-performance
```

### HR Performance Analytics
```
GET /api/admin/hr-performance/overview
GET /api/admin/hr-performance/{hrId}/candidates
PUT /api/admin/hr-performance/candidates/{candidateId}/admin-remark
PUT /api/admin/hr-performance/candidates/{candidateId}/status
```

### User Management
```
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
```

---

## Authentication Endpoints (Public)

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

---

## Opening (Job) Management

### Base URL: `/api/openings`

```
GET    /api/openings
POST   /api/openings
GET    /api/openings/{id}
PUT    /api/openings/{id}
DELETE /api/openings/{id}
```

### Candidate-Opening Association
```
POST   /api/openings/{openingId}/candidates/{candidateId}
DELETE /api/openings/{openingId}/candidates/{candidateId}
GET    /api/openings/{openingId}/candidates
```

---

## Example Requests

### 1. Login (Get JWT Token)
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "hr_user",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": 1,
      "username": "hr_user",
      "role": "HR"
    }
  }
}
```

### 2. Get HR Metrics (Correct URL)
```bash
GET http://localhost:8080/api/hr/metrics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCandidates": 150,
    "pendingCandidates": 25,
    "interestedCandidates": 45,
    "hiredCandidates": 30,
    "monthlyStats": [...]
  }
}
```

### 3. Get My Candidates (HR's Own)
```bash
GET http://localhost:8080/api/hr/my-candidates?page=0&size=10
Authorization: Bearer <token>
```

### 4. Get All Candidates
```bash
GET http://localhost:8080/api/hr/candidates?search=john&status=PENDING&page=0&size=10
Authorization: Bearer <token>
```

---

## Common Issues & Solutions

### ❌ Error: "No static resource hr/metrics"
**Problem**: Missing `/api` prefix  
**Solution**: Use `/api/hr/metrics` instead of `/hr/metrics`

### ❌ Error: 401 Unauthorized
**Problem**: Missing or invalid JWT token  
**Solution**: 
1. Login first to get token
2. Add header: `Authorization: Bearer <token>`

### ❌ Error: 403 Forbidden
**Problem**: Insufficient permissions  
**Solution**: Check if endpoint requires ADMIN role but you're logged in as HR

### ❌ Error: 404 Not Found
**Problem**: Wrong endpoint URL  
**Solution**: Check this reference document for correct URLs

---

## URL Format

**Always use this format:**
```
http://localhost:8080/api/{resource}/{action}
```

**Examples:**
- ✅ `http://localhost:8080/api/hr/metrics`
- ✅ `http://localhost:8080/api/hr/candidates`
- ✅ `http://localhost:8080/api/admin/users`
- ✅ `http://localhost:8080/api/auth/login`

**NOT:**
- ❌ `http://localhost:8080/hr/metrics` (missing /api)
- ❌ `http://localhost:8080/metrics` (missing /api/hr)

---

## Testing with cURL

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hr_user","password":"password123"}'

# 2. Get Metrics (replace <token> with actual token)
curl -X GET http://localhost:8080/api/hr/metrics \
  -H "Authorization: Bearer <token>"

# 3. Get Candidates
curl -X GET "http://localhost:8080/api/hr/candidates?page=0&size=10" \
  -H "Authorization: Bearer <token>"
```

---

## Testing with Postman

1. **Import Collection**: Use `HR-Management-Postman-Collection.json`
2. **Set Environment Variable**: 
   - `baseUrl` = `http://localhost:8080/api`
   - `token` = `<your-jwt-token>`
3. **All requests** will automatically use correct base URL

---

**Last Updated**: November 23, 2025  
**Base URL**: `http://localhost:8080/api`  
**Remember**: Always include `/api` prefix! ✅

