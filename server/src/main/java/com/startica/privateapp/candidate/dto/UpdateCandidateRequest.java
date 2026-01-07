package com.startica.privateapp.candidate.dto;

import com.startica.privateapp.model.Candidate.CandidateStatus;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCandidateRequest {

    private String firstName;
    private String lastName;

    @Email(message = "Invalid email format")
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
    private CandidateStatus status;
    private String notes;
    private String employmentHistory;
    private String education;
    private String experienceLevel;
    private String noticePeriod;
}

