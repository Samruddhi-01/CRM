package com.startica.privateapp.search.service;

import com.startica.privateapp.search.dto.*;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.model.User;
import com.startica.privateapp.repository.CandidateRepository;
import com.startica.privateapp.opening.repository.OpeningRepository;
import com.startica.privateapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GlobalSearchService {

    private final CandidateRepository candidateRepository;
    private final OpeningRepository openingRepository;
    private final UserRepository userRepository;

    /**
     * Parse experience string into decimal years - Improved version
     * Handles formats like "2 years", "2.5 years", "2 years 6 months", "30 months", etc.
     */
    private double parseExperienceString(String expStr) {
        if (expStr == null || expStr.trim().isEmpty()) return 0.0;
        
        String cleaned = expStr.toLowerCase().trim();
        
        // Handle decimal years first (e.g., "2.5 years")
        if (cleaned.matches(".*\\d+\\.\\d+.*")) {
            String decimalStr = cleaned.replaceAll("[^0-9.]", "");
            if (!decimalStr.isEmpty()) {
                try {
                    return Double.parseDouble(decimalStr);
                } catch (NumberFormatException e) {
                    // Continue with other parsing methods
                }
            }
        }
        
        // Handle "X years Y months" format
        if (cleaned.contains("year") && cleaned.contains("month")) {
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\d+(\\.\\d+)?");
            java.util.regex.Matcher matcher = pattern.matcher(cleaned);
            
            double years = 0.0;
            double months = 0.0;
            int count = 0;
            
            while (matcher.find() && count < 2) {
                String numberStr = matcher.group();
                double number = Double.parseDouble(numberStr);
                
                if (count == 0) {
                    years = number;
                } else {
                    months = number;
                }
                count++;
            }
            
            return years + (months / 12.0);
        }
        
        // Handle "X years" format
        if (cleaned.contains("year")) {
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\d+(\\.\\d+)?");
            java.util.regex.Matcher matcher = pattern.matcher(cleaned);
            
            if (matcher.find()) {
                String yearStr = matcher.group();
                if (!yearStr.isEmpty()) {
                    return Double.parseDouble(yearStr);
                }
            }
        }
        
        // Handle "X months" format
        if (cleaned.contains("month")) {
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\d+(\\.\\d+)?");
            java.util.regex.Matcher matcher = pattern.matcher(cleaned);
            
            if (matcher.find()) {
                String monthStr = matcher.group();
                if (!monthStr.isEmpty()) {
                    return Double.parseDouble(monthStr) / 12.0;
                }
            }
        }
        
        // Handle plain numbers (assume years)
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\d+(\\.\\d+)?");
        java.util.regex.Matcher matcher = pattern.matcher(cleaned);
        
        if (matcher.find()) {
            String numberStr = matcher.group();
            if (!numberStr.isEmpty()) {
                return Double.parseDouble(numberStr);
            }
        }
        
        return 0.0;
    }

    public GlobalSearchResponse search(GlobalSearchRequest request, User currentUser) {
        long startTime = System.currentTimeMillis();
        
        String query = request.getQuery().toLowerCase();
        Sort sort = getSort(request.getSortBy(), request.getSortDirection());
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize(), sort);

        GlobalSearchResponse response = GlobalSearchResponse.builder()
                .query(request.getQuery())
                .candidateResults(new ArrayList<>())
                .jobOpeningResults(new ArrayList<>())
                .hrUserResults(new ArrayList<>())
                .totalCandidates(0L)
                .totalJobOpenings(0L)
                .totalHRUsers(0L)
                .build();

        // Search Candidates (filtered by HR for non-admin users)
        if (request.isSearchCandidates()) {
            List<Candidate> candidates;
            if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
                // HR users see only their own candidates
                candidates = candidateRepository.searchByText(query, pageRequest).stream()
                    .filter(c -> c.getSourceHrId() != null && c.getSourceHrId().equals(currentUser.getId()))
                    .collect(java.util.stream.Collectors.toList());
            } else {
                // Admin sees all candidates
                candidates = candidateRepository.searchByText(query, pageRequest);
            }
            response.setCandidateResults(
                candidates.stream()
                    .map(c -> mapCandidateToResult(c, query))
                    .collect(Collectors.toList())
            );
            response.setTotalCandidates((long) candidates.size());
        }

        // Search Job Openings (filtered by HR for non-admin users)
        if (request.isSearchJobOpenings()) {
            List<Opening> openings;
            if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
                // HR users see only openings they created
                openings = openingRepository.searchByText(query, pageRequest).stream()
                    .filter(o -> o.getCreatedBy() != null && o.getCreatedBy().equals(currentUser.getId()))
                    .collect(java.util.stream.Collectors.toList());
            } else {
                // Admin sees all openings
                openings = openingRepository.searchByText(query, pageRequest);
            }
            response.setJobOpeningResults(
                openings.stream()
                    .map(j -> mapJobOpeningToResult(j, query))
                    .collect(Collectors.toList())
            );
            response.setTotalJobOpenings((long) openings.size());
        }

        // Search HR Users
        if (request.isSearchHRUsers()) {
            List<User> users = userRepository.searchByText(query, pageRequest);
            response.setHrUserResults(
                users.stream()
                    .map(u -> mapUserToResult(u, query))
                    .collect(Collectors.toList())
            );
            response.setTotalHRUsers((long) users.size());
        }

        long searchTime = System.currentTimeMillis() - startTime;
        response.setSearchTimeMs(searchTime);

        return response;
    }

    private GlobalSearchResponse.CandidateSearchResult mapCandidateToResult(Candidate candidate, String query) {
        String highlighted = highlightMatch(
            String.format("%s %s - %s", candidate.getFirstName(), candidate.getLastName(), candidate.getSkills()),
            query
        );
        
        return GlobalSearchResponse.CandidateSearchResult.builder()
                .id(candidate.getId())
                .name(candidate.getFirstName() + " " + candidate.getLastName())
                .email(candidate.getEmail())
                .skills(candidate.getSkills())
                .experience(candidate.getExperience())
                .currentPackage(candidate.getCurrentPackage())
                .status(candidate.getStatus().toString())
                .highlightedText(highlighted)
                .build();
    }

    private GlobalSearchResponse.JobOpeningSearchResult mapJobOpeningToResult(Opening opening, String query) {
        String highlighted = highlightMatch(
            String.format("%s - %s", opening.getTitle(), opening.getDepartment()),
            query
        );
        
        return GlobalSearchResponse.JobOpeningSearchResult.builder()
                .id(opening.getId())
                .title(opening.getTitle())
                .department(opening.getDepartment())
                .location(opening.getLocation())
                .skills(opening.getSkills())
                .maxSalary(opening.getMaxSalary())
                .status(opening.getStatus().toString())
                .highlightedText(highlighted)
                .build();
    }

    private GlobalSearchResponse.HRUserSearchResult mapUserToResult(User user, String query) {
        String highlighted = highlightMatch(
            String.format("%s - %s", user.getFullName(), user.getEmail()),
            query
        );
        
        return GlobalSearchResponse.HRUserSearchResult.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .phone(user.getPhone())
                .highlightedText(highlighted)
                .build();
    }

    private String highlightMatch(String text, String query) {
        if (text == null || query == null) return text;
        
        String lowerText = text.toLowerCase();
        String lowerQuery = query.toLowerCase();
        
        int index = lowerText.indexOf(lowerQuery);
        if (index >= 0) {
            String before = text.substring(0, index);
            String match = text.substring(index, index + query.length());
            String after = text.substring(index + query.length());
            return before + "<mark>" + match + "</mark>" + after;
        }
        
        return text;
    }

    private Sort getSort(String sortBy, String sortDirection) {
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        switch (sortBy) {
            case "date":
                return Sort.by(direction, "createdAt");
            case "name":
                return Sort.by(direction, "firstName", "lastName");
            default:
                return Sort.by(direction, "createdAt"); // Default to relevance (newest first)
        }
    }

    public java.util.Map<String, Object> advancedCandidateSearch(
            String query, 
            java.util.Map<String, Object> filters, 
            String sortBy, 
            int page, 
            int limit, 
            User currentUser) {
        
        long startTime = System.currentTimeMillis();
        
        try {
            System.out.println("🔍 Advanced Search - Query: " + query + ", Filters: " + filters.keySet());
            
            // Build specifications based on filters
            org.springframework.data.jpa.domain.Specification<Candidate> spec = 
                org.springframework.data.jpa.domain.Specification.where(null);
            
            // Apply HR filter for non-admin users
            if (currentUser != null && currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
                spec = spec.and((root, criteriaQuery, criteriaBuilder) -> 
                    criteriaBuilder.equal(root.get("sourceHrId"), currentUser.getId()));
            }
        
            // Apply text query - search across multiple fields
            if (query != null && !query.trim().isEmpty()) {
                String searchQuery = "%" + query.toLowerCase() + "%";
                spec = spec.and((root, criteriaQuery, criteriaBuilder) -> 
                    criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("skills")), searchQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("profile")), searchQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("company")), searchQuery)
                    ));
            }
            
            // ============ LOCATION FILTERS ============
            // Current location filter
            if (filters.containsKey("currentLocations")) {
                List<String> locations = (List<String>) filters.get("currentLocations");
                if (locations != null && !locations.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                        for (String loc : locations) {
                            predicates.add(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), "%" + loc.toLowerCase() + "%")
                            );
                        }
                        return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                    });
                }
            }
            
            // Preferred location - map to location field (since DB doesn't have separate preferred location)
            if (filters.containsKey("preferredLocations")) {
                List<String> preferredLocs = (List<String>) filters.get("preferredLocations");
                if (preferredLocs != null && !preferredLocs.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                        for (String loc : preferredLocs) {
                            predicates.add(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), "%" + loc.toLowerCase() + "%")
                            );
                        }
                        return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                    });
                }
            }
            
            // ============ SKILLS FILTER ============
            if (filters.containsKey("primarySkills")) {
                List<String> skills = (List<String>) filters.get("primarySkills");
                String matchType = (String) filters.getOrDefault("skillMatchType", "ANY");
                
                if (skills != null && !skills.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        if ("ALL".equals(matchType)) {
                            // Match ALL skills - all must be present
                            List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                            for (String skill : skills) {
                                predicates.add(
                                    criteriaBuilder.like(criteriaBuilder.lower(root.get("skills")), "%" + skill.toLowerCase() + "%")
                                );
                            }
                            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                        } else {
                            // Match ANY skill - at least one must be present
                            List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                            for (String skill : skills) {
                                predicates.add(
                                    criteriaBuilder.like(criteriaBuilder.lower(root.get("skills")), "%" + skill.toLowerCase() + "%")
                                );
                            }
                            return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                        }
                    });
                }
            }
            
            // Secondary skills filter
            if (filters.containsKey("secondarySkills")) {
                List<String> secondarySkills = (List<String>) filters.get("secondarySkills");
                if (secondarySkills != null && !secondarySkills.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                        for (String skill : secondarySkills) {
                            predicates.add(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("skills")), "%" + skill.toLowerCase() + "%")
                            );
                        }
                        return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                    });
                }
            }
            
            // ============ EDUCATION FILTERS ============
            // Qualification filter
            if (filters.containsKey("qualification")) {
                String qualification = (String) filters.get("qualification");
                if (qualification != null && !qualification.trim().isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> 
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("degree")), "%" + qualification.toLowerCase() + "%")
                    );
                }
            }
            
            // Passing year range filter
            if (filters.containsKey("minPassingYear") || filters.containsKey("maxPassingYear")) {
                Integer minYear = filters.containsKey("minPassingYear") ? 
                    ((Number) filters.get("minPassingYear")).intValue() : null;
                Integer maxYear = filters.containsKey("maxPassingYear") ? 
                    ((Number) filters.get("maxPassingYear")).intValue() : null;
                
                if (minYear != null || maxYear != null) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        if (minYear != null && maxYear != null) {
                            return criteriaBuilder.between(root.get("passingYear"), minYear, maxYear);
                        } else if (minYear != null) {
                            return criteriaBuilder.greaterThanOrEqualTo(root.get("passingYear"), minYear);
                        } else {
                            return criteriaBuilder.lessThanOrEqualTo(root.get("passingYear"), maxYear);
                        }
                    });
                }
            }
            
            // ============ COMPANY FILTER ============
            if (filters.containsKey("company")) {
                String company = (String) filters.get("company");
                if (company != null && !company.trim().isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> 
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("company")), "%" + company.toLowerCase() + "%")
                    );
                }
            }
            
            // ============ PROFILE FILTER ============
            if (filters.containsKey("profile")) {
                String profile = (String) filters.get("profile");
                if (profile != null && !profile.trim().isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> 
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("profile")), "%" + profile.toLowerCase() + "%")
                    );
                }
            }
            
            // ============ SPECIALIZATION FILTER ============
            if (filters.containsKey("specialization")) {
                String specialization = (String) filters.get("specialization");
                if (specialization != null && !specialization.trim().isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> 
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("specialization")), "%" + specialization.toLowerCase() + "%")
                    );
                }
            }
            
            // ============ STATUS FILTER ============
            if (filters.containsKey("applicationStatus")) {
                List<String> statuses = (List<String>) filters.get("applicationStatus");
                if (statuses != null && !statuses.isEmpty()) {
                    // Convert string status to enum values
                    List<String> enumStatuses = statuses.stream()
                        .map(String::toUpperCase)
                        .collect(java.util.stream.Collectors.toList());
                    
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> 
                        root.get("status").as(String.class).in(enumStatuses)
                    );
                }
            }
            
            // ============ EXPERIENCE LEVEL FILTER ============
            if (filters.containsKey("experienceLevel")) {
                List<String> experienceLevels = (List<String>) filters.get("experienceLevel");
                if (experienceLevels != null && !experienceLevels.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                        for (String level : experienceLevels) {
                            predicates.add(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("experienceLevel")), "%" + level.toLowerCase() + "%")
                            );
                        }
                        return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                    });
                }
            }
            
            // ============ NOTICE PERIOD FILTER ============
            if (filters.containsKey("noticePeriod")) {
                List<String> noticePeriods = (List<String>) filters.get("noticePeriod");
                if (noticePeriods != null && !noticePeriods.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                        for (String period : noticePeriods) {
                            predicates.add(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("noticePeriod")), "%" + period.toLowerCase() + "%")
                            );
                        }
                        return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                    });
                }
            }
            
            // ============ DEGREE FILTER ============
            if (filters.containsKey("degree")) {
                List<String> degrees = (List<String>) filters.get("degree");
                if (degrees != null && !degrees.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                        for (String degree : degrees) {
                            // Search in both degree field and education JSON
                            predicates.add(criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("degree")), "%" + degree.toLowerCase() + "%"),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("education")), "%" + degree.toLowerCase() + "%")
                            ));
                        }
                        return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                    });
                }
            }
            
            // ============ EDUCATION GAP FILTER ============
            if (filters.containsKey("educationGap")) {
                List<String> educationGaps = (List<String>) filters.get("educationGap");
                if (educationGaps != null && !educationGaps.isEmpty()) {
                    spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                        List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
                        for (String gap : educationGaps) {
                            predicates.add(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("educationGap")), "%" + gap.toLowerCase() + "%")
                            );
                        }
                        return criteriaBuilder.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
                    });
                }
            }
            
            // ============ EXTRACT IN-MEMORY FILTER PARAMETERS ============
            // Experience filter - will be applied in-memory due to string storage
            Double targetExp = null;
            if (filters.containsKey("minExperience")) {
                targetExp = ((Number) filters.get("minExperience")).doubleValue();
            }
            final Double finalTargetExp = targetExp;
            
            // CTC filters - will be applied in-memory due to string storage
            Integer minCurrentCTC = null;
            Integer maxCurrentCTC = null;
            Integer minExpectedCTC = null;
            Integer maxExpectedCTC = null;
            
            if (filters.containsKey("minCurrentCTC")) {
                minCurrentCTC = ((Number) filters.get("minCurrentCTC")).intValue();
            }
            if (filters.containsKey("maxCurrentCTC")) {
                maxCurrentCTC = ((Number) filters.get("maxCurrentCTC")).intValue();
            }
            if (filters.containsKey("minExpectedCTC")) {
                minExpectedCTC = ((Number) filters.get("minExpectedCTC")).intValue();
            }
            if (filters.containsKey("maxExpectedCTC")) {
                maxExpectedCTC = ((Number) filters.get("maxExpectedCTC")).intValue();
            }
            
            final Integer finalMinCurrentCTC = minCurrentCTC;
            final Integer finalMaxCurrentCTC = maxCurrentCTC;
            final Integer finalMinExpectedCTC = minExpectedCTC;
            final Integer finalMaxExpectedCTC = maxExpectedCTC;
            
            // ============ BUILD SORT ============
            Sort sort = Sort.by(Sort.Direction.DESC, "updatedAt");
            
            if ("latest".equals(sortBy)) {
                sort = Sort.by(Sort.Direction.DESC, "updatedAt");
            } else if ("experienceHigh".equals(sortBy)) {
                sort = Sort.by(Sort.Direction.DESC, "experience");
            } else if ("experienceLow".equals(sortBy)) {
                sort = Sort.by(Sort.Direction.ASC, "experience");
            } else if ("salaryHigh".equals(sortBy)) {
                sort = Sort.by(Sort.Direction.DESC, "currentPackage");
            } else if ("name".equals(sortBy)) {
                sort = Sort.by(Sort.Direction.ASC, "firstName", "lastName");
            }
            
            // ============ EXECUTE QUERY ============
            // Check if we need in-memory filtering
            boolean needsInMemoryFiltering = (finalTargetExp != null || 
                           finalMinCurrentCTC != null || finalMaxCurrentCTC != null ||
                           finalMinExpectedCTC != null || finalMaxExpectedCTC != null);
            
            List<Candidate> allFilteredCandidates;
            long totalFiltered;
            
            if (needsInMemoryFiltering) {
                // Fetch ALL matching candidates for accurate pagination
                PageRequest allResultsRequest = PageRequest.of(0, Integer.MAX_VALUE, sort);
                org.springframework.data.domain.Page<Candidate> allResults = 
                    candidateRepository.findAll(spec, allResultsRequest);
                
                System.out.println("📊 Database returned: " + allResults.getContent().size() + " candidates for in-memory filtering");
                
                // ============ APPLY IN-MEMORY FILTERS ============
                allFilteredCandidates = allResults.getContent().stream()
                .filter(candidate -> {
                    // Experience filter - exact matching with very small tolerance
                    if (finalTargetExp != null) {
                        String expStr = candidate.getExperience();
                        if (expStr == null || expStr.trim().isEmpty()) return false;
                        
                        try {
                            double candidateExp = parseExperienceString(expStr);
                            
                            // Use exact matching with very small tolerance for decimal precision
                            double tolerance = 0.05; // Allow ±0.05 years difference for exact matching
                            double difference = Math.abs(candidateExp - finalTargetExp);
                            
                            System.out.println("Experience Filter: Candidate=" + candidateExp + ", Target=" + finalTargetExp + ", Difference=" + difference + ", Tolerance=" + tolerance);
                            
                            if (difference > tolerance) return false;
                        } catch (Exception e) {
                            System.out.println("Error parsing experience: '" + expStr + "' - " + e.getMessage());
                            // Don't filter out candidates with parsing errors, just log them
                        }
                    }
                    
                    // Current CTC filter
                    if (finalMinCurrentCTC != null || finalMaxCurrentCTC != null) {
                        String ctcStr = candidate.getCurrentPackage();
                        if (ctcStr != null && !ctcStr.trim().isEmpty()) {
                            try {
                                String numStr = ctcStr.replaceAll("[^0-9.]", "");
                                if (!numStr.isEmpty()) {
                                    double ctc = Double.parseDouble(numStr);
                                    if (finalMinCurrentCTC != null && ctc < finalMinCurrentCTC) return false;
                                    if (finalMaxCurrentCTC != null && ctc > finalMaxCurrentCTC) return false;
                                }
                            } catch (Exception e) {
                                // If parsing fails, include the candidate
                            }
                        }
                    }
                    
                    // Expected CTC filter
                    if (finalMinExpectedCTC != null || finalMaxExpectedCTC != null) {
                        String expectedStr = candidate.getExpectedCTC();
                        if (expectedStr != null && !expectedStr.trim().isEmpty()) {
                            try {
                                String numStr = expectedStr.replaceAll("[^0-9.]", "");
                                if (!numStr.isEmpty()) {
                                    double expectedCtc = Double.parseDouble(numStr);
                                    if (finalMinExpectedCTC != null && expectedCtc < finalMinExpectedCTC) return false;
                                    if (finalMaxExpectedCTC != null && expectedCtc > finalMaxExpectedCTC) return false;
                                }
                            } catch (Exception e) {
                                // If parsing fails, include the candidate
                            }
                        }
                    }
                    
                    return true;
                })
                .collect(java.util.stream.Collectors.toList());
                
                totalFiltered = allFilteredCandidates.size();
                
                // Apply pagination for in-memory filtered results
                int skipCount = (page - 1) * limit;
                System.out.println("📄 In-memory Pagination: page=" + page + ", limit=" + limit + ", skipCount=" + skipCount + ", totalFiltered=" + totalFiltered);
                
                List<Candidate> paginatedCandidates = allFilteredCandidates.stream()
                    .skip(skipCount)
                    .limit(limit)
                    .collect(java.util.stream.Collectors.toList());
                    
                allFilteredCandidates = paginatedCandidates;
            } else {
                // No in-memory filtering needed - use database pagination directly
                PageRequest pageRequest = PageRequest.of(page - 1, limit, sort);
                org.springframework.data.domain.Page<Candidate> resultPage = 
                    candidateRepository.findAll(spec, pageRequest);
                
                System.out.println("📊 Database pagination: page=" + page + ", limit=" + limit + ", returned=" + resultPage.getContent().size() + ", total=" + resultPage.getTotalElements());
                
                allFilteredCandidates = resultPage.getContent();
                totalFiltered = resultPage.getTotalElements();
            }
            
            int totalPagesCalc = (int) Math.ceil((double) totalFiltered / limit);
            System.out.println("✅ Results: Showing " + allFilteredCandidates.size() + " candidates on page " + page + " of " + totalPagesCalc + " total pages");
            
            // ============ MAP RESULTS ============
            List<java.util.Map<String, Object>> results = allFilteredCandidates.stream()
                .map(this::mapCandidateToMap)
                .collect(java.util.stream.Collectors.toList());
            
            // ============ BUILD RESPONSE ============
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("results", results);
            response.put("totalCount", totalFiltered);
            response.put("page", page);
            response.put("totalPages", Math.max(1, totalPagesCalc));
            response.put("executionTime", System.currentTimeMillis() - startTime);
            
            System.out.println("⏱️  Search completed in " + (System.currentTimeMillis() - startTime) + "ms");
            
            return response;
        } catch (Exception e) {
            System.err.println("Error in advancedCandidateSearch: " + e.getMessage());
            e.printStackTrace();
            
            // Return empty results on error
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("results", new java.util.ArrayList<>());
            errorResponse.put("totalCount", 0);
            errorResponse.put("page", page);
            errorResponse.put("totalPages", 0);
            errorResponse.put("error", e.getMessage());
            errorResponse.put("executionTime", System.currentTimeMillis() - startTime);
            
            return errorResponse;
        }
    }
    
    private java.util.Map<String, Object> mapCandidateToMap(Candidate candidate) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", candidate.getId());
        map.put("firstName", candidate.getFirstName());
        map.put("lastName", candidate.getLastName());
        map.put("email", candidate.getEmail());
        map.put("phone", candidate.getPhone());
        map.put("profile", candidate.getProfile());
        map.put("company", candidate.getCompany());
        map.put("experience", candidate.getExperience());
        map.put("currentPackage", candidate.getCurrentPackage());
        map.put("expectedCTC", candidate.getExpectedCTC());
        map.put("location", candidate.getLocation());
        map.put("noticePeriod", ""); // Field doesn't exist in Candidate model
        map.put("primarySkills", candidate.getSkills());
        map.put("status", candidate.getStatus() != null ? candidate.getStatus().toString() : "PENDING");
        map.put("isVerified", false); // Field doesn't exist in Candidate model
        map.put("updatedAt", candidate.getUpdatedAt());
        return map;
    }
}
