package com.startica.privateapp.candidate.controller;

import com.startica.privateapp.audit.dto.CandidateHistoryResponse;
import com.startica.privateapp.audit.service.AuditService;
import com.startica.privateapp.auth.service.AuthService;
import com.startica.privateapp.candidate.dto.CandidateResponse;
import com.startica.privateapp.candidate.service.CandidateService;
import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('HR', 'ADMIN')")
public class CandidateController {

    private final AuditService auditService;
    private final CandidateService candidateService;
    private final AuthService authService;

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<CandidateHistoryResponse>>> getCandidateHistory(@PathVariable Long id) {
        List<CandidateHistoryResponse> history = auditService.getCandidateHistory(id);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<?> getCandidateResume(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        
        try {
            CandidateResponse candidate = candidateService.getCandidateById(id, currentUser);
            
            if (candidate.getResumeUrl() == null || candidate.getResumeUrl().trim().isEmpty()) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("No resume available for this candidate"));
            }
            
            // Return the resume URL
            return ResponseEntity.ok()
                .body(ApiResponse.success("Resume URL retrieved", 
                    java.util.Map.of("resumeUrl", candidate.getResumeUrl())));
                    
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to retrieve resume: " + e.getMessage()));
        }
    }
}

