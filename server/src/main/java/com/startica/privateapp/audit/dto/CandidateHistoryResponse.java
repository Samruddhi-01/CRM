package com.startica.privateapp.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateHistoryResponse {
    private Long id;
    private Long candidateId;
    private String action;
    private String oldValue;
    private String newValue;
    private Long actorId;
    private String actorRole;
    private LocalDateTime timestamp;
}

