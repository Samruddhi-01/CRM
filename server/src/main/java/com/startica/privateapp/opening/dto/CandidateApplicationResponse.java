package com.startica.privateapp.opening.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateApplicationResponse {
    
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String candidateSkills;
    private String candidateExperience;
    private Long openingId;
    private String openingTitle;
    private String openingDepartment;
    private String openingLocation;
    private LocalDateTime appliedAt;
    private String applicationStatus;
    private String notes;
    private String appliedByName;
    private LocalDateTime updatedAt;
}
