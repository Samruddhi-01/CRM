# 🚀 HR Candidate Management System

A comprehensive, production-ready HR Candidate Management System built with **Spring Boot 3.5.0**, featuring role-based authentication, complete candidate lifecycle management, analytics dashboard, and audit logging.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with 30-minute access tokens
- Refresh token support (7-day expiration)
- Role-based access control (Admin & HR)
- Method-level security with @PreAuthorize
- BCrypt password hashing

### 👥 User Management (Admin Only)
- Create and manage HR users
- Activate/deactivate HR accounts
- View HR performance metrics
- Duplicate email/username validation

### 📋 Candidate Management
- Complete CRUD operations for candidates
- Duplicate email/phone validation
- Auto-assignment to source HR
- Advanced search and filtering
- Pagination and sorting support
- Authorization checks (HR can only manage their own)

### 🔄 Workflow & Status Management
- **7 Status Types**: PENDING, INTERESTED, NOT_INTERESTED, TELL_LATER, CONTACTED, OFFERED, HIRED
- Status change tracking with comments
- Bulk status updates
- Mandatory comments for NOT_INTERESTED and TELL_LATER statuses
- Complete audit trail for all changes

### 📊 Analytics & Reporting
- **Admin Dashboard**:
  - Total candidates breakdown by status
  - Candidates added this month
  - 12-month trend graph
  - HR-wise contribution metrics
  - Performance analytics per HR
  
- **HR Dashboard**:
  - Personal candidate statistics
  - Status breakdown
  - Performance overview

### 📜 Audit Logging
- Track all candidate operations (create, update, status change)
- Actor information (who made changes)
- Timestamp tracking
- Complete candidate history timeline
- Searchable audit logs

### 🎯 Business Logic & Validation
- Email/phone duplication prevention
- Status-based comment requirements
- Authorization checks at every level
- Automatic timestamp management
- Data integrity enforcement

## 🏗️ Architecture

### Technology Stack
- **Framework**: Spring Boot 3.5.0
- **Language**: Java 21
- **Database**: MySQL 8.0+
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven
- **Documentation**: Swagger/OpenAPI (ready for integration)

### Design Patterns
- **Repository Pattern** for data access
- **Service Layer** for business logic
- **DTO Pattern** for data transfer
- **Builder Pattern** for object creation
- **Strategy Pattern** for authentication
- **Exception Handling** with global handler

## 📁 Project Structure

```
src/main/java/com/startica/privateapp/
├── auth/                    # Authentication module
│   ├── controller/         # Auth endpoints
│   ├── service/           # Auth business logic
│   └── dto/               # Login/Token DTOs
├── account/                # HR management module
│   ├── controller/        # Admin endpoints
│   ├── service/          # Account service
│   └── dto/              # HR DTOs
├── candidate/             # Candidate management module
│   ├── controller/       # Candidate & HR endpoints
│   ├── service/         # Candidate service
│   └── dto/             # Candidate DTOs
├── analytics/            # Analytics module
│   ├── service/        # Metrics calculation
│   └── dto/           # Metrics DTOs
├── audit/               # Audit logging module
│   ├── service/       # Audit service
│   └── dto/          # History DTOs
├── common/              # Shared components
│   ├── exception/     # Custom exceptions & handler
│   └── response/      # API response wrappers
├── config/             # Configuration classes
├── model/             # JPA entities
├── repository/        # Data repositories
├── service/          # Shared services
└── util/            # Utility classes
```

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Postman (for API testing)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd server
```

#### 2. Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE privateappdb;
exit;
```

#### 3. Configure Application
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

#### 4. Build & Run
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or use the batch file (Windows)
start.bat
```

The application will start at: **http://localhost:8080**

### Initial Setup
The application automatically creates two default users on first run:

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | ADMIN | Full system access |
| hr | hr123 | HR | Candidate management only |

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Quick Start

#### 1. Login
```bash
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "550e8400...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "ADMIN"
    }
  }
}
```

#### 2. Create Candidate
```bash
POST /hr/candidates
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "skills": "Java, Spring Boot, React"
}
```

#### 3. Get Dashboard Metrics
```bash
GET /admin/metrics/overview
Authorization: Bearer <accessToken>
```

### Complete API Reference
See [API-DOCUMENTATION.md](API-DOCUMENTATION.md) for complete endpoint documentation.

## 🧪 Testing

### Using Postman
1. Import `HR-Management-Postman-Collection.json`
2. Set environment variable `baseUrl` to `http://localhost:8080`
3. Run "Login" request - tokens will be auto-saved
4. Test other endpoints

