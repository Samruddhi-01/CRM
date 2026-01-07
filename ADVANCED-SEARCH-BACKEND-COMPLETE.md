# Advanced Search Backend Implementation - Complete

## Overview
Enterprise-grade Advanced Search system for HR Management Platform with global search, module-specific filters, and role-based access.

## Backend Structure Created

### 1. DTOs (Data Transfer Objects)
Location: `server/src/main/java/com/startica/privateapp/search/dto/`

#### GlobalSearchRequest.java
- Global topbar search across all entities
- Entity toggles: searchCandidates, searchJobOpenings, searchHRUsers
- Pagination: page (default 0), size (default 10)
- Sorting: sortBy (relevance/date/name), sortDirection (ASC/DESC)
- Validation: @NotBlank on query, @Min on page/size

#### GlobalSearchResponse.java
- Grouped results with three nested classes:
  - CandidateSearchResult: id, name, email, skills, experience, currentPackage, status, highlightedText
  - JobOpeningSearchResult: id, title, department, location, skills, maxSalary, status, highlightedText
  - HRUserSearchResult: id, name, email, role, phone, highlightedText
- Total counts for each entity type
- Search metadata: query, searchTimeMs
- Uses @Builder pattern

#### CandidateSearchRequest.java
- Comprehensive candidate filtering:
  - textQuery (searches name, email, phone, skills)
  - primarySkills & secondarySkills with ANY/ALL match type
  - Experience range: minExperience, maxExperience
  - Package ranges: min/maxCurrentPackage, min/maxExpectedCTC
  - locations (list of preferred locations)
  - statuses (PENDING, INTERESTED, NOT_INTERESTED, etc.)
  - sources (recruitment sources)
  - maxGap (employment gap filter)
  - Date range: createdFrom/To
  - createdByHrId (role-based filtering)
  - Pagination: page=0, size=20, sortBy, sortDirection

#### JobOpeningSearchRequest.java
- Job opening advanced filters:
  - textQuery (searches title, department, description, skills)
  - titles, departments, types (Full-Time, Part-Time, Contract, etc.)
  - locations (job locations)
  - Experience range: minExperience, maxExperience
  - Salary range: minSalary, maxSalary
  - skills (comma-separated)
  - statuses (ACTIVE, CLOSED, ON_HOLD)
  - Date range: createdFrom/To
  - createdByHrId
  - Pagination: page=0, size=20, sortBy, sortDirection

#### SearchResultPage<T>.java
- Generic paginated response wrapper
- Properties: content, page, size, totalElements, totalPages, first, last, empty
- Search metadata: query, searchTimeMs
- Static factory method: `of(content, page, size, totalElements, query, searchTimeMs)`

#### SavedSearchRequest.java & SavedSearchResponse.java
- Save/load custom search filters
- Request: name, description, searchType, filters (Map), isShared, enableNotifications, notificationFrequency
- Response: adds id, userId, userName, createdAt, lastUsedAt, useCount

### 2. JPA Specifications
Location: `server/src/main/java/com/startica/privateapp/search/specification/`

#### CandidateSpecification.java
- Dynamic query builder for Candidate entity
- Builds predicates for:
  - Text search (firstName, lastName, email, phone, skills)
  - Primary/secondary skills with ANY/ALL logic
  - Experience ranges (numeric comparison)
  - Package ranges (currentPackage, expectedCTC)
  - Location filtering
  - Status enum filtering (with validation)
  - Date range filtering
  - sourceHrId filtering

#### JobOpeningSpecification.java
- Dynamic query builder for Opening entity
- Builds predicates for:
  - Text search (title, department, description, skills)
  - Title pattern matching
  - Department/type/location filtering
  - Skills pattern matching
  - Experience/salary ranges
  - Status enum filtering (with validation)
  - Date range filtering
  - createdBy filtering

### 3. Services
Location: `server/src/main/java/com/startica/privateapp/search/service/`

