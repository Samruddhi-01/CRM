# HR Management System - Implementation Guide

## 🎯 System Overview

A comprehensive mid-scale HR Candidate Management System built with Spring Boot featuring:
- **Role-based Authentication** (Admin & HR)
- **Candidate Management** with full CRUD operations
- **Workflow Status Management** with audit trail
- **Analytics Dashboard** with metrics and reporting
- **Audit Logging** for all operations
- **Export Capabilities** (CSV/PDF) - Coming Soon

---

## ✅ Implemented Modules

### 1. ✅ Auth Module
- [x] JWT-based authentication (30-minute access tokens)
- [x] Refresh token support (7-day expiration)
- [x] Login endpoint
- [x] Refresh token endpoint
- [x] Get current user endpoint
- [x] Logout endpoint
- [x] BCrypt password hashing
- [x] User activation/deactivation support

### 2. ✅ Account Module (HR Management)
- [x] Create HR user
- [x] Update HR user
- [x] Activate/Deactivate HR
- [x] Get HR list (with pagination)
- [x] Get HR profile by ID
- [x] Duplicate email/username validation

### 3. ✅ Candidate Module
- [x] Add candidate with validation
- [x] Get candidate list (pagination + filters)
- [x] Update candidate
- [x] Get candidate detail
- [x] Duplicate email/phone validation
- [x] Auto-assign to source HR
- [x] Default status: PENDING
- [x] Authorization checks (HR can only manage their own)

### 4. ✅ Workflow Module (Status Management)
- [x] All statuses supported: PENDING, INTERESTED, NOT_INTERESTED, TELL_LATER, CONTACTED, OFFERED, HIRED
- [x] Change status with validation
- [x] Record comments for status changes
- [x] Automatic timestamp recording
- [x] Bulk status update
- [x] Comment requirement for NOT_INTERESTED and TELL_LATER

### 5. ✅ Analytics Module
- [x] Total candidates count
- [x] Status-wise breakdown
- [x] Candidates added this month
- [x] Monthly graph (12 months)
- [x] HR-wise contributions
- [x] HR performance metrics
- [x] Admin dashboard
- [x] HR dashboard

### 6. ✅ Audit Module
- [x] Track candidate creation
- [x] Track candidate updates
- [x] Track status changes
- [x] Retrieve candidate history timeline
- [x] Actor information (who made changes)
- [x] Timestamp tracking

### 7. 🔄 Export Module (Planned)
- [ ] Export candidates to CSV
- [ ] Export candidates to PDF
- [ ] Filter-based export

---

## 📁 Package Structure

```
src/main/java/com/startica/privateapp/
├── PrivateAppApplication.java
├── auth/
│   ├── controller/
│   │   └── AuthController.java
│   ├── service/
│   │   └── AuthService.java
│   └── dto/
│       ├── LoginRequest.java
│       ├── LoginResponse.java
│       └── RefreshTokenRequest.java
├── account/
│   ├── controller/
│   │   └── AdminController.java
│   ├── service/
│   │   └── AccountService.java
│   └── dto/
│       ├── CreateHRRequest.java
│       ├── UpdateHRRequest.java
│       └── HRResponse.java
├── candidate/
│   ├── controller/
│   │   ├── HRController.java
│   │   └── CandidateController.java
│   ├── service/
│   │   └── CandidateService.java
│   └── dto/
│       ├── CreateCandidateRequest.java
│       ├── UpdateCandidateRequest.java
│       ├── CandidateResponse.java
│       ├── UpdateStatusRequest.java
│       └── BulkStatusUpdateRequest.java
├── analytics/
│   ├── service/
│   │   └── AnalyticsService.java
│   └── dto/
│       ├── DashboardMetricsResponse.java
│       └── HRPerformanceResponse.java
├── audit/
│   ├── service/
│   │   └── AuditService.java
│   └── dto/
│       └── CandidateHistoryResponse.java
├── common/
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── BusinessException.java
│   │   ├── DuplicateResourceException.java
│   │   └── UnauthorizedException.java
│   └── response/
│       ├── ApiResponse.java
│       └── PageResponse.java
├── config/
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationFilter.java
│   └── DataInitializer.java
├── model/
│   ├── User.java
│   ├── Candidate.java
│   ├── CandidateHistory.java
│   ├── RefreshToken.java
│   └── Role.java
├── repository/
│   ├── UserRepository.java
│   ├── CandidateRepository.java
│   ├── CandidateHistoryRepository.java
│   └── RefreshTokenRepository.java
├── service/
│   └── CustomUserDetailsService.java
└── util/
    └── JwtUtil.java
```

---

## 🗄️ Database Schema

### Tables Created (via JPA auto-creation)

1. **accounts** - User accounts (Admin & HR)
2. **candidates** - Candidate information
3. **candidate_history** - Audit trail for candidates
4. **refresh_tokens** - JWT refresh tokens

