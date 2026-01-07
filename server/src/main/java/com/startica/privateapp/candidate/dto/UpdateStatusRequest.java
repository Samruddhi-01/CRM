package com.startica.privateapp.candidate.dto;

import com.startica.privateapp.model.Candidate.CandidateStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private CandidateStatus status;

    private String comment;
}