#### GlobalSearchService.java
- Orchestrates cross-entity search
- Methods:
  - `search(GlobalSearchRequest)` - Main search coordinator
  - `mapCandidateToResult()` - Maps Candidate entity to result DTO
  - `mapJobOpeningToResult()` - Maps Opening entity to result DTO
  - `mapUserToResult()` - Maps User entity to result DTO
  - `highlightMatch()` - Wraps matched text in <mark> tags
  - `getSort()` - Dynamic sort builder
- Features:
  - Parallel entity searches (respects toggles)
  - Highlighted text for UI display
  - Search time tracking

#### CandidateSearchService.java
- Advanced candidate search logic
- Methods:
  - `advancedSearch(CandidateSearchRequest)` - Main search method
  - `getSort()` - Dynamic sort builder (supports: name, experience, currentPackage, expectedCTC, status, createdAt)
- Uses CandidateSpecification for dynamic query building
- Returns SearchResultPage<Candidate>

#### JobOpeningSearchService.java
- Advanced job opening search logic
- Methods:
  - `advancedSearch(JobOpeningSearchRequest)` - Main search method
  - `getSort()` - Dynamic sort builder (supports: title, department, maxSalary, status, createdAt)
- Uses JobOpeningSpecification for dynamic query building
- Returns SearchResultPage<Opening>

### 4. REST Controllers
Location: `server/src/main/java/com/startica/privateapp/search/controller/`

#### GlobalSearchController.java
```
POST /api/search/global
- Body: GlobalSearchRequest
- Response: GlobalSearchResponse
- CORS enabled
- Validation enabled
```

#### CandidateSearchController.java
```
POST /api/candidates/advanced-search
- Body: CandidateSearchRequest
- Response: SearchResultPage<Candidate>
- CORS enabled
```

#### JobOpeningSearchController.java
```
POST /api/openings/advanced-search
- Body: JobOpeningSearchRequest
- Response: SearchResultPage<Opening>
- CORS enabled
```

### 5. Repository Enhancements

#### CandidateRepository.java
Added method:
```java
@Query("SELECT c FROM Candidate c WHERE " +
       "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(c.skills) LIKE LOWER(CONCAT('%', :query, '%'))")
List<Candidate> searchByText(@Param("query") String query, Pageable pageable);
```

#### OpeningRepository.java
- Added JpaSpecificationExecutor interface
- Added method:
```java
@Query("SELECT o FROM Opening o WHERE " +
       "LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(o.department) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(o.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(o.description) LIKE LOWER(CONCAT('%', :query, '%'))")
List<Opening> searchByText(@Param("query") String query, Pageable pageable);
```

#### UserRepository.java
Added method:
```java
@Query("SELECT u FROM User u WHERE " +
       "LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))")
List<User> searchByText(String query, Pageable pageable);
```

## API Endpoints Summary

### 1. Global Search
**POST** `/api/search/global`

Request:
```json
{
  "query": "java developer",
  "searchCandidates": true,
  "searchJobOpenings": true,
  "searchHRUsers": false,
  "page": 0,
  "size": 10,
  "sortBy": "relevance",
  "sortDirection": "DESC"
}
```

Response:
```json
{
  "query": "java developer",
  "candidateResults": [...],
  "jobOpeningResults": [...],
  "hrUserResults": [],
  "totalCandidates": 45,
  "totalJobOpenings": 12,
  "totalHRUsers": 0,
  "searchTimeMs": 234
}
```

### 2. Candidate Advanced Search
**POST** `/api/candidates/advanced-search`

Request:
```json
{
  "textQuery": "java spring",
  "primarySkills": ["Java", "Spring Boot"],
  "primarySkillsMatchType": "ALL",
  "minExperience": "3",
  "maxExperience": "8",
  "minExpectedCTC": "10",
  "maxExpectedCTC": "25",
  "locations": ["Bangalore", "Pune"],
  "statuses": ["INTERESTED", "PENDING"],
  "page": 0,
  "size": 20,
  "sortBy": "experience",
  "sortDirection": "DESC"
}
```

Response:
```json
{
  "content": [...candidate objects...],
  "page": 0,
  "size": 20,
  "totalElements": 125,
  "totalPages": 7,
  "first": true,
  "last": false,
  "empty": false,
  "query": "java spring",
  "searchTimeMs": 156
}
```

