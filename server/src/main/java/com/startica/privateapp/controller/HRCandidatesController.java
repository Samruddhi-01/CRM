package com.startica.privateapp.controller;

import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.dto.*;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.User;
import com.startica.privateapp.service.HRPerformanceService;
import com.startica.privateapp.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * HR Candidates Controller
 * HR ROLE ONLY - Returns only candidates created by the logged-in HR
 * 
 * Endpoints:
 * - GET /api/hr/candidates - Get my candidates (HR's own)
 * - PUT /api/hr/candidates/{candidateId}/hr-remark - Update HR remark
 * - PUT /api/hr/candidates/{candidateId}/status - Update candidate status
 */
@Slf4j
@RestController
@RequestMapping("/api/hr/my-candidates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HR')")
public class HRCandidatesController {

    private final HRPerformanceService hrPerformanceService;
    private final CustomUserDetailsService userDetailsService;

    /**
     * Get my candidates (only candidates created by logged-in HR)
     * Supports pagination, search, and filtering
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<HRCandidateDTO>>> getMyCandidates(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Candidate.CandidateStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        // Get username from authentication and load the actual User entity
        String username = authentication.getName();
        User loggedInUser = userDetailsService.loadUserEntityByUsername(username);
        
        log.info("HR {} (ID: {}) requesting their candidates with params - search: {}, status: {}, page: {}", 
            loggedInUser.getEmail(), loggedInUser.getId(), search, status, page);
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<HRCandidateDTO> candidates = hrPerformanceService.getMyCandidates(
            loggedInUser.getId(), search, status, pageable);
        
        log.info("Retrieved {} candidates for HR {}", candidates.getTotalElements(), loggedInUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Candidates retrieved successfully", candidates));
    }

    /**
     * Update HR remark for own candidate
     */
    @PutMapping("/{candidateId}/hr-remark")
    public ResponseEntity<ApiResponse<HRCandidateDTO>> updateHRRemark(
            Authentication authentication,
            @PathVariable Long candidateId,
            @RequestBody UpdateHRRemarkRequest request) {
        
        String username = authentication.getName();
        User loggedInUser = userDetailsService.loadUserEntityByUsername(username);
        log.info("HR {} updating HR remark for candidate ID: {}", loggedInUser.getEmail(), candidateId);
        
        HRCandidateDTO updated = hrPerformanceService.updateHRRemark(
            candidateId, request.getHrRemark(), loggedInUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("HR remark updated successfully", updated));
    }

    /**
     * Update candidate status for own candidate
     */
    @PutMapping("/{candidateId}/status")
    public ResponseEntity<ApiResponse<HRCandidateDTO>> updateCandidateStatus(
            Authentication authentication,
            @PathVariable Long candidateId,
            @RequestBody UpdateStatusRequest request) {
        
        String username = authentication.getName();
        User loggedInUser = userDetailsService.loadUserEntityByUsername(username);
        log.info("HR {} updating status for candidate ID: {} to {}", 
            loggedInUser.getEmail(), candidateId, request.getStatus());
        
        HRCandidateDTO updated = hrPerformanceService.updateCandidateStatusByHR(
            candidateId, request.getStatus(), loggedInUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Candidate status updated successfully", updated));
    }
}
