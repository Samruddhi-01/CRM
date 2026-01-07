# Advanced Search System Architecture - Startica

## 🏗️ System Design Overview

### Architecture Principles
1. **Role-based access control** (RBAC)
2. **Dynamic query building** using JPA Specifications
3. **Client-side caching** with Redux
4. **Performance optimization** with proper indexing
5. **Elastic search-ready** design (future upgrade path)

---

## 📊 Database Schema Enhancements

### New Tables

```sql
-- Saved Search Filters (per user)
CREATE TABLE saved_searches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- CANDIDATE, JOB_OPENING, REPORT
    filter_json TEXT NOT NULL, -- JSON string of filters
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_entity (user_id, entity_type),
    INDEX idx_favorite (user_id, is_favorite)
);

-- Search History (auto-save recent searches)
CREATE TABLE search_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    search_query TEXT NOT NULL,
    filter_json TEXT,
    result_count INT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_date (user_id, searched_at DESC),
    INDEX idx_entity_type (entity_type)
);

-- Search Analytics (track popular searches)
CREATE TABLE search_analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    entity_type VARCHAR(50) NOT NULL,
    search_term VARCHAR(255) NOT NULL,
    search_count INT DEFAULT 1,
    last_searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_entity_term (entity_type, search_term),
    INDEX idx_count (search_count DESC),
    INDEX idx_entity (entity_type)
);
```

### Recommended Indexes

```sql
-- Candidates Table
CREATE INDEX idx_candidate_status ON candidates(status);
CREATE INDEX idx_candidate_skills ON candidates(primary_skill);
CREATE INDEX idx_candidate_experience ON candidates(total_experience);
CREATE INDEX idx_candidate_location ON candidates(current_location);
CREATE INDEX idx_candidate_created_date ON candidates(created_at DESC);
CREATE INDEX idx_candidate_ctc ON candidates(current_ctc, expected_ctc);
CREATE INDEX idx_candidate_created_by ON candidates(created_by_hr_id);
CREATE FULLTEXT INDEX idx_candidate_fulltext ON candidates(full_name, email, phone, primary_skill);

-- Job Openings Table
CREATE INDEX idx_opening_status ON job_openings(opening_status);
CREATE INDEX idx_opening_client ON job_openings(client_name);
CREATE INDEX idx_opening_experience ON job_openings(min_experience, max_experience);
CREATE INDEX idx_opening_created_date ON job_openings(created_at DESC);
CREATE INDEX idx_opening_created_by ON job_openings(created_by_hr_id);
CREATE FULLTEXT INDEX idx_opening_fulltext ON job_openings(title, client_name, tech_stack);

-- HR Users Table
CREATE INDEX idx_hr_active ON users(is_active);
CREATE INDEX idx_hr_role ON users(role);
CREATE INDEX idx_hr_email ON users(email);
```

---

## 🔧 Backend Implementation Strategy

### 1. DTO Layer Structure

**Request DTOs:**
- `GlobalSearchRequest` - for topbar search
- `CandidateSearchRequest` - for candidate advanced filters
- `JobOpeningSearchRequest` - for job opening filters
- `ReportSearchRequest` - for activity reports
- `SavedSearchRequest` - for saving/loading filters

**Response DTOs:**
- `GlobalSearchResponse` - grouped results
- `SearchResultPage<T>` - paginated results with metadata
- `SearchSummaryDTO` - count + filter summary
- `SavedSearchDTO` - saved filter details

### 2. Search Service Architecture

```
SearchController
    ↓
GlobalSearchService
    ├→ CandidateSearchService
    ├→ JobOpeningSearchService
    └→ HRSearchService
         ↓
    SearchSpecificationBuilder (Dynamic JPA Specifications)
         ↓
    Repositories with Specifications
```

### 3. Role-Based Access Control

**User Context (ThreadLocal)**
```java
public class UserContext {
    private static ThreadLocal<UserPrincipal> currentUser = new ThreadLocal<>();
    
    public static void setUser(UserPrincipal user) {
        currentUser.set(user);
    }
    
    public static UserPrincipal getUser() {
        return currentUser.get();
    }
    
    public static Long getUserId() {
        UserPrincipal user = currentUser.get();
        return user != null ? user.getId() : null;
    }
    
    public static void clear() {
        currentUser.remove();
    }
}
```

**Authentication Interceptor**
```java
@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) {
        UserPrincipal user = SecurityUtils.getCurrentUser();
        UserContext.setUser(user);
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, 
                               Exception ex) {
        UserContext.clear();
    }
}
```

---

## 🎨 Frontend Architecture

### Redux Store Structure

```javascript
store/
├── search/
│   ├── globalSearchSlice.js
│   ├── candidateSearchSlice.js
│   ├── jobOpeningSearchSlice.js
│   ├── savedSearchesSlice.js
│   └── searchHistorySlice.js
```

### Component Hierarchy

