package com.startica.privateapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for HR Performance Overview
 * Shows aggregated metrics per HR user for Admin dashboard
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HRPerformanceDTO {
    
    private Long hrId;
    private String fullName;
    private String email;
    private Integer totalCandidates;
    private Integer appliedCount;
    private Integer hiredCount;
    private Integer contactedCount;
    private Integer notContactedCount;
    private Integer interestedCount;
    private Integer pendingCount;
    private LocalDateTime lastActivity;
}
