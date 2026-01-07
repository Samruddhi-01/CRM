package com.startica.privateapp.reports.service;

import com.startica.privateapp.reports.dto.CandidateReportResponse;
import com.startica.privateapp.reports.dto.HrActivityReportResponse;
import com.startica.privateapp.reports.dto.JobOpeningReportResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

/**
 * Service for exporting reports to CSV format
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReportsExportService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public byte[] exportCandidateReportToCsv(CandidateReportResponse report) {
        log.info("Exporting candidate report to CSV");

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             PrintWriter writer = new PrintWriter(osw)) {

            // Write header
            writer.println("ID,First Name,Last Name,Email,Phone,Status,Active,HR Name,Applications,Created At");

            // Write data
            report.getData().forEach(item -> {
                writer.println(String.join(",",
                        String.valueOf(item.getId()),
                        quote(item.getFirstName()),
                        quote(item.getLastName()),
                        quote(item.getEmail()),
                        quotePhone(item.getPhone()),
                        quote(item.getStatus()),
                        quote(item.getActive() ? "Yes" : "No"),
                        quote(item.getHrName()),
                        String.valueOf(item.getApplicationCount()),
                        quote(item.getCreatedAt() != null ? item.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                ));
            });

            writer.flush();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error exporting candidate report to CSV", e);
            throw new RuntimeException("Failed to export candidate report", e);
        }
    }

    public byte[] exportJobOpeningReportToCsv(JobOpeningReportResponse report) {
        log.info("Exporting job opening report to CSV");

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             PrintWriter writer = new PrintWriter(osw)) {

            // Write header
            writer.println("ID,Title,Department,Location,Positions,Status,HR Name,Applications,Created At");

            // Write data
            report.getData().forEach(item -> {
                writer.println(String.join(",",
                        String.valueOf(item.getId()),
                        quote(item.getTitle()),
                        quote(item.getDepartment()),
                        quote(item.getLocation()),
                        String.valueOf(item.getPositions()),
                        quote(item.getStatus() != null ? item.getStatus().toString() : "N/A"),
                        quote(item.getHrName()),
                        String.valueOf(item.getApplicationCount()),
                        quote(item.getCreatedAt() != null ? item.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                ));
            });

            writer.flush();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error exporting job opening report to CSV", e);
            throw new RuntimeException("Failed to export job opening report", e);
        }
    }

    public byte[] exportHrActivityReportToCsv(HrActivityReportResponse report) {
        log.info("Exporting comprehensive HR activity report to CSV with candidates and openings");

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             PrintWriter writer = new PrintWriter(osw)) {

            // Write Report Title and Summary
            writer.println("HR ACTIVITY COMPREHENSIVE REPORT");
            writer.println();
            writer.println("SUMMARY");
            writer.println("Total HR Users," + report.getSummary().getTotalHrUsers());
            writer.println("Total Candidates Added," + report.getSummary().getTotalCandidatesAdded());
            writer.println("Total Openings Created," + report.getSummary().getTotalOpeningsCreated());
            writer.println("Most Active HR," + quote(report.getSummary().getMostActiveHr()));
            writer.println();
            writer.println();

            // Write detailed data for each HR
            report.getData().forEach(hrItem -> {
                // HR Header Section
                writer.println("==============================================");
                writer.println("HR DETAILS");
                writer.println("==============================================");
                writer.println("Name," + quote(hrItem.getHrName()));
                writer.println("Email," + quote(hrItem.getEmail()));
                writer.println("Status," + quote(hrItem.getActive() != null && hrItem.getActive() ? "Active" : "Inactive"));
                writer.println("Candidates Added," + hrItem.getCandidatesAdded());
                writer.println("Openings Created," + hrItem.getOpeningsCreated());
                writer.println("Applications Managed," + (hrItem.getTotalApplicationsManaged() != null ? hrItem.getTotalApplicationsManaged() : 0));
                writer.println("Last Activity," + quote(hrItem.getLastActivity() != null ? hrItem.getLastActivity().format(DATE_FORMATTER) : "N/A"));
                writer.println();

                // Candidates Section
                if (hrItem.getCandidates() != null && !hrItem.getCandidates().isEmpty()) {
                    writer.println("CANDIDATES ADDED (" + hrItem.getCandidates().size() + ")");
                    writer.println("Candidate ID,First Name,Last Name,Email,Phone,Company,Profile,Experience,Status,Applications,Created At");
                    
                    hrItem.getCandidates().forEach(candidate -> {
                        writer.println(String.join(",",
                                String.valueOf(candidate.getId()),
                                quote(candidate.getFirstName()),
                                quote(candidate.getLastName()),
                                quote(candidate.getEmail()),
                                quotePhone(candidate.getPhone()),
                                quote(candidate.getCompany() != null ? candidate.getCompany() : "N/A"),
                                quote(candidate.getProfile() != null ? candidate.getProfile() : "N/A"),
                                quote(candidate.getExperience() != null ? candidate.getExperience() : "N/A"),
                                quote(candidate.getStatus()),
                                String.valueOf(candidate.getApplicationCount()),
                                quote(candidate.getCreatedAt() != null ? candidate.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                        ));
                    });
                    writer.println();
                } else {
                    writer.println("CANDIDATES ADDED (0)");
                    writer.println("No candidates added in this period");
                    writer.println();
                }

                // Openings Section
                if (hrItem.getOpenings() != null && !hrItem.getOpenings().isEmpty()) {
                    writer.println("OPENINGS CREATED (" + hrItem.getOpenings().size() + ")");
                    writer.println("Opening ID,Job Title,Department,Location,Positions,Status,Applications,Created At");
                    
                    hrItem.getOpenings().forEach(opening -> {
                        writer.println(String.join(",",
                                String.valueOf(opening.getId()),
                                quote(opening.getTitle()),
                                quote(opening.getDepartment()),
                                quote(opening.getLocation()),
                                String.valueOf(opening.getPositions()),
                                quote(opening.getStatus() != null ? opening.getStatus().toString() : "N/A"),
                                String.valueOf(opening.getApplicationCount()),
                                quote(opening.getCreatedAt() != null ? opening.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                        ));
                    });
                    writer.println();
                } else {
                    writer.println("OPENINGS CREATED (0)");
                    writer.println("No openings created in this period");
                    writer.println();
                }

                writer.println();
                writer.println();
            });

            // Footer
            writer.println("==============================================");
            writer.println("END OF REPORT");
            writer.println("Generated at: " + java.time.LocalDateTime.now().format(DATE_FORMATTER));
            writer.println("==============================================");

            writer.flush();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error exporting comprehensive HR activity report to CSV", e);
            throw new RuntimeException("Failed to export HR activity report", e);
        }
    }

    /**
     * Quote a CSV value - wraps in quotes and escapes internal quotes
     * This ensures proper handling in Excel and other CSV readers
     */
    private String quote(String value) {
        if (value == null) {
            return "\"\"";
        }
        // Escape any quotes in the value and wrap in quotes
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    /**
     * Quote phone number with special handling
     * Prepends single quote to prevent Excel from treating it as a number
     */
    private String quotePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return "\"\"";
        }
        // Add single quote prefix to preserve leading zeros and prevent scientific notation
        return "\"'" + phone.replace("\"", "\"\"") + "\"";
    }

    /**
     * Escape CSV values to handle commas, quotes, and newlines (legacy method)
     */
    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        // If value contains comma, quote, or newline, wrap in quotes and escape quotes
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