### Manual Testing
```bash
# Login as Admin
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get candidates
curl -X GET http://localhost:8080/hr/candidates \
  -H "Authorization: Bearer <token>"
```

## 📊 Database Schema

### Tables
- **accounts** - User accounts (Admin & HR)
- **candidates** - Candidate information
- **candidate_history** - Audit trail
- **refresh_tokens** - JWT refresh tokens

### Key Relationships
- Candidate → Source HR (many-to-one)
- History → Candidate (many-to-one)
- RefreshToken → User (many-to-one)

See `database-schema-new.sql` for manual schema creation.

## 🔒 Security Features

- ✅ JWT-based stateless authentication
- ✅ Role-based authorization (RBAC)
- ✅ Method-level security
- ✅ BCrypt password encryption
- ✅ CORS configuration
- ✅ SQL injection prevention (JPA)
- ✅ XSS protection
- ✅ CSRF protection disabled (stateless API)

## 🎯 Business Rules

### Candidate Creation
- Email must be unique
- Phone must be unique
- Default status: PENDING
- Auto-assigned to current HR user

### Status Updates
- NOT_INTERESTED → Comment required
- TELL_LATER → Comment required
- All changes audited
- HR can only update own candidates (unless Admin)

### Bulk Operations
- Admin can update all candidates
- HR can only bulk update their own candidates
- All changes tracked individually

## 📈 Performance

### Optimizations
- ✅ Database indexing on critical fields
- ✅ Pagination for all list endpoints
- ✅ HikariCP connection pooling
- ✅ Lazy loading for relationships
- ✅ Aggregate queries for analytics
- ✅ JPA Specification for dynamic queries

### Scalability
- Designed for **50K+ candidates**
- Efficient batch operations
- Optimized database queries
- Stateless architecture (horizontal scaling ready)

## 📝 API Endpoints Summary

### Auth (No auth required)
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Admin (Admin only)
- `GET/POST/PUT/PATCH /admin/hr/**` - HR management
- `GET /admin/metrics/**` - Analytics
- `GET /admin/audit` - Audit logs

### HR (HR & Admin)
- `GET/POST/PUT/PATCH /hr/candidates/**` - Candidate management
- `POST /hr/candidates/bulk-status` - Bulk updates
- `GET /hr/metrics` - HR dashboard

### Common (HR & Admin)
- `GET /candidates/{id}/history` - Candidate history

## 🐛 Troubleshooting

### Issue: Cannot connect to database
**Solution**: Verify MySQL is running and credentials are correct in `application.properties`

### Issue: Duplicate user error on startup
**Solution**: Database already initialized. Comment out DataInitializer or drop database

### Issue: 401 Unauthorized
**Solution**: Token expired. Use refresh token endpoint or login again

### Issue: 403 Forbidden
**Solution**: User doesn't have required role for the endpoint

## 🔮 Future Enhancements

- [ ] Export to CSV/PDF
- [ ] File upload for resumes
- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications with WebSocket
- [ ] Multi-language support
- [ ] Custom report generation
- [ ] Interview scheduling integration

## 📖 Documentation Files

- `README.md` - This file
- `API-DOCUMENTATION.md` - Complete API reference
- `IMPLEMENTATION-GUIDE.md` - Detailed implementation guide
- `HR-Management-Postman-Collection.json` - Postman collection
- `database-schema-new.sql` - Manual database schema

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary software for Startica.

## 👨‍💻 Support

For support and questions:
- Check API Documentation
- Review Implementation Guide
- Check application logs
- Verify database schema

---

**Built with ❤️ using Spring Boot 3.5.0 & Java 21**

**Status**: ✅ Production Ready | 🚀 Active Development

