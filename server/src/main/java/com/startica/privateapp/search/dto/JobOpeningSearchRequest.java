package com.startica.privateapp.search.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class JobOpeningSearchRequest {
    // Text search
    private String textQuery;
    
    // Basic filters
    private List<String> titles;
    private List<String> departments;
    private List<String> types; // Full-Time, Part-Time, Contract, etc.
    
    // Location
    private List<String> locations;
    
    // Experience
    private String minExperience;
    private String maxExperience;
    
    // Salary Range
    private String minSalary;
    private String maxSalary;
    
    // Skills
    private List<String> skills;
    
    // Status
    private List<String> statuses; // ACTIVE, CLOSED, ON_HOLD
    
    // Date Range
    private LocalDate createdFrom;
    private LocalDate createdTo;
    
    // Created By
    private Long createdByHrId;
    
    // Pagination & Sorting
    private int page = 0;
    private int size = 20;
    private String sortBy = "createdAt"; // createdAt, title, department, maxSalary
    private String sortDirection = "DESC"; // ASC, DESC
}
