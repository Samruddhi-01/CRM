package com.startica.privateapp.reports.controller;

import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.opening.model.OpeningStatus;
import com.startica.privateapp.reports.dto.CandidateReportResponse;
import com.startica.privateapp.reports.dto.HrActivityReportResponse;
import com.startica.privateapp.reports.dto.JobOpeningReportResponse;
import com.startica.privateapp.reports.service.ReportsExportService;
import com.startica.privateapp.reports.service.ReportsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Controller for Admin Reports
 * Only accessible by users with ADMIN role
 */
@RestController
@RequestMapping("/admin/reports")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class ReportsController {

    private final ReportsService reportsService;
    private final ReportsExportService exportService;

    /**
     * Get Candidate Report
     * @param dateFrom Filter by created date from
     * @param dateTo Filter by created date to
     * @param active Filter by active status
     * @param hrId Filter by HR who created the candidate
     * @param openingId Filter by job opening
     * @return Candidate report with summary and data
     */
    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<CandidateReportResponse>> getCandidateReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Long hrId,
            @RequestParam(required = false) Long openingId
    ) {
        log.info("Admin requesting candidate report - dateFrom: {}, dateTo: {}, active: {}, hrId: {}, openingId: {}",
                dateFrom, dateTo, active, hrId, openingId);

        CandidateReportResponse report = reportsService.getCandidateReport(
                dateFrom, dateTo, active, hrId, openingId
        );

        return ResponseEntity.ok(ApiResponse.success("Candidate report generated successfully", report));
    }

    /**
     * Get Job Opening Report
     * @param dateFrom Filter by created date from
     * @param dateTo Filter by created date to
     * @param status Filter by opening status
     * @param hrId Filter by HR who created the opening
     * @return Job opening report with summary and data
     */
    @GetMapping("/openings")
    public ResponseEntity<ApiResponse<JobOpeningReportResponse>> getJobOpeningReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(required = false) OpeningStatus status,
            @RequestParam(required = false) Long hrId
    ) {
        log.info("Admin requesting job opening report - dateFrom: {}, dateTo: {}, status: {}, hrId: {}",
                dateFrom, dateTo, status, hrId);

        JobOpeningReportResponse report = reportsService.getJobOpeningReport(
                dateFrom, dateTo, status, hrId
        );

        return ResponseEntity.ok(ApiResponse.success("Job opening report generated successfully", report));
    }

    /**
     * Get HR Activity Report
     * @param dateFrom Filter by activity date from
     * @param dateTo Filter by activity date to
     * @return HR activity report with summary and data
     */
    @GetMapping("/hr-activity")
    public ResponseEntity<ApiResponse<HrActivityReportResponse>> getHrActivityReport(
            @RequestParam(required = false) Long hrId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo
    ) {
        log.info("Admin requesting HR activity report - hrId: {}, dateFrom: {}, dateTo: {}", hrId, dateFrom, dateTo);

        HrActivityReportResponse report = reportsService.getHrActivityReport(hrId, dateFrom, dateTo);

        return ResponseEntity.ok(ApiResponse.success("HR activity report generated successfully", report));
    }

    /**
     * Export Candidate Report as CSV
     */
    @GetMapping("/candidates/export")
    public ResponseEntity<byte[]> exportCandidateReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Long hrId,
            @RequestParam(required = false) Long openingId,
            @RequestParam(defaultValue = "csv") String format
    ) {
        log.info("Admin exporting candidate report as {}", format);

        CandidateReportResponse report = reportsService.getCandidateReport(
                dateFrom, dateTo, active, hrId, openingId
        );

        byte[] csvData = exportService.exportCandidateReportToCsv(report);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "candidate-report.csv");

        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }

    /**
     * Export Job Opening Report as CSV
     */
    @GetMapping("/openings/export")
    public ResponseEntity<byte[]> exportJobOpeningReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(required = false) OpeningStatus status,
            @RequestParam(required = false) Long hrId,
            @RequestParam(defaultValue = "csv") String format
    ) {
        log.info("Admin exporting job opening report as {}", format);

        JobOpeningReportResponse report = reportsService.getJobOpeningReport(
                dateFrom, dateTo, status, hrId
        );

        byte[] csvData = exportService.exportJobOpeningReportToCsv(report);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "job-opening-report.csv");

        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }

    /**
     * Export HR Activity Report as CSV
     */
    @GetMapping("/hr-activity/export")
    public ResponseEntity<byte[]> exportHrActivityReport(
            @RequestParam(required = false) Long hrId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(defaultValue = "csv") String format
    ) {
        log.info("Admin exporting HR activity report as {}", format);

        HrActivityReportResponse report = reportsService.getHrActivityReport(hrId, dateFrom, dateTo);

        byte[] csvData = exportService.exportHrActivityReportToCsv(report);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "hr-activity-report.csv");

        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }
}
