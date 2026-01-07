package com.startica.privateapp.reports.dto;

import com.startica.privateapp.opening.model.OpeningStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrActivityReportResponse {
    private HrActivitySummary summary;
    private List<HrActivityItem> data;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HrActivitySummary {
        private Long totalHrUsers;
        private Long totalCandidatesAdded;
        private Long totalOpeningsCreated;
        private String mostActiveHr;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HrActivityItem {
        private Long hrId;
        private String hrName;
        private String email;
        private Long candidatesAdded;
        private Long openingsCreated;
        private Long totalApplicationsManaged;
        private Boolean active;
        private java.time.LocalDateTime lastActivity;
        private List<CandidateDetail> candidates;
        private List<OpeningDetail> openings;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateDetail {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String status;
        private String company;
        private String profile;
        private String experience;
        private Integer applicationCount;
        private java.time.LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpeningDetail {
        private Long id;
        private String title;
        private String department;
        private String location;
        private Integer positions;
        private OpeningStatus status;
        private Integer applicationCount;
        private java.time.LocalDateTime createdAt;
    }
}
