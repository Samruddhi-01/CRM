package com.startica.privateapp.search.service;

import com.startica.privateapp.model.User;
import com.startica.privateapp.search.dto.JobOpeningSearchRequest;
import com.startica.privateapp.search.dto.SearchResultPage;
import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.opening.repository.OpeningRepository;
import com.startica.privateapp.search.specification.JobOpeningSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobOpeningSearchService {

    private final OpeningRepository openingRepository;

    @SuppressWarnings("null")
    public SearchResultPage<Opening> advancedSearch(JobOpeningSearchRequest request, User currentUser) {
        long startTime = System.currentTimeMillis();
        
        log.info("Advanced opening search for user: {} with role: {}", currentUser.getId(), currentUser.getRole());
        
        // For HR users, filter by their own openings only
        if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
            request.setCreatedByHrId(currentUser.getId());
            log.info("HR user filtering: showing only openings created by HR ID: {}", currentUser.getId());
        }
        
        // Build specification
        Specification<Opening> spec = JobOpeningSpecification.buildSpecification(request);
        
        // Build pagination and sorting
        Sort sort = getSort(request.getSortBy(), request.getSortDirection());
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        // Execute query
        Page<Opening> page = openingRepository.findAll(spec, pageRequest);
        
        long searchTime = System.currentTimeMillis() - startTime;
        log.info("Advanced opening search completed in {}ms, found {} results", searchTime, page.getTotalElements());
        
        // Build result
        return SearchResultPage.of(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            request.getTextQuery(),
            searchTime
        );
    }

    private Sort getSort(String sortBy, String sortDirection) {
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        if (sortBy == null) {
            sortBy = "createdAt";
        }
        
        switch (sortBy) {
            case "title":
                return Sort.by(direction, "title");
            case "department":
                return Sort.by(direction, "department");
            case "maxSalary":
                return Sort.by(direction, "maxSalary");
            case "status":
                return Sort.by(direction, "status");
            case "createdAt":
            default:
                return Sort.by(direction, "createdAt");
        }
    }
}
