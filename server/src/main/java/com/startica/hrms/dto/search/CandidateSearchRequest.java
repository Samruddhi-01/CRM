package com.startica.hrms.dto.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

/**
 * Advanced search request for Candidates
 * Supports complex filtering with AND/OR logic
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CandidateSearchRequest extends BaseSearchRequest {
    
    // Text Search Fields
    private String name;
    private String email;
    private String phone;
    
    // Skill Filters
    private List<String> primarySkills; // OR logic: any of these
    private List<String> secondarySkills; // OR logic
    private SkillMatchMode skillMatchMode = SkillMatchMode.ANY; // ANY or ALL
    
    // Experience Range
    private BigDecimal minExperience;
    private BigDecimal maxExperience;
    
    // CTC Range
    private BigDecimal currentCtcMin;
    private BigDecimal currentCtcMax;
    private BigDecimal expectedCtcMin;
    private BigDecimal expectedCtcMax;
    
    // Notice Period
    private Integer maxNoticePeriodDays;
    
    // Location Filters
    private List<String> currentLocations; // OR logic
    private List<String> preferredLocations; // OR logic
    
    // Status Filters
    private List<CandidateStatus> statuses; // OR logic
    
    // Source Filters
    private List<String> sources; // OR logic
    
    // Creator Filter
    private List<Long> createdByHrIds; // OR logic
    
    // Advanced Options
    private Boolean includeOnNoticePeriod; // null = all, true = yes, false = no
    private Boolean willingToRelocate;
    
    public enum SkillMatchMode {
        ANY,  // Candidate has ANY of the specified skills (OR)
        ALL   // Candidate has ALL of the specified skills (AND)
    }
    
    public enum CandidateStatus {
        NEW,
        SCREENING,
        INTERVIEWED,
        SELECTED,
        REJECTED,
        ON_HOLD,
        OFFERED,
        JOINED
    }
}
