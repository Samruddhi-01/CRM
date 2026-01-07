package com.startica.privateapp.candidate.dto;

import com.startica.privateapp.model.Candidate.CandidateStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkStatusUpdateRequest {

    @NotEmpty(message = "Candidate IDs list cannot be empty")
    private List<Long> candidateIds;

    @NotNull(message = "Status is required")
    private CandidateStatus status;

    private String comment;
}

