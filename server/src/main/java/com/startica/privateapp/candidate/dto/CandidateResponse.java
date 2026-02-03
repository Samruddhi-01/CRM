package com.startica.privateapp.candidate.dto;

import com.startica.privateapp.model.Candidate.CandidateStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String location;
    private String company;
    private String profile;
    private String degree;
    private Integer passingYear;
    private Float percentage;
    private String experience;
    private String currentPackage;
    private String expectedCTC;
    private String gap;
    private String skills;
    private String resumeUrl;
    private CandidateStatus status;
    private Long sourceHrId;
    private String sourceHrName;
    private String notes;
    private String hrRemark;
    private String adminRemark;
    private String employmentHistory;
    private String education;
    private String experienceLevel;
    private String noticePeriod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

