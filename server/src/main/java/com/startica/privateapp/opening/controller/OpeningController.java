package com.startica.privateapp.opening.controller;

import com.startica.privateapp.auth.service.AuthService;
import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.model.User;
import com.startica.privateapp.opening.dto.ApplyCandidateRequest;
import com.startica.privateapp.opening.dto.CandidateApplicationResponse;
import com.startica.privateapp.opening.dto.CreateOpeningRequest;
import com.startica.privateapp.opening.dto.OpeningResponse;
import com.startica.privateapp.opening.dto.UpdateOpeningRequest;
import com.startica.privateapp.opening.model.OpeningStatus;
import com.startica.privateapp.opening.service.CandidateApplicationService;
import com.startica.privateapp.opening.service.OpeningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/openings")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'HR')")
public class OpeningController {
    
    private final OpeningService openingService;
    private final CandidateApplicationService applicationService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OpeningResponse>>> getAllOpenings(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) OpeningStatus status,
        @RequestParam(required = false) String department,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        User currentUser = authService.getCurrentUser();
        log.info("📥 Openings Search Request:");
        log.info("   Search: '{}' ({})", search, search != null ? "provided" : "null");
        log.info("   Status: {} ({})", status, status != null ? "provided" : "null");
        log.info("   Department: '{}' ({})", department, department != null ? "provided" : "null");
        log.info("   Page: {}, Size: {}, Sort: {} {}", page, size, sortBy, sortDir);
        log.info("   User: {} (Role: {})", currentUser.getEmail(), currentUser.getRole());
        
        Page<OpeningResponse> openings = openingService.getAllOpenings(
            search, status, department, page, size, sortBy, sortDir, currentUser
        );
        
        log.info("✅ Openings Retrieved: {} results (page {}/{})", 
            openings.getTotalElements(), page + 1, openings.getTotalPages());
        
