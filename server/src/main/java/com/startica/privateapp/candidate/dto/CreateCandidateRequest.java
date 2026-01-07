package com.startica.privateapp.candidate.dto;

import com.startica.privateapp.model.Candidate.CandidateStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCandidateRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
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

