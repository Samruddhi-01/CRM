package com.startica.privateapp.analytics.service;

import com.startica.privateapp.analytics.dto.DashboardMetricsResponse;
import com.startica.privateapp.analytics.dto.HRPerformanceResponse;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.Candidate.CandidateStatus;
import com.startica.privateapp.model.Role;
import com.startica.privateapp.model.User;
import com.startica.privateapp.repository.CandidateRepository;
import com.startica.privateapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public DashboardMetricsResponse getOverviewMetrics() {
        Long totalCandidates = candidateRepository.count();
        Long interestedCount = candidateRepository.countByStatus(CandidateStatus.INTERESTED);
        Long notInterestedCount = candidateRepository.countByStatus(CandidateStatus.NOT_INTERESTED);
        Long pendingCount = candidateRepository.countByStatus(CandidateStatus.PENDING);
        Long contactedCount = candidateRepository.countByStatus(CandidateStatus.CONTACTED);
        Long offeredCount = candidateRepository.countByStatus(CandidateStatus.OFFERED);
        Long hiredCount = candidateRepository.countByStatus(CandidateStatus.HIRED);
        Long tellLaterCount = candidateRepository.countByStatus(CandidateStatus.TELL_LATER);

        // Candidates added this month
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Long candidatesThisMonth = candidateRepository.countByCreatedAtAfter(startOfMonth);

        // HR contributions
        Map<String, Long> hrContributions = getHRContributions();

        // Monthly statistics (last 12 months)
        Map<String, Long> monthlyStats = getMonthlyStatistics();

        // Experience distribution
        Map<String, Long> experienceDistribution = getExperienceDistribution();

        // HR performance overview
        Map<String, Long> hrPerformanceOverview = getHRPerformanceOverview();

        return DashboardMetricsResponse.builder()
                .totalCandidates(totalCandidates)
                .interestedCount(interestedCount)
                .notInterestedCount(notInterestedCount)
                .pendingCount(pendingCount)
                .contactedCount(contactedCount)
                .offeredCount(offeredCount)
                .hiredCount(hiredCount)
                .tellLaterCount(tellLaterCount)
                .candidatesThisMonth(candidatesThisMonth)
                .hrContributions(hrContributions)
                .monthlyStatistics(monthlyStats)
                .experienceDistribution(experienceDistribution)
                .hrPerformanceOverview(hrPerformanceOverview)
                .build();
    }

    public Map<String, Long> getMonthlyStatistics() {
        LocalDateTime twelveMonthsAgo = LocalDateTime.now().minusMonths(12);
      //  List<Object[]> results = candidateRepository.getMonthlyStatistics();
        List<Object[]> results = candidateRepository.getMonthlyStatistics(twelveMonthsAgo);

        Map<String, Long> monthlyStats = new LinkedHashMap<>();

        // Initialize all months with 0
        for (int i = 11; i >= 0; i--) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            monthlyStats.put(ym.toString(), 0L);
        }

        // Fill in actual counts
        for (Object[] result : results) {
            int month = (int) result[0];
            int year = (int) result[1];
            long count = (long) result[2];
            String key = String.format("%04d-%02d", year, month);
            monthlyStats.put(key, count);
        }

        return monthlyStats;
    }

    public Map<String, Long> getExperienceDistribution() {
        List<Candidate> allCandidates = candidateRepository.findAll();

        // Use LinkedHashMap to maintain order
        Map<String, Long> distribution = new LinkedHashMap<>();
        distribution.put("4 years", 0L);
        distribution.put("Fresher", 0L);
        distribution.put("3 years", 0L);
        distribution.put("8 years", 0L);
        distribution.put("1-2", 0L);
        distribution.put("1 year", 0L);

        for (Candidate candidate : allCandidates) {
            String exp = candidate.getExperience();

            // Handle null or empty experience
            if (exp == null || exp.trim().isEmpty()) {
                distribution.put("Fresher", distribution.get("Fresher") + 1);
                continue;
            }

            exp = exp.trim().toLowerCase();

            // Handle explicit fresher keywords
            if (exp.equals("0") || exp.equals("fresher") || exp.contains("fresher") || exp.equals("0 years")) {
                distribution.put("Fresher", distribution.get("Fresher") + 1);
                continue;
            }

            try {
                // Extract numeric value from various formats
                // Handles: "2", "2 years", "2.5", "2-3", etc.
                String expStr = exp.replaceAll("[^0-9.]", "");

                if (expStr.isEmpty()) {
                    distribution.put("Fresher", distribution.get("Fresher") + 1);
                    continue;
                }

                double years = Double.parseDouble(expStr);

                // Categorize by experience range matching chart categories
                if (years < 1) {
                    distribution.put("Fresher", distribution.get("Fresher") + 1);
                } else if (years >= 1 && years < 1.5) {
                    distribution.put("1 year", distribution.get("1 year") + 1);
                } else if (years >= 1.5 && years < 3) {
                    distribution.put("1-2", distribution.get("1-2") + 1);
                } else if (years >= 3 && years < 4) {
                    distribution.put("3 years", distribution.get("3 years") + 1);
                } else if (years >= 4 && years < 8) {
                    distribution.put("4 years", distribution.get("4 years") + 1);
                } else {
                    distribution.put("8 years", distribution.get("8 years") + 1);
                }
            } catch (NumberFormatException e) {
                // If parsing fails, treat as fresher
                distribution.put("Fresher", distribution.get("Fresher") + 1);
            }
        }

        return distribution;
    }

    public Map<String, Long> getHRPerformanceOverview() {
        List<User> hrUsers = userRepository.findByRole(Role.HR);

        // Collect HR performance data
        Map<String, Long> performanceMap = new HashMap<>();

        for (User hr : hrUsers) {
            Long candidateCount = candidateRepository.countBySourceHrId(hr.getId());

            // Include all HRs, even with 0 candidates for complete overview
            String hrName = hr.getFullName() != null && !hr.getFullName().trim().isEmpty()
                ? hr.getFullName()
                : hr.getEmail().split("@")[0]; // Fallback to email username

            performanceMap.put(hrName, candidateCount != null ? candidateCount : 0L);
        }

        // Sort by candidate count (descending) and return as LinkedHashMap
        return performanceMap.entrySet()
            .stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .collect(LinkedHashMap::new, (map, entry) -> map.put(entry.getKey(), entry.getValue()), LinkedHashMap::putAll);
    }

    private Map<String, Long> getHRContributions() {
        List<Object[]> results = candidateRepository.countCandidatesByHr();
        Map<String, Long> contributions = new HashMap<>();

        for (Object[] result : results) {
            Long hrId = (Long) result[0];
            Long count = (Long) result[1];

            String hrName = userRepository.findById(hrId)
                    .map(User::getFullName)
                    .orElse("Unknown");

            contributions.put(hrName, count);
        }

        return contributions;
    }

    public List<HRPerformanceResponse> getHRPerformance() {
        List<Object[]> results = candidateRepository.countCandidatesByHrAndStatus();

        // Group by HR ID
        Map<Long, Map<String, Long>> hrPerformanceMap = new HashMap<>();

        for (Object[] result : results) {
            Long hrId = (Long) result[0];
            CandidateStatus status = (CandidateStatus) result[1];
            Long count = (Long) result[2];

            hrPerformanceMap.putIfAbsent(hrId, new HashMap<>());
            hrPerformanceMap.get(hrId).put(status.name(), count);
        }

        // Convert to response objects
        return hrPerformanceMap.entrySet().stream()
                .map(entry -> {
                    Long hrId = entry.getKey();
                    Map<String, Long> statusBreakdown = entry.getValue();

                    String hrName = userRepository.findById(hrId)
                            .map(User::getFullName)
                            .orElse("Unknown");

                    long totalCandidates = statusBreakdown.values().stream()
                            .mapToLong(Long::longValue)
                            .sum();

                    return HRPerformanceResponse.builder()
                            .hrId(hrId)
                            .hrName(hrName)
                            .totalCandidates(totalCandidates)
                            .statusBreakdown(statusBreakdown)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public DashboardMetricsResponse getHRMetrics(Long hrId) {
        // Similar to overview but filtered by HR
        List<Object[]> results = candidateRepository.countCandidatesByHrAndStatus();

        Map<String, Long> statusCounts = new HashMap<>();
        long totalCandidates = 0;

        for (Object[] result : results) {
            Long resultHrId = (Long) result[0];
            if (resultHrId.equals(hrId)) {
                CandidateStatus status = (CandidateStatus) result[1];
                Long count = (Long) result[2];
                statusCounts.put(status.name(), count);
                totalCandidates += count;
            }
        }

        // Candidates added this month by this HR
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Long candidatesThisMonth = candidateRepository.countBySourceHrIdAndCreatedAtAfter(hrId, startOfMonth);

        // Monthly statistics for this HR (last 12 months)
        Map<String, Long> monthlyStats = getHRMonthlyStatistics(hrId);

        return DashboardMetricsResponse.builder()
                .totalCandidates(totalCandidates)
                .interestedCount(statusCounts.getOrDefault("INTERESTED", 0L))
                .notInterestedCount(statusCounts.getOrDefault("NOT_INTERESTED", 0L))
                .pendingCount(statusCounts.getOrDefault("PENDING", 0L))
                .contactedCount(statusCounts.getOrDefault("CONTACTED", 0L))
                .offeredCount(statusCounts.getOrDefault("OFFERED", 0L))
                .hiredCount(statusCounts.getOrDefault("HIRED", 0L))
                .tellLaterCount(statusCounts.getOrDefault("TELL_LATER", 0L))
                .candidatesThisMonth(candidatesThisMonth)
                .monthlyStatistics(monthlyStats)
                .build();
    }

    public Map<String, Long> getHRMonthlyStatistics(Long hrId) {
        LocalDateTime twelveMonthsAgo = LocalDateTime.now().minusMonths(12);
        List<Object[]> results = candidateRepository.getMonthlyStatisticsByHr(hrId, twelveMonthsAgo);

        Map<String, Long> monthlyStats = new LinkedHashMap<>();

        // Initialize all months with 0
        for (int i = 11; i >= 0; i--) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            monthlyStats.put(ym.toString(), 0L);
        }

        // Fill in actual counts
        for (Object[] result : results) {
            int month = (int) result[0];
            int year = (int) result[1];
            long count = (long) result[2];
            String key = String.format("%04d-%02d", year, month);
            monthlyStats.put(key, count);
        }

        return monthlyStats;
    }
    public Map<String, Long> getWeeklyStatistics() {
        List<Object[]> results = candidateRepository.getWeeklyStatistics();
        Map<String, Long> weeklyStats = new LinkedHashMap<>();

        for (Object[] row : results) {
            int year = ((Number) row[0]).intValue();
            int week = ((Number) row[1]).intValue();
            long count = ((Number) row[2]).longValue();

            String key = year + "-W" + String.format("%02d", week);
            weeklyStats.put(key, count);
        }

        return weeklyStats;
    }


}

