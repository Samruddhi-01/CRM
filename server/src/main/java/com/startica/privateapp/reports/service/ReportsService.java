package com.startica.privateapp.reports.service;

import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.repository.CandidateRepository;
import com.startica.privateapp.model.Role;
import com.startica.privateapp.model.User;
import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.opening.model.OpeningStatus;
import com.startica.privateapp.opening.repository.CandidateOpeningRepository;
import com.startica.privateapp.opening.repository.OpeningRepository;
import com.startica.privateapp.reports.dto.CandidateReportResponse;
import com.startica.privateapp.reports.dto.HrActivityReportResponse;
import com.startica.privateapp.reports.dto.JobOpeningReportResponse;
import com.startica.privateapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportsService {

    private final CandidateRepository candidateRepository;
    private final OpeningRepository openingRepository;
    private final CandidateOpeningRepository candidateOpeningRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CandidateReportResponse getCandidateReport(
            LocalDateTime dateFrom,
            LocalDateTime dateTo,
            Boolean active,
            Long hrId,
            Long openingId
    ) {
        log.info("Generating candidate report - dateFrom: {}, dateTo: {}, active: {}, hrId: {}, openingId: {}",
                dateFrom, dateTo, active, hrId, openingId);

        // Get all candidates with filters
        List<Candidate> candidates = candidateRepository.findAll();

        // Apply filters
        if (dateFrom != null) {
            candidates = candidates.stream()
                    .filter(c -> c.getCreatedAt() != null && !c.getCreatedAt().isBefore(dateFrom))
                    .collect(Collectors.toList());
        }
        if (dateTo != null) {
            candidates = candidates.stream()
                    .filter(c -> c.getCreatedAt() != null && !c.getCreatedAt().isAfter(dateTo))
                    .collect(Collectors.toList());
        }
        // Note: active filter removed as Candidate model doesn't have active field
        // You can use status field instead if needed
        if (hrId != null) {
            candidates = candidates.stream()
                    .filter(c -> hrId.equals(c.getSourceHrId()))
                    .collect(Collectors.toList());
        }

        // Build summary
        // Note: Using status to determine "active" candidates (not REJECTED/NOT_INTERESTED)
        long activeCandidates = candidates.stream()
                .filter(c -> c.getStatus() != Candidate.CandidateStatus.NOT_INTERESTED)
                .count();
        long inactiveCandidates = candidates.stream()
                .filter(c -> c.getStatus() == Candidate.CandidateStatus.NOT_INTERESTED)
                .count();
        long totalApplications = candidateOpeningRepository.count();

        CandidateReportResponse.CandidateSummary summary = CandidateReportResponse.CandidateSummary.builder()
                .totalCandidates((long) candidates.size())
                .activeCandidates(activeCandidates)
                .inactiveCandidates(inactiveCandidates)
                .totalApplications(totalApplications)
                .build();

        // Build data items
        List<CandidateReportResponse.CandidateReportItem> data = candidates.stream()
                .map(this::mapToCandidateReportItem)
                .collect(Collectors.toList());

        // Group by HR
        Map<Long, Long> candidatesByHrMap = candidates.stream()
                .filter(c -> c.getSourceHrId() != null)
                .collect(Collectors.groupingBy(Candidate::getSourceHrId, Collectors.counting()));

        List<CandidateReportResponse.CandidatesByHr> candidatesByHr = candidatesByHrMap.entrySet().stream()
                .map(entry -> {
                    String hrName = userRepository.findById(entry.getKey())
                            .map(User::getFullName)
                            .orElse("Unknown");
                    return CandidateReportResponse.CandidatesByHr.builder()
                            .hrId(entry.getKey())
                            .hrName(hrName)
                            .candidateCount(entry.getValue())
                            .build();
                })
                .collect(Collectors.toList());

        // Group by opening (if filter applied)
        List<CandidateReportResponse.CandidatesByOpening> candidatesByOpening = List.of();
        if (openingId == null) {
            // Get all openings and their application counts
            candidatesByOpening = openingRepository.findAll().stream()
                    .map(opening -> CandidateReportResponse.CandidatesByOpening.builder()
                            .openingId(opening.getId())
                            .openingTitle(opening.getTitle())
                            .candidateCount(candidateOpeningRepository.countByOpeningId(opening.getId()))
                            .build())
                    .filter(item -> item.getCandidateCount() > 0)
                    .collect(Collectors.toList());
        }

        return CandidateReportResponse.builder()
                .summary(summary)
                .data(data)
                .candidatesByHr(candidatesByHr)
                .candidatesByOpening(candidatesByOpening)
                .build();
    }

    @Transactional(readOnly = true)
    public JobOpeningReportResponse getJobOpeningReport(
            LocalDateTime dateFrom,
            LocalDateTime dateTo,
            OpeningStatus status,
            Long hrId
    ) {
        log.info("Generating job opening report - dateFrom: {}, dateTo: {}, status: {}, hrId: {}",
                dateFrom, dateTo, status, hrId);

        // Get all openings with filters
        List<Opening> openings = openingRepository.findAll();

        // Apply filters
        if (dateFrom != null) {
            openings = openings.stream()
                    .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(dateFrom))
                    .collect(Collectors.toList());
        }
        if (dateTo != null) {
            openings = openings.stream()
                    .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isAfter(dateTo))
                    .collect(Collectors.toList());
        }
        if (status != null) {
            openings = openings.stream()
                    .filter(o -> status.equals(o.getStatus()))
                    .collect(Collectors.toList());
        }
        if (hrId != null) {
            openings = openings.stream()
                    .filter(o -> hrId.equals(o.getCreatedBy()))
                    .collect(Collectors.toList());
        }

        // Build summary
        long activeOpenings = openings.stream()
                .filter(o -> OpeningStatus.ACTIVE.equals(o.getStatus()))
                .count();
        long closedOpenings = openings.stream()
                .filter(o -> OpeningStatus.CLOSED.equals(o.getStatus()))
                .count();
        long onHoldOpenings = openings.stream()
                .filter(o -> OpeningStatus.ON_HOLD.equals(o.getStatus()))
                .count();
        long totalApplications = candidateOpeningRepository.count();

        JobOpeningReportResponse.OpeningSummary summary = JobOpeningReportResponse.OpeningSummary.builder()
                .totalOpenings((long) openings.size())
                .activeOpenings(activeOpenings)
                .closedOpenings(closedOpenings)
                .onHoldOpenings(onHoldOpenings)
                .totalApplications(totalApplications)
                .build();

        // Build data items
        List<JobOpeningReportResponse.OpeningReportItem> data = openings.stream()
                .map(this::mapToOpeningReportItem)
                .collect(Collectors.toList());

        // Group by HR
        Map<Long, Long> openingsByHrMap = openings.stream()
                .filter(o -> o.getCreatedBy() != null)
                .collect(Collectors.groupingBy(Opening::getCreatedBy, Collectors.counting()));

        List<JobOpeningReportResponse.OpeningsByHr> openingsByHr = openingsByHrMap.entrySet().stream()
                .map(entry -> {
                    String hrName = userRepository.findById(entry.getKey())
                            .map(User::getFullName)
                            .orElse("Unknown");
                    return JobOpeningReportResponse.OpeningsByHr.builder()
                            .hrId(entry.getKey())
                            .hrName(hrName)
                            .openingCount(entry.getValue())
                            .build();
                })
                .collect(Collectors.toList());

        // Top openings by applications
        List<JobOpeningReportResponse.TopOpeningsByApplications> topOpenings = openings.stream()
                .map(opening -> {
                    long appCount = candidateOpeningRepository.countByOpeningId(opening.getId());
                    return JobOpeningReportResponse.TopOpeningsByApplications.builder()
                            .openingId(opening.getId())
                            .openingTitle(opening.getTitle())
                            .applicationCount(appCount)
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getApplicationCount(), a.getApplicationCount()))
                .limit(10)
                .collect(Collectors.toList());

        return JobOpeningReportResponse.builder()
                .summary(summary)
                .data(data)
                .openingsByHr(openingsByHr)
                .topOpenings(topOpenings)
                .build();
    }

    @Transactional(readOnly = true)
    public HrActivityReportResponse getHrActivityReport(
            Long hrId,
            LocalDateTime dateFrom,
            LocalDateTime dateTo
    ) {
        log.info("Generating HR activity report - hrId: {}, dateFrom: {}, dateTo: {}", hrId, dateFrom, dateTo);

        // Get HR users - either specific HR or all
        List<User> hrUsers;
        if (hrId != null) {
            // Filter by specific HR user
            Optional<User> hrUser = userRepository.findById(hrId);
            hrUsers = hrUser.map(List::of).orElse(List.of());
        } else {
            // Get all HR users
            hrUsers = userRepository.findByRole(Role.HR);
        }

        // Build activity items
        List<HrActivityReportResponse.HrActivityItem> data = hrUsers.stream()
                .map(hr -> mapToHrActivityItem(hr, dateFrom, dateTo))
                .sorted((a, b) -> Long.compare(
                        b.getCandidatesAdded() + b.getOpeningsCreated(),
                        a.getCandidatesAdded() + a.getOpeningsCreated()
                ))
                .collect(Collectors.toList());

        // Build summary
        long totalCandidates = data.stream()
                .mapToLong(HrActivityReportResponse.HrActivityItem::getCandidatesAdded)
                .sum();
        long totalOpenings = data.stream()
                .mapToLong(HrActivityReportResponse.HrActivityItem::getOpeningsCreated)
                .sum();

        String mostActiveHr = data.isEmpty() ? "N/A" : data.get(0).getHrName();

        HrActivityReportResponse.HrActivitySummary summary = HrActivityReportResponse.HrActivitySummary.builder()
                .totalHrUsers((long) hrUsers.size())
                .totalCandidatesAdded(totalCandidates)
                .totalOpeningsCreated(totalOpenings)
                .mostActiveHr(mostActiveHr)
                .build();

        return HrActivityReportResponse.builder()
                .summary(summary)
                .data(data)
                .build();
    }

    private CandidateReportResponse.CandidateReportItem mapToCandidateReportItem(Candidate candidate) {
        String hrName = candidate.getSourceHrId() != null
                ? userRepository.findById(candidate.getSourceHrId()).map(User::getFullName).orElse("Unknown")
                : "Unknown";

        long applicationCount = candidateOpeningRepository.countByCandidateId(candidate.getId());

        return CandidateReportResponse.CandidateReportItem.builder()
                .id(candidate.getId())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .email(candidate.getEmail())
                .phone(candidate.getPhone())
                .status(candidate.getStatus() != null ? candidate.getStatus().toString() : "PENDING")
                .active(candidate.getStatus() != Candidate.CandidateStatus.NOT_INTERESTED)
                .hrName(hrName)
                .hrId(candidate.getSourceHrId())
                .applicationCount((int) applicationCount)
                .createdAt(candidate.getCreatedAt())
                .build();
    }

    private JobOpeningReportResponse.OpeningReportItem mapToOpeningReportItem(Opening opening) {
        String hrName = opening.getCreatedBy() != null
                ? userRepository.findById(opening.getCreatedBy()).map(User::getFullName).orElse("Unknown")
                : "Unknown";

        long applicationCount = candidateOpeningRepository.countByOpeningId(opening.getId());

        return JobOpeningReportResponse.OpeningReportItem.builder()
                .id(opening.getId())
                .title(opening.getTitle())
                .department(opening.getDepartment())
                .location(opening.getLocation())
                .positions(opening.getPositions())
                .status(opening.getStatus())
                .hrName(hrName)
                .hrId(opening.getCreatedBy())
                .applicationCount((int) applicationCount)
                .createdAt(opening.getCreatedAt())
                .build();
    }

    private HrActivityReportResponse.HrActivityItem mapToHrActivityItem(
            User hr, LocalDateTime dateFrom, LocalDateTime dateTo
    ) {
        // Get candidates created by this HR
        List<Candidate> hrCandidates = candidateRepository.findAll().stream()
                .filter(c -> hr.getId().equals(c.getSourceHrId()))
                .filter(c -> dateFrom == null || c.getCreatedAt() == null || !c.getCreatedAt().isBefore(dateFrom))
                .filter(c -> dateTo == null || c.getCreatedAt() == null || !c.getCreatedAt().isAfter(dateTo))
                .collect(Collectors.toList());

        // Get openings created by this HR
        List<Opening> hrOpenings = openingRepository.findAll().stream()
                .filter(o -> hr.getId().equals(o.getCreatedBy()))
                .filter(o -> dateFrom == null || o.getCreatedAt() == null || !o.getCreatedAt().isBefore(dateFrom))
                .filter(o -> dateTo == null || o.getCreatedAt() == null || !o.getCreatedAt().isAfter(dateTo))
                .collect(Collectors.toList());

        // Count total applications managed
        long totalApplications = candidateOpeningRepository.findAll().stream()
                .filter(app -> {
                    Opening opening = app.getOpening();
                    return opening != null && hr.getId().equals(opening.getCreatedBy());
                })
                .count();

        // Find last activity
        LocalDateTime lastCandidateActivity = hrCandidates.stream()
                .map(Candidate::getCreatedAt)
                .filter(date -> date != null)
                .max(LocalDateTime::compareTo)
                .orElse(null);

        LocalDateTime lastOpeningActivity = hrOpenings.stream()
                .map(Opening::getCreatedAt)
                .filter(date -> date != null)
                .max(LocalDateTime::compareTo)
                .orElse(null);

        LocalDateTime lastActivity = null;
        if (lastCandidateActivity != null && lastOpeningActivity != null) {
            lastActivity = lastCandidateActivity.isAfter(lastOpeningActivity) ? lastCandidateActivity : lastOpeningActivity;
        } else if (lastCandidateActivity != null) {
            lastActivity = lastCandidateActivity;
        } else if (lastOpeningActivity != null) {
            lastActivity = lastOpeningActivity;
        }

        // Map candidates to CandidateDetail
        List<HrActivityReportResponse.CandidateDetail> candidateDetails = hrCandidates.stream()
                .map(this::mapToCandidateDetail)
                .collect(Collectors.toList());

        // Map openings to OpeningDetail
        List<HrActivityReportResponse.OpeningDetail> openingDetails = hrOpenings.stream()
                .map(this::mapToOpeningDetail)
                .collect(Collectors.toList());

        return HrActivityReportResponse.HrActivityItem.builder()
                .hrId(hr.getId())
                .hrName(hr.getFullName())
                .email(hr.getEmail())
                .candidatesAdded((long) hrCandidates.size())
                .openingsCreated((long) hrOpenings.size())
                .totalApplicationsManaged(totalApplications)
                .active(hr.getActive())
                .lastActivity(lastActivity)
                .candidates(candidateDetails)
                .openings(openingDetails)
                .build();
    }

    private HrActivityReportResponse.CandidateDetail mapToCandidateDetail(Candidate candidate) {
        long applicationCount = candidateOpeningRepository.countByCandidateId(candidate.getId());

        return HrActivityReportResponse.CandidateDetail.builder()
                .id(candidate.getId())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .email(candidate.getEmail())
                .phone(candidate.getPhone())
                .status(candidate.getStatus() != null ? candidate.getStatus().toString() : "PENDING")
                .company(candidate.getCompany())
                .profile(candidate.getProfile())
                .experience(candidate.getExperience())
                .applicationCount((int) applicationCount)
                .createdAt(candidate.getCreatedAt())
                .build();
    }

    private HrActivityReportResponse.OpeningDetail mapToOpeningDetail(Opening opening) {
        long applicationCount = candidateOpeningRepository.countByOpeningId(opening.getId());

        return HrActivityReportResponse.OpeningDetail.builder()
                .id(opening.getId())
                .title(opening.getTitle())
                .department(opening.getDepartment())
                .location(opening.getLocation())
                .positions(opening.getPositions())
                .status(opening.getStatus())
                .applicationCount((int) applicationCount)
                .createdAt(opening.getCreatedAt())
                .build();
    }
}
