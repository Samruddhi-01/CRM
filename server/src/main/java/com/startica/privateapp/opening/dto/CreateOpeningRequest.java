package com.startica.privateapp.opening.dto;

import com.startica.privateapp.opening.model.OpeningStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOpeningRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String type;
    
    @NotNull(message = "Number of positions is required")
    @Min(value = 1, message = "At least 1 position required")
    private Integer positions;
    
    @NotBlank(message = "Experience requirement is required")
    private String experience;
    
    private String minSalary;
    private String maxSalary;
    private String skills;
    private String description;
    private String responsibilities;
    private String requirements;
    private OpeningStatus status;
}
