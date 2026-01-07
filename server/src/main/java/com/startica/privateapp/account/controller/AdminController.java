package com.startica.privateapp.account.controller;

import com.startica.privateapp.account.dto.CreateHRRequest;
import com.startica.privateapp.account.dto.HRResponse;
import com.startica.privateapp.account.dto.UpdateHRRequest;
import com.startica.privateapp.account.service.AccountService;
import com.startica.privateapp.analytics.dto.DashboardMetricsResponse;
import com.startica.privateapp.analytics.dto.HRPerformanceResponse;
import com.startica.privateapp.analytics.service.AnalyticsService;
import com.startica.privateapp.audit.dto.CandidateHistoryResponse;
import com.startica.privateapp.audit.service.AuditService;
import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.common.response.PageResponse;
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
import java.util.Map;
import com.startica.privateapp.candidate.service.CandidateService;


@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AccountService accountService;
    private final AnalyticsService analyticsService;
    private final AuditService auditService;

    // HR Management Endpoints

    @GetMapping("/hr")
    public ResponseEntity<ApiResponse<List<HRResponse>>> getAllHR() {
        List<HRResponse> hrList = accountService.getAllHR();
        return ResponseEntity.ok(ApiResponse.success(hrList));
    }

    @GetMapping("/hr/paginated")
    public ResponseEntity<ApiResponse<PageResponse<HRResponse>>> getAllHRPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<HRResponse> hrPage = accountService.getAllHRPaginated(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(hrPage)));
    }

    @GetMapping("/hr/{id}")
    public ResponseEntity<ApiResponse<HRResponse>> getHRById(@PathVariable Long id) {
        HRResponse hr = accountService.getHRById(id);
        return ResponseEntity.ok(ApiResponse.success(hr));
    }

    @PostMapping("/hr")
    public ResponseEntity<ApiResponse<HRResponse>> createHR(@Valid @RequestBody CreateHRRequest request) {
        HRResponse hr = accountService.createHR(request);
        return ResponseEntity.ok(ApiResponse.success("HR user created successfully", hr));
    }

    @PutMapping("/hr/{id}")
    public ResponseEntity<ApiResponse<HRResponse>> updateHR(
            @PathVariable Long id,
            @Valid @RequestBody UpdateHRRequest request) {
        HRResponse hr = accountService.updateHR(id, request);
        return ResponseEntity.ok(ApiResponse.success("HR user updated successfully", hr));
    }

    @PatchMapping("/hr/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateHRStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        accountService.activateDeactivateHR(id, active);
        String message = active ? "HR user activated successfully" : "HR user deactivated successfully";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }

    // Analytics Endpoints

    @GetMapping("/metrics/overview")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getOverviewMetrics() {
        DashboardMetricsResponse metrics = analyticsService.getOverviewMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/metrics/monthly")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getMonthlyStatistics() {
        Map<String, Long> stats = analyticsService.getMonthlyStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    @GetMapping("/metrics/weekly")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getWeeklyStatistics() {
        Map<String, Long> stats = analyticsService.getWeeklyStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }


    @GetMapping("/metrics/hr-performance")
    public ResponseEntity<ApiResponse<List<HRPerformanceResponse>>> getHRPerformance() {
        List<HRPerformanceResponse> performance = analyticsService.getHRPerformance();
        return ResponseEntity.ok(ApiResponse.success(performance));
    }

    // Audit Logs

    @GetMapping("/audit")
    public ResponseEntity<ApiResponse<PageResponse<CandidateHistoryResponse>>> getAuditLogs(
            @RequestParam(required = false) Long actorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        Page<CandidateHistoryResponse> auditLogs;
        if (actorId != null) {
            auditLogs = auditService.getAuditLogsByActor(actorId, pageable);
        } else {
            // Return all audit logs - you'll need to add this method to AuditService
            auditLogs = Page.empty();
        }

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(auditLogs)));
    }
}