        return ResponseEntity.ok(ApiResponse.success("Openings retrieved successfully", openings));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OpeningResponse>> getOpeningById(@PathVariable Long id) {
        log.info("Fetching opening with id: {}", id);
        OpeningResponse opening = openingService.getOpeningById(id);
        return ResponseEntity.ok(ApiResponse.success("Opening retrieved successfully", opening));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<OpeningResponse>> createOpening(
        @Valid @RequestBody CreateOpeningRequest request
    ) {
        User user = authService.getCurrentUser();
        log.info("Creating new opening: {} by user: {}", request.getTitle(), user.getId());
        OpeningResponse opening = openingService.createOpening(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Opening created successfully", opening));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OpeningResponse>> updateOpening(
        @PathVariable Long id,
        @Valid @RequestBody UpdateOpeningRequest request
    ) {
        User user = authService.getCurrentUser();
        log.info("Updating opening: {} by user: {}", id, user.getId());
        OpeningResponse opening = openingService.updateOpening(id, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Opening updated successfully", opening));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteOpening(
        @PathVariable Long id
    ) {
        User user = authService.getCurrentUser();
        log.info("Deleting opening: {} by user: {}", id, user.getId());
        openingService.deleteOpening(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Opening deleted successfully", "Deleted"));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OpeningResponse>> updateOpeningStatus(
        @PathVariable Long id,
        @RequestParam OpeningStatus status
    ) {
        User user = authService.getCurrentUser();
        log.info("Updating opening status: {} to {} by user: {}", id, status, user.getId());
        OpeningResponse opening = openingService.updateOpeningStatus(id, status, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Opening status updated successfully", opening));
    }
    
    @GetMapping("/by-status/{status}")
    public ResponseEntity<ApiResponse<List<OpeningResponse>>> getOpeningsByStatus(
        @PathVariable OpeningStatus status
    ) {
        User currentUser = authService.getCurrentUser();
        log.info("Fetching openings by status: {}", status);
        List<OpeningResponse> openings = openingService.getOpeningsByStatus(status, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Openings retrieved successfully", openings));
    }
    
    @GetMapping("/by-department/{department}")
    public ResponseEntity<ApiResponse<List<OpeningResponse>>> getOpeningsByDepartment(
        @PathVariable String department
    ) {
        User currentUser = authService.getCurrentUser();
        log.info("Fetching openings by department: {}", department);
        List<OpeningResponse> openings = openingService.getOpeningsByDepartment(department, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Openings retrieved successfully", openings));
    }
    
    @GetMapping("/count/{status}")
    public ResponseEntity<ApiResponse<Long>> countOpeningsByStatus(@PathVariable OpeningStatus status) {
        User currentUser = authService.getCurrentUser();
        log.info("Counting openings by status: {}", status);
        Long count = openingService.countOpeningsByStatus(status, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Count retrieved successfully", count));
    }
    
    // ==================== Candidate Application Endpoints ====================
    
    @PostMapping("/{openingId}/apply")
    public ResponseEntity<ApiResponse<CandidateApplicationResponse>> applyToOpening(
        @PathVariable Long openingId,
        @Valid @RequestBody ApplyCandidateRequest request
    ) {
        User user = authService.getCurrentUser();
        log.info("Applying candidate {} to opening {} by user {}", request.getCandidateId(), openingId, user.getId());
        CandidateApplicationResponse response = applicationService.applyToOpening(openingId, request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Candidate applied successfully", response));
    }
    
    @DeleteMapping("/{openingId}/candidates/{candidateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> removeApplication(
        @PathVariable Long openingId,
        @PathVariable Long candidateId
    ) {
        User user = authService.getCurrentUser();
        log.info("Removing candidate {} from opening {} by user {}", candidateId, openingId, user.getId());
        applicationService.removeApplication(openingId, candidateId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Application removed successfully", "Removed"));
    }
    
    @GetMapping("/{openingId}/applications")
    public ResponseEntity<ApiResponse<Page<CandidateApplicationResponse>>> getOpeningApplications(
        @PathVariable Long openingId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "appliedAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        log.info("Fetching applications for opening {}", openingId);
        Page<CandidateApplicationResponse> applications = applicationService.getOpeningApplications(
            openingId, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", applications));
    }
    
    @GetMapping("/{openingId}/applications/status/{status}")
    public ResponseEntity<ApiResponse<List<CandidateApplicationResponse>>> getApplicationsByStatus(
        @PathVariable Long openingId,
        @PathVariable String status
    ) {
        log.info("Fetching {} applications for opening {}", status, openingId);
        List<CandidateApplicationResponse> applications = applicationService.getApplicationsByStatus(openingId, status);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", applications));
    }
    
    @PatchMapping("/{openingId}/candidates/{candidateId}/status")
    public ResponseEntity<ApiResponse<CandidateApplicationResponse>> updateApplicationStatus(
        @PathVariable Long openingId,
        @PathVariable Long candidateId,
        @RequestParam String status
    ) {
        User user = authService.getCurrentUser();
        log.info("Updating application status for candidate {} in opening {} to {}", candidateId, openingId, status);
        CandidateApplicationResponse response = applicationService.updateApplicationStatus(
            openingId, candidateId, status, user.getId()
        );
        return ResponseEntity.ok(ApiResponse.success("Application status updated successfully", response));
    }
    
    @GetMapping("/{openingId}/applications/count")
    public ResponseEntity<ApiResponse<Long>> countOpeningApplications(@PathVariable Long openingId) {
        log.info("Counting applications for opening {}", openingId);
        long count = applicationService.countOpeningApplications(openingId);
        return ResponseEntity.ok(ApiResponse.success("Count retrieved successfully", count));
    }
    
    @GetMapping("/candidates/{candidateId}/applications")
    public ResponseEntity<ApiResponse<List<CandidateApplicationResponse>>> getCandidateApplications(
        @PathVariable Long candidateId
    ) {
        log.info("Fetching applications for candidate {}", candidateId);
        List<CandidateApplicationResponse> applications = applicationService.getCandidateApplications(candidateId);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", applications));
    }
    
    @GetMapping("/candidates/{candidateId}/openings/{openingId}/check")
    public ResponseEntity<ApiResponse<Boolean>> checkIfApplied(
        @PathVariable Long candidateId,
        @PathVariable Long openingId
    ) {
        log.info("Checking if candidate {} applied to opening {}", candidateId, openingId);
        boolean hasApplied = applicationService.hasApplied(candidateId, openingId);
        return ResponseEntity.ok(ApiResponse.success("Check completed", hasApplied));
    }
}
