package com.startica.privateapp.candidate.controller;

import com.startica.privateapp.analytics.dto.DashboardMetricsResponse;
import com.startica.privateapp.analytics.service.AnalyticsService;
import com.startica.privateapp.audit.dto.CandidateHistoryResponse;
import com.startica.privateapp.audit.service.AuditService;
import com.startica.privateapp.auth.service.AuthService;
import com.startica.privateapp.candidate.dto.*;
import com.startica.privateapp.candidate.service.CandidateService;
import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.common.response.PageResponse;
import com.startica.privateapp.dto.UpdateAdminRemarkRequest;
import com.startica.privateapp.model.Candidate.CandidateStatus;
import com.startica.privateapp.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('HR', 'ADMIN')")
public class HRController {

    private final CandidateService candidateService;
    private final AnalyticsService analyticsService;
    private final AuditService auditService;
    private final AuthService authService;

    // Candidate CRUD

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<PageResponse<CandidateResponse>>> getCandidates(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CandidateStatus status,
            @RequestParam(required = false) Long sourceHrId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        User currentUser = authService.getCurrentUser();
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CandidateResponse> candidates = candidateService.getCandidates(search, status, sourceHrId, currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(candidates)));
    }

    @GetMapping("/candidates/{id}")
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateById(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        CandidateResponse candidate = candidateService.getCandidateById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(candidate));
    }

    @GetMapping("/candidates/{id}/resume")
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

    @PostMapping("/candidates")
    public ResponseEntity<ApiResponse<CandidateResponse>> createCandidate(@Valid @RequestBody CreateCandidateRequest request) {
        User currentUser = authService.getCurrentUser();
        CandidateResponse candidate = candidateService.createCandidate(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Candidate created successfully", candidate));
    }

    @PutMapping("/candidates/{id}")
    public ResponseEntity<ApiResponse<CandidateResponse>> updateCandidate(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCandidateRequest request) {
        User currentUser = authService.getCurrentUser();
        CandidateResponse candidate = candidateService.updateCandidate(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Candidate updated successfully", candidate));
    }

    @PatchMapping("/candidates/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateCandidateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        User currentUser = authService.getCurrentUser();
        candidateService.updateCandidateStatus(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Candidate status updated successfully", null));
    }

    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCandidate(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        candidateService.deleteCandidate(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Candidate deleted successfully", null));
    }

    @PutMapping("/candidates/{id}/admin-remark")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CandidateResponse>> updateAdminRemark(
            @PathVariable Long id,
            @RequestBody UpdateAdminRemarkRequest request) {
        User currentUser = authService.getCurrentUser();
        CandidateResponse candidate = candidateService.updateAdminRemark(id, request.getAdminRemark(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Admin remark updated successfully", candidate));
    }

    // Bulk Operations

    @PostMapping("/candidates/bulk-status")
    public ResponseEntity<ApiResponse<Void>> bulkUpdateStatus(@Valid @RequestBody BulkStatusUpdateRequest request) {
        User currentUser = authService.getCurrentUser();
        candidateService.bulkUpdateStatus(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Candidate statuses updated successfully", null));
    }

    // HR Dashboard

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getHRMetrics() {
        User currentUser = authService.getCurrentUser();
        DashboardMetricsResponse metrics = analyticsService.getHRMetrics(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }
}

