package com.startica.privateapp.opening.dto;

import com.startica.privateapp.opening.model.OpeningStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpeningResponse {
    private Long id;
    private String title;
    private String department;
    private String location;
    private String type;
    private Integer positions;
    private String experience;
    private String minSalary;
    private String maxSalary;
    private String skills;
    private String description;
    private String responsibilities;
    private String requirements;
    private OpeningStatus status;
    private Integer applicationsCount;
    private Long createdBy;
    private Long updatedBy;
    private String createdByName;
    private String updatedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
