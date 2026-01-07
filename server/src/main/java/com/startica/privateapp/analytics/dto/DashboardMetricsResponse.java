package com.startica.privateapp.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsResponse {
    private Long totalCandidates;
    private Long interestedCount;
    private Long notInterestedCount;
    private Long pendingCount;
    private Long contactedCount;
    private Long offeredCount;
    private Long hiredCount;
    private Long tellLaterCount;
    private Long candidatesThisMonth;
    private Map<String, Long> hrContributions;
    private Map<String, Long> monthlyStatistics;
    private Map<String, Long> experienceDistribution;
    private Map<String, Long> hrPerformanceOverview;
}

