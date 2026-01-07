package com.startica.privateapp.dto;

import com.startica.privateapp.model.Candidate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating Candidate Status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    private Candidate.CandidateStatus status;
}