See `database-schema-new.sql` for manual creation option.

---

## 🔐 Security Implementation

### Authentication Flow
1. User logs in with username/password
2. System validates credentials
3. System generates:
   - JWT Access Token (30 minutes)
   - Refresh Token (7 days)
4. User uses access token for API calls
5. When expired, use refresh token to get new access token

### Authorization
- **ADMIN**: Full access to all endpoints
- **HR**: 
  - Can manage only their own candidates
  - Cannot access admin endpoints
  - Cannot manage other HR users

### Method-Level Security
Using `@PreAuthorize` annotations on controllers:
```java
@PreAuthorize("hasRole('ADMIN')")
@PreAuthorize("hasAnyRole('HR', 'ADMIN')")
```

---

## 🚀 How to Run

### Prerequisites
1. Java 21
2. MySQL 8.0+
3. Maven 3.6+

### Step 1: Setup Database
```sql
CREATE DATABASE privateappdb;
```

### Step 2: Configure Application
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/privateappdb
spring.datasource.username=root
spring.datasource.password=your_password
```

### Step 3: Run Application
```bash
# Using Maven
mvn spring-boot:run

# Or using the bat file
start.bat
```

The server will start at `http://localhost:8080`

### Step 4: Test with Postman
Import `Postman_Collection.json` (needs to be updated with new endpoints)

---

## 📝 Business Logic Rules

### Candidate Creation
- ✅ Email must not duplicate
- ✅ Phone must not duplicate
- ✅ Default status = PENDING
- ✅ Auto-assign to current HR user
- ✅ Resume upload is optional

### Status Update
- ✅ Log every status change in candidate_history
- ✅ Require comment for NOT_INTERESTED and TELL_LATER
- ✅ HR can only update their own candidates (unless Admin)
- ✅ All changes tracked with actor and timestamp

### Bulk Update
- ✅ Only Admin or source HR can perform bulk updates
- ✅ Validates all candidate IDs exist
- ✅ Processes in batch for efficiency
- ✅ All changes audited

### Analytics
- ✅ Uses aggregate queries (GROUP BY)
- ✅ Calculates per-HR counts
- ✅ Monthly count grouped by MONTH(created_at)
- ✅ Last 12 months statistics

---

## 🎨 API Response Standards

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "errors": null,
  "timestamp": "2025-01-15T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": ["Field error 1", "Field error 2"],
  "timestamp": "2025-01-15T10:30:00"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "content": [...],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 100,
    "totalPages": 10,
    "last": false,
    "first": true
  }
}
```

---

## 🔍 Testing Endpoints

### 1. Login
```bash
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 2. Create Candidate (HR)
```bash
POST http://localhost:8080/hr/candidates
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "location": "New York",
  "skills": "Java, Spring Boot"
}
```

### 3. Get Dashboard Metrics (Admin)
```bash
GET http://localhost:8080/admin/metrics/overview
Authorization: Bearer <token>
```

---

## 📊 Performance Optimizations

- ✅ Database indexes on email, phone, status, created_at, source_hr_id
- ✅ Pagination for all list endpoints
- ✅ JPA Specification for dynamic filtering
- ✅ HikariCP connection pooling
- ✅ Lazy loading for relationships
- ✅ Efficient aggregate queries

---

## 🔮 Future Enhancements

1. **Export Module** (High Priority)
   - CSV export with Apache Commons CSV
   - PDF export with iText
   - Filter-based export

2. **File Upload**
   - Resume upload endpoint
   - File validation (size, type)
   - Storage management

3. **Email Notifications**
   - Status change notifications
   - Bulk email to candidates

4. **Advanced Search**
   - Full-text search
   - Skills-based matching

5. **Reporting**
   - Custom date range reports
   - Performance analytics

---

## 📖 Additional Documentation

- `API-DOCUMENTATION.md` - Complete API reference
- `database-schema-new.sql` - Manual database setup
- `POSTMAN-GUIDE.txt` - Postman collection guide

---

## 🐛 Known Issues & Solutions

### Issue: Duplicate user error on startup
**Solution:** Database already has users. Either:
1. Drop and recreate database
2. Remove DataInitializer checks

### Issue: JWT token expired
**Solution:** Use refresh token endpoint to get new access token

### Issue: 403 Forbidden
**Solution:** Check if user has correct role for the endpoint

---

## 👥 Default Users

| Username | Password | Role | Purpose |
|----------|----------|------|---------|
| admin | admin123 | ADMIN | Full system access |
| hr | hr123 | HR | Candidate management |

---

## 📞 Support

For issues or questions, refer to:
1. API Documentation
2. Error logs in console
3. Database schema file

---

**Built with ❤️ using Spring Boot 3.5.0**

