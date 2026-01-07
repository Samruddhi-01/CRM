package com.startica.privateapp.opening.dto;

import com.startica.privateapp.opening.model.OpeningStatus;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOpeningRequest {
    private String title;
    private String department;
    private String location;
    private String type;
    
    @Min(value = 1, message = "At least 1 position required")
    private Integer positions;
    
    private String experience;
    private String minSalary;
    private String maxSalary;
    private String skills;
    private String description;
    private String responsibilities;
    private String requirements;
    private OpeningStatus status;
}
