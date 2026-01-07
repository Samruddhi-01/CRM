# HR Management System - API Documentation

## Overview
This is a comprehensive HR Candidate Management System with role-based authentication (Admin & HR).

## Base URL
```
http://localhost:8080
```

## Authentication
All endpoints (except login/refresh) require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. AUTH ENDPOINTS

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "admin",
      "fullName": "Admin User",
      "email": "admin@startica.com",
      "role": "ADMIN",
      "active": true
    }
  }
}
```

### Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Get Current User
**GET** `/auth/me`

### Logout
**POST** `/auth/logout`

---

## 2. ADMIN ENDPOINTS (Admin Only)

### HR Management

#### Get All HR Users
**GET** `/admin/hr`

#### Get HR Users (Paginated)
**GET** `/admin/hr/paginated?page=0&size=10`

#### Get HR by ID
**GET** `/admin/hr/{id}`

#### Create HR User
**POST** `/admin/hr`

**Request Body:**
```json
{
  "username": "hr_john",
  "password": "password123",
  "fullName": "John Doe",
  "email": "john@company.com",
  "phone": "1234567890"
}
```

#### Update HR User
**PUT** `/admin/hr/{id}`

**Request Body:**
```json
{
  "fullName": "John Smith",
  "email": "johnsmith@company.com",
  "phone": "0987654321",
  "password": "newpassword123"
}
```

#### Activate/Deactivate HR
**PATCH** `/admin/hr/{id}/status?active=true`

### Analytics

#### Get Dashboard Metrics
**GET** `/admin/metrics/overview`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCandidates": 150,
    "interestedCount": 45,
    "notInterestedCount": 20,
    "pendingCount": 60,
    "contactedCount": 15,
    "offeredCount": 5,
    "hiredCount": 5,
    "tellLaterCount": 10,
    "candidatesThisMonth": 25,
    "hrContributions": {
      "HR User 1": 80,
      "HR User 2": 70
    },
    "monthlyStatistics": {
      "2024-12": 25,
      "2025-01": 30,
      "2025-02": 28
    }
  }
}
```

#### Get Monthly Statistics
**GET** `/admin/metrics/monthly`

#### Get HR Performance
**GET** `/admin/metrics/hr-performance`

### Audit Logs

#### Get Audit Logs
**GET** `/admin/audit?actorId=1&page=0&size=20`

---

## 3. HR ENDPOINTS (HR & Admin)

### Candidate Management

#### Get Candidates (Paginated & Filtered)
**GET** `/hr/candidates?search=john&status=PENDING&page=0&size=10&sortBy=createdAt&sortDir=DESC`

**Query Parameters:**
- `search` (optional): Search by name, email, phone
- `status` (optional): Filter by status (PENDING, INTERESTED, NOT_INTERESTED, TELL_LATER, CONTACTED, OFFERED, HIRED)
- `sourceHrId` (optional): Filter by HR (Admin only)
- `page` (default: 0)
- `size` (default: 10)
- `sortBy` (default: createdAt)
- `sortDir` (default: DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "location": "New York",
        "skills": "Java, Spring Boot, React",
        "resumeUrl": "/uploads/resumes/john_doe_resume.pdf",
        "status": "PENDING",
        "sourceHrId": 2,
        "sourceHrName": "HR User",
        "notes": "Good candidate",
        "createdAt": "2025-01-15T10:30:00",
        "updatedAt": "2025-01-15T10:30:00"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 100,
    "totalPages": 10,
    "last": false,
    "first": true
  }
}
```

#### Get Candidate by ID
**GET** `/hr/candidates/{id}`

#### Create Candidate
**POST** `/hr/candidates`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "location": "San Francisco",
  "skills": "Python, Django, PostgreSQL",
  "resumeUrl": "/uploads/resumes/jane_smith.pdf",
  "notes": "Excellent background in backend development"
}
```

**Validation Rules:**
- Email must not duplicate
- Phone must not duplicate
- Default status: PENDING
- Auto-assigned to current HR user

#### Update Candidate
**PUT** `/hr/candidates/{id}`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "phone": "9876543210",
  "location": "Los Angeles",
  "skills": "Python, Django, React, PostgreSQL",
  "notes": "Updated skills"
}
```

**Authorization:**
- HR can only update their own candidates
- Admin can update all candidates

#### Update Candidate Status
**PATCH** `/hr/candidates/{id}/status`

**Request Body:**
```json
{
  "status": "INTERESTED",
  "comment": "Candidate is very interested in the position"
}
```

**Required Comments:**
- Status: `NOT_INTERESTED` - Comment required
- Status: `TELL_LATER` - Comment required

#### Bulk Update Status
**POST** `/hr/candidates/bulk-status`

**Request Body:**
```json
{
  "candidateIds": [1, 2, 3, 4, 5],
  "status": "CONTACTED",
  "comment": "Sent initial email to all candidates"
}
```

**Authorization:**
- HR can only update status of their own candidates
- Admin can update all candidates

### HR Dashboard

#### Get HR Metrics
**GET** `/hr/metrics`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCandidates": 50,
    "interestedCount": 15,
    "notInterestedCount": 8,
    "pendingCount": 20,
    "contactedCount": 5,
    "offeredCount": 1,
    "hiredCount": 1,
    "tellLaterCount": 3
  }
}
```

---

## 4. COMMON ENDPOINTS

### Get Candidate History
**GET** `/candidates/{id}/history`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "candidateId": 5,
      "action": "STATUS_CHANGED",
      "oldValue": "PENDING",
      "newValue": "INTERESTED - Comment: Very enthusiastic",
      "actorId": 2,
      "actorRole": "HR",
      "timestamp": "2025-01-15T14:30:00"
    },
    {
      "id": 2,
      "candidateId": 5,
      "action": "CANDIDATE_CREATED",
      "oldValue": null,
      "newValue": "Name: John Doe, Email: john@example.com, Phone: 1234567890, Status: PENDING",
      "actorId": 2,
      "actorRole": "HR",
      "timestamp": "2025-01-15T10:00:00"
    }
  ]
}
```

---

## Candidate Status Flow

```
PENDING → INTERESTED → CONTACTED → OFFERED → HIRED
        → NOT_INTERESTED
        → TELL_LATER
```

---

## Default Users

**Admin User:**
- Username: `admin`
- Password: `admin123`

**HR User:**
- Username: `hr`
- Password: `hr123`

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "details": ["Validation error 1", "Validation error 2"],
  "timestamp": "2025-01-15T10:30:00"
}
```

## HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

