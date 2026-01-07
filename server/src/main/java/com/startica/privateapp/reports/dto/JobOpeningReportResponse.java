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
public class JobOpeningReportResponse {
    private OpeningSummary summary;
    private List<OpeningReportItem> data;
    private List<OpeningsByHr> openingsByHr;
    private List<TopOpeningsByApplications> topOpenings;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpeningSummary {
        private Long totalOpenings;
        private Long activeOpenings;
        private Long closedOpenings;
        private Long onHoldOpenings;
        private Long totalApplications;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpeningReportItem {
        private Long id;
        private String title;
        private String department;
        private String location;
        private Integer positions;
        private OpeningStatus status;
        private String hrName;
        private Long hrId;
        private Integer applicationCount;
        private java.time.LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpeningsByHr {
        private Long hrId;
        private String hrName;
        private Long openingCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopOpeningsByApplications {
        private Long openingId;
        private String openingTitle;
        private Long applicationCount;
    }
}
