package com.startica.privateapp.dto;

import com.startica.privateapp.model.Candidate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for HR Candidate Details
 * Used in both Admin HR Performance view and HR's own candidate management
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HRCandidateDTO {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String company;
    private String profile;
    private String degree;
    private Integer passingYear;
    private String experience;
    private String currentPackage;
    private String expectedCTC;
    private String gap;
    private String skills;
    private String resumeUrl;
    private Candidate.CandidateStatus status;
    private String statusLabel;
    private Long sourceHrId;
    private String sourceHrName;
    private String notes;
    private String hrRemark;
    private String adminRemark; // Only visible to ADMIN
    @Builder.Default
    private List<String> appliedOpenings = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
