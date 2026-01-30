package com.startica.privateapp.search.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CandidateSearchRequest {
    // Text search
    private String textQuery;
    
    // Skills
    private List<String> primarySkills;
    private String primarySkillsMatchType = "ANY"; // ANY or ALL
    private List<String> secondarySkills;
    private String secondarySkillsMatchType = "ANY";
    
    // Experience
    private String minExperience;
    private String maxExperience;
    
    // Package Ranges
    private String minCurrentPackage;
    private String maxCurrentPackage;
    private String minExpectedCTC;
    private String maxExpectedCTC;
    
    // Education Percentage Range
    private Integer minPercentage;
    private Integer maxPercentage;
    
    // Location
    private List<String> locations;
    
    // Status
    private List<String> statuses; // PENDING, INTERESTED, etc.
    
    // Source
    private List<String> sources;
    
    // Gap
    private String maxGap;
    
    // Date Range
    private LocalDate createdFrom;
    private LocalDate createdTo;
    
    // Created By
    private Long createdByHrId;
    
    // Pagination & Sorting
    private int page = 0;
    private int size = 20;
    private String sortBy = "createdAt"; // createdAt, name, experience, currentPackage
    private String sortDirection = "DESC"; // ASC, DESC
}
