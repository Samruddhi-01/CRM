package com.startica.privateapp.opening.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyCandidateRequest {
    
    @NotNull(message = "Candidate ID is required")
    private Long candidateId;
    
    private String notes;
    
    private String applicationStatus; // Optional: APPLIED, REVIEWING, SHORTLISTED, REJECTED, HIRED
}
