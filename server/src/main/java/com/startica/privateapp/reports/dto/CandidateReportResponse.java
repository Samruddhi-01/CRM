package com.startica.privateapp.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateReportResponse {
    private CandidateSummary summary;
    private List<CandidateReportItem> data;
    private List<CandidatesByHr> candidatesByHr;
    private List<CandidatesByOpening> candidatesByOpening;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateSummary {
        private Long totalCandidates;
        private Long activeCandidates;
        private Long inactiveCandidates;
        private Long totalApplications;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateReportItem {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String status;
        private Boolean active;
        private String hrName;
        private Long hrId;
        private Integer applicationCount;
        private java.time.LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidatesByHr {
        private Long hrId;
        private String hrName;
        private Long candidateCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidatesByOpening {
        private Long openingId;
        private String openingTitle;
        private Long candidateCount;
    }
}
