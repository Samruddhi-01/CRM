package com.startica.privateapp.search.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class GlobalSearchResponse {
    private String query;
    private List<CandidateSearchResult> candidateResults;
    private List<JobOpeningSearchResult> jobOpeningResults;
    private List<HRUserSearchResult> hrUserResults;
    private long totalCandidates;
    private long totalJobOpenings;
    private long totalHRUsers;
    private long searchTimeMs;

    @Data
    @Builder
    public static class CandidateSearchResult {
        private Long id;
        private String name;
        private String email;
        private String skills;
        private String experience;
        private String currentPackage;
        private String status;
        private String highlightedText;
    }

    @Data
    @Builder
    public static class JobOpeningSearchResult {
        private Long id;
        private String title;
        private String department;
        private String location;
        private String skills;
        private String maxSalary;
        private String status;
        private String highlightedText;
    }

    @Data
    @Builder
    public static class HRUserSearchResult {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private String highlightedText;
    }
}
