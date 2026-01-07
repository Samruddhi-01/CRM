package com.startica.privateapp.controller;

import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.dto.*;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.service.HRPerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin HR Performance Analytics Controller
 * ADMIN ROLE ONLY
 * 
 * Endpoints:
 * - GET /api/admin/hr-performance/overview - Get all HR performance metrics
 * - GET /api/admin/hr-performance/{hrId}/candidates - Get candidates for specific HR
 * - PUT /api/admin/hr-performance/candidates/{candidateId}/admin-remark - Update admin remark
 * - PUT /api/admin/hr-performance/candidates/{candidateId}/status - Update candidate status
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/hr-performance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminHRPerformanceController {

    private final HRPerformanceService hrPerformanceService;

    /**
     * Get HR Performance Overview
     * Returns aggregated metrics for all HR users
     */
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<List<HRPerformanceDTO>>> getHRPerformanceOverview() {
        try {
            log.info("Admin requesting HR performance overview");
            List<HRPerformanceDTO> overview = hrPerformanceService.getHRPerformanceOverview();
            log.info("HR performance overview retrieved: {} HR users found", overview.size());
            return ResponseEntity.ok(ApiResponse.success(overview));
        } catch (Exception e) {
            log.error("Error fetching HR performance overview", e);
            throw e;
        }
    }

    /**
     * Get candidates for a specific HR
     * Supports pagination, search, and filtering
     */
    @GetMapping("/{hrId}/candidates")
    public ResponseEntity<ApiResponse<Page<HRCandidateDTO>>> getHRCandidates(
            @PathVariable Long hrId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Candidate.CandidateStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        log.info("Admin requesting candidates for HR ID: {}", hrId);
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<HRCandidateDTO> candidates = hrPerformanceService.getHRCandidates(hrId, search, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("HR candidates retrieved successfully", candidates));
    }

    /**
     * Update admin remark for a candidate
     */
    @PutMapping("/candidates/{candidateId}/admin-remark")
    public ResponseEntity<ApiResponse<HRCandidateDTO>> updateAdminRemark(
            @PathVariable Long candidateId,
            @RequestBody UpdateAdminRemarkRequest request) {
        
        log.info("Admin updating admin remark for candidate ID: {}", candidateId);
        HRCandidateDTO updated = hrPerformanceService.updateAdminRemark(candidateId, request.getAdminRemark());
        return ResponseEntity.ok(ApiResponse.success("Admin remark updated successfully", updated));
    }

    /**
     * Update candidate status
     */
    @PutMapping("/candidates/{candidateId}/status")
    public ResponseEntity<ApiResponse<HRCandidateDTO>> updateCandidateStatus(
            @PathVariable Long candidateId,
            @RequestBody UpdateStatusRequest request) {
        
        log.info("Admin updating status for candidate ID: {} to {}", candidateId, request.getStatus());
        HRCandidateDTO updated = hrPerformanceService.updateCandidateStatus(candidateId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Candidate status updated successfully", updated));
    }
}