```
App
├── TopBar
│   └── GlobalSearch (autocomplete, grouped results)
├── CandidatesPage
│   ├── AdvancedSearchPanel
│   │   ├── FilterGroup (Skills)
│   │   ├── FilterGroup (Experience)
│   │   ├── FilterGroup (Location)
│   │   └── FilterGroup (Status)
│   ├── ActiveFiltersChips
│   ├── SearchSummary
│   └── CandidatesList (with pagination)
├── JobOpeningsPage
│   └── (similar structure)
└── ReportsPage
    └── ActivitySearch
```

---

## 🚀 Advanced Features

### 1. Smart Search Suggestions
- Auto-complete using search history
- Trending searches across system
- Recent searches per user

### 2. Filter Presets
- Quick filters: "Active Candidates", "Hot Openings", "High Priority"
- Admin-defined global filter templates

### 3. Real-time Filter Count
- Show candidate count as filters are applied (debounced)
- "23 candidates match your criteria"

### 4. Export Optimization
- Background job for large exports
- Email download link when ready
- CSV/Excel/PDF formats

### 5. Search Analytics Dashboard (Admin)
- Most searched skills
- Popular filter combinations
- Search performance metrics

---

## 📈 Performance Optimizations

### Backend
1. **Query Result Caching** - Cache popular searches (Redis)
2. **Database Connection Pooling** - HikariCP tuning
3. **Async Export Processing** - Spring @Async for large exports
4. **Query Plan Analysis** - EXPLAIN plans for complex queries
5. **Pagination Cursor** - Keyset pagination for large datasets

### Frontend
1. **Debounced Search** - 500ms delay for auto-complete
2. **Virtual Scrolling** - For large result lists
3. **Request Deduplication** - Cancel previous requests
4. **Local Filter Cache** - Store last 10 searches in localStorage
5. **Lazy Loading** - Load filter options on demand

---

## 🔒 Security Considerations

### Data Access Control
1. **Role-based Access** - HR can only see their own data, ADMIN sees all
2. **Field-level Security** - Hide salary data for certain roles
3. **Audit Logging** - Log all search queries
4. **Rate Limiting** - Prevent search abuse
5. **SQL Injection Prevention** - Use JPA parameters only

### API Security
```java
@PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@PostMapping("/api/search/candidates/advanced")
public ResponseEntity<SearchResultPage<CandidateDTO>> searchCandidates(
    @Valid @RequestBody CandidateSearchRequest request,
    @AuthenticationPrincipal UserPrincipal user
) {
    // Validate role-based access
    if (user.hasRole("HR") && !request.getCreatedByHrId().equals(user.getId())) {
        throw new ForbiddenException("HR can only search their own candidates");
    }
    // Process search...
}
```

---

## 🎯 Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema updates
- [ ] Base DTOs and entities
- [ ] TenantContext and interceptor
- [ ] Basic JPA Specifications builder
- [ ] Global search API (text-only)

### Phase 2: Advanced Filters (Week 3-4)
- [ ] Candidate advanced search API
- [ ] Job opening advanced search API
- [ ] Frontend AdvancedSearchPanel component
- [ ] Redux integration
- [ ] Active filter chips

### Phase 3: Enhanced Features (Week 5-6)
- [ ] Saved searches (DB + API)
- [ ] Search history
- [ ] Export functionality
- [ ] Search analytics
- [ ] Filter presets

### Phase 4: Optimization (Week 7-8)
- [ ] Performance tuning
- [ ] Redis caching layer
- [ ] Frontend virtual scrolling
- [ ] Admin analytics dashboard
- [ ] Load testing

---

## 📚 Technology Stack

### Backend
- **Spring Boot 3.x** - Framework
- **Spring Data JPA** - ORM
- **MySQL 8.x** - Database
- **Redis** (optional) - Caching
- **Apache POI** - Excel export
- **OpenCSV** - CSV export

### Frontend
- **React 18+** - UI library
- **Redux Toolkit** - State management
- **React Query** (optional) - Server state
- **Ant Design / MUI** - UI components
- **axios** - HTTP client
- **date-fns** - Date manipulation

---

## 🧪 Testing Strategy

### Backend Tests
- Unit tests for Specifications builder
- Integration tests for search APIs
- Role-based access control tests
- Performance tests (JMeter)

### Frontend Tests
- Component tests (React Testing Library)
- Redux slice tests
- E2E tests (Cypress/Playwright)
- Accessibility tests

---

## 📖 API Documentation

Use **Swagger/OpenAPI 3.0** for all search endpoints:
- Request/response examples
- Filter parameter descriptions
- Error codes and messages
- Rate limit information

---

This architecture ensures:
✅ **Scalability** - Handle 10K+ searches/day
✅ **Security** - Role-based access control
✅ **Performance** - Sub-200ms response times
✅ **Maintainability** - Clean, testable code
✅ **Extensibility** - Easy to add new filters/entities
