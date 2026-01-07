package com.startica.privateapp.search.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Data
public class GlobalSearchRequest {
    @NotBlank(message = "Search query is required")
    private String query;
    
    // Entity toggles
    private boolean searchCandidates = true;
    private boolean searchJobOpenings = true;
    private boolean searchHRUsers = false;
    
    // Pagination
    @Min(value = 0, message = "Page must be >= 0")
    private int page = 0;
    
    @Min(value = 1, message = "Size must be >= 1")
    private int size = 10;
    
    // Sorting
    private String sortBy = "relevance"; // relevance, date, name
    private String sortDirection = "DESC"; // ASC, DESC
}
