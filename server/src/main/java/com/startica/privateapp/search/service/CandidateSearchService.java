package com.startica.privateapp.search.service;

import com.startica.privateapp.search.dto.CandidateSearchRequest;
import com.startica.privateapp.search.dto.SearchResultPage;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.repository.CandidateRepository;
import com.startica.privateapp.search.specification.CandidateSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateSearchService {

    private final CandidateRepository candidateRepository;

    @SuppressWarnings("null")
    public SearchResultPage<Candidate> advancedSearch(CandidateSearchRequest request, com.startica.privateapp.model.User currentUser) {
        long startTime = System.currentTimeMillis();
        
        // For HR users, filter by their own candidates only
        if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
            request.setCreatedByHrId(currentUser.getId());
        }
        
        // Build specification
        Specification<Candidate> spec = CandidateSpecification.buildSpecification(request);
        
        // Build pagination and sorting
        Sort sort = getSort(request.getSortBy(), request.getSortDirection());
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        // Execute query
        Page<Candidate> page = candidateRepository.findAll(spec, pageRequest);
        
        long searchTime = System.currentTimeMillis() - startTime;
        
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
            case "name":
                return Sort.by(direction, "firstName", "lastName");
            case "experience":
                return Sort.by(direction, "experience");
            case "currentPackage":
                return Sort.by(direction, "currentPackage");
            case "expectedCTC":
                return Sort.by(direction, "expectedCTC");
            case "status":
                return Sort.by(direction, "status");
            case "createdAt":
            default:
                return Sort.by(direction, "createdAt");
        }
    }
}
