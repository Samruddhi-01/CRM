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
public class HRPerformanceResponse {
    private Long hrId;
    private String hrName;
    private Long totalCandidates;
    private Map<String, Long> statusBreakdown;
}