### 3. Job Opening Advanced Search
**POST** `/api/openings/advanced-search`

Request:
```json
{
  "textQuery": "senior developer",
  "departments": ["Engineering", "Product"],
  "locations": ["Bangalore", "Remote"],
  "skills": ["Java", "React"],
  "minSalary": "15",
  "maxSalary": "30",
  "statuses": ["ACTIVE"],
  "page": 0,
  "size": 20,
  "sortBy": "maxSalary",
  "sortDirection": "DESC"
}
```

## Role-Based Access Control

### HR Users
- See only their own data:
  - CandidateSearchRequest includes `createdByHrId` filter (set to HR's userId)
  - JobOpeningSearchRequest includes `createdByHrId` filter (set to HR's userId)
- Cannot see other HR users' data

### ADMIN Users
- See all data:
  - No `createdByHrId` filter applied
  - Can search across all candidates and openings
- Can search HR users (searchHRUsers toggle)

## Next Steps: Frontend Implementation

### To Do:
1. **Global Search Component** (Topbar autocomplete)
2. **Advanced Search Panel** (Reusable filter component)
3. **Candidate Search Page** (Integration with CandidateSearchService)
4. **Opening Search Page** (Integration with JobOpeningSearchService)
5. **Redux Slices** (State management for search filters)
6. **Saved Searches** (SavedSearchService + UI)

## Testing the Backend

### Using cURL:

#### Global Search:
```bash
curl -X POST http://localhost:8080/api/search/global \
  -H "Content-Type: application/json" \
  -d '{
    "query": "java",
    "searchCandidates": true,
    "searchJobOpenings": true,
    "page": 0,
    "size": 10
  }'
```

#### Candidate Advanced Search:
```bash
curl -X POST http://localhost:8080/api/candidates/advanced-search \
  -H "Content-Type: application/json" \
  -d '{
    "textQuery": "java",
    "minExperience": "3",
    "maxExperience": "8",
    "locations": ["Bangalore"],
    "page": 0,
    "size": 20
  }'
```

#### Opening Advanced Search:
```bash
curl -X POST http://localhost:8080/api/openings/advanced-search \
  -H "Content-Type: application/json" \
  -d '{
    "textQuery": "developer",
    "departments": ["Engineering"],
    "statuses": ["ACTIVE"],
    "page": 0,
    "size": 20
  }'
```

## Performance Optimizations Implemented

1. **Indexed Queries**: Repositories use indexed columns (status, createdAt, sourceHrId)
2. **Pagination**: All searches support pagination to limit result sets
3. **Dynamic Queries**: JPA Specifications build only necessary predicates
4. **Search Time Tracking**: All services measure and return search duration
5. **Highlighted Text**: Pre-computed on backend to reduce frontend processing

## Error Handling

All controllers use Spring's standard error handling:
- 400 Bad Request: Invalid request body or validation failures
- 500 Internal Server Error: Database or service errors

Validation errors return:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "query",
      "message": "Search query is required"
    }
  ]
}
```

## Compilation Status
✅ All files compiled successfully with no errors
✅ All dependencies resolved (Jakarta validation, JPA, Spring Web)
✅ Repository interfaces updated with search methods
✅ CORS enabled for frontend integration

## Files Created (15 total)

### DTOs (7 files)
1. GlobalSearchRequest.java
2. GlobalSearchResponse.java
3. CandidateSearchRequest.java
4. JobOpeningSearchRequest.java
5. SearchResultPage.java
6. SavedSearchRequest.java
7. SavedSearchResponse.java

### Specifications (2 files)
8. CandidateSpecification.java
9. JobOpeningSpecification.java

### Services (3 files)
10. GlobalSearchService.java
11. CandidateSearchService.java
12. JobOpeningSearchService.java

### Controllers (3 files)
13. GlobalSearchController.java
14. CandidateSearchController.java
15. JobOpeningSearchController.java

## Ready for Frontend Integration
The backend is fully implemented and ready for frontend components to consume these APIs.
