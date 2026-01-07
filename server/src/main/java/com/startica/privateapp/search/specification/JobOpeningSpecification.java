package com.startica.privateapp.search.specification;

import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.opening.model.OpeningStatus;
import com.startica.privateapp.search.dto.JobOpeningSearchRequest;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class JobOpeningSpecification {

    public static Specification<Opening> buildSpecification(JobOpeningSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Text search (title, department, description)
            if (request.getTextQuery() != null && !request.getTextQuery().trim().isEmpty()) {
                String searchPattern = "%" + request.getTextQuery().toLowerCase() + "%";
                Predicate textPredicate = criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("department")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("skills")), searchPattern)
                );
                predicates.add(textPredicate);
            }

            // Titles
            if (request.getTitles() != null && !request.getTitles().isEmpty()) {
                List<Predicate> titlePredicates = new ArrayList<>();
                for (String title : request.getTitles()) {
                    titlePredicates.add(
                        criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("title")),
                            "%" + title.toLowerCase() + "%"
                        )
                    );
                }
                predicates.add(criteriaBuilder.or(titlePredicates.toArray(new Predicate[0])));
            }

            // Departments
            if (request.getDepartments() != null && !request.getDepartments().isEmpty()) {
                predicates.add(root.get("department").in(request.getDepartments()));
            }

            // Types
            if (request.getTypes() != null && !request.getTypes().isEmpty()) {
                predicates.add(root.get("type").in(request.getTypes()));
            }

            // Locations
            if (request.getLocations() != null && !request.getLocations().isEmpty()) {
                predicates.add(root.get("location").in(request.getLocations()));
            }

            // Skills
            if (request.getSkills() != null && !request.getSkills().isEmpty()) {
                List<Predicate> skillPredicates = new ArrayList<>();
                for (String skill : request.getSkills()) {
                    skillPredicates.add(
                        criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("skills")),
                            "%" + skill.toLowerCase() + "%"
                        )
                    );
                }
                predicates.add(criteriaBuilder.or(skillPredicates.toArray(new Predicate[0])));
            }

            // Experience Range
            if (request.getMinExperience() != null && !request.getMinExperience().isEmpty()) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("experience"), request.getMinExperience()));
            }
            if (request.getMaxExperience() != null && !request.getMaxExperience().isEmpty()) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("experience"), request.getMaxExperience()));
            }

            // Salary Range
            if (request.getMinSalary() != null && !request.getMinSalary().isEmpty()) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("minSalary"), request.getMinSalary()));
            }
            if (request.getMaxSalary() != null && !request.getMaxSalary().isEmpty()) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("maxSalary"), request.getMaxSalary()));
            }

            // Statuses
            if (request.getStatuses() != null && !request.getStatuses().isEmpty()) {
                List<OpeningStatus> statusEnums = new ArrayList<>();
                for (String status : request.getStatuses()) {
                    try {
                        statusEnums.add(OpeningStatus.valueOf(status));
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
                predicates.add(criteriaBuilder.equal(root.get("createdBy"), request.getCreatedByHrId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
