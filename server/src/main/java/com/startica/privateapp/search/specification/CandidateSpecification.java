package com.startica.privateapp.search.specification;

import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.search.dto.CandidateSearchRequest;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class CandidateSpecification {

    public static Specification<Candidate> buildSpecification(CandidateSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Text search (name, email, phone, skills)
            if (request.getTextQuery() != null && !request.getTextQuery().trim().isEmpty()) {
                String searchPattern = "%" + request.getTextQuery().toLowerCase() + "%";
                Predicate textPredicate = criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("skills")), searchPattern)
                );
                predicates.add(textPredicate);
            }

            // Primary Skills
            if (request.getPrimarySkills() != null && !request.getPrimarySkills().isEmpty()) {
                List<Predicate> skillPredicates = new ArrayList<>();
                for (String skill : request.getPrimarySkills()) {
                    skillPredicates.add(
                        criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("skills")),
                            "%" + skill.toLowerCase() + "%"
                        )
                    );
                }
                
                if ("ANY".equals(request.getPrimarySkillsMatchType())) {
                    predicates.add(criteriaBuilder.or(skillPredicates.toArray(new Predicate[0])));
                } else {
                    predicates.add(criteriaBuilder.and(skillPredicates.toArray(new Predicate[0])));
                }
            }

            // Experience filtering is handled in-memory in GlobalSearchService due to string storage
            // Skipping JPA criteria for experience as it's stored as String in database

            // Current Package Range
            if (request.getMinCurrentPackage() != null && !request.getMinCurrentPackage().isEmpty()) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("currentPackage"), request.getMinCurrentPackage()));
            }
            if (request.getMaxCurrentPackage() != null && !request.getMaxCurrentPackage().isEmpty()) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("currentPackage"), request.getMaxCurrentPackage()));
            }

            // Expected CTC Range
            if (request.getMinExpectedCTC() != null && !request.getMinExpectedCTC().isEmpty()) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("expectedCTC"), request.getMinExpectedCTC()));
            }
            if (request.getMaxExpectedCTC() != null && !request.getMaxExpectedCTC().isEmpty()) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("expectedCTC"), request.getMaxExpectedCTC()));
            }

            // Locations
            if (request.getLocations() != null && !request.getLocations().isEmpty()) {
                predicates.add(root.get("location").in(request.getLocations()));
            }

            // Statuses
            if (request.getStatuses() != null && !request.getStatuses().isEmpty()) {
                List<Candidate.CandidateStatus> statusEnums = new ArrayList<>();
                for (String status : request.getStatuses()) {
                    try {
                        statusEnums.add(Candidate.CandidateStatus.valueOf(status));
                    } catch (IllegalArgumentException e) {
                        // Skip invalid status
                    }
                }
                if (!statusEnums.isEmpty()) {
                    predicates.add(root.get("status").in(statusEnums));
                }
            }

            // Date Range
            if (request.getCreatedFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), request.getCreatedFrom().atStartOfDay()));
            }
            if (request.getCreatedTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), request.getCreatedTo().atTime(23, 59, 59)));
            }

            // Created By HR
            if (request.getCreatedByHrId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("sourceHrId"), request.getCreatedByHrId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
