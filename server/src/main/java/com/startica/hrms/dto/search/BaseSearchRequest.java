package com.startica.hrms.dto.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;

/**
 * Base search request with common pagination and sorting
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BaseSearchRequest {
    
    // Pagination
    @Min(0)
    private Integer page = 0;
    
    @Min(1)
    @Max(100)
    private Integer size = 20;
    
    // Sorting
    private String sortBy;
    private SortDirection sortDirection = SortDirection.DESC;
    
    // Common filters
    private String textQuery; // Global text search
    private LocalDate createdFrom;
    private LocalDate createdTo;
    private LocalDate updatedFrom;
    private LocalDate updatedTo;
    
    public enum SortDirection {
        ASC, DESC
    }
}
