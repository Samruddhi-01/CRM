package com.startica.privateapp.service;

import com.startica.privateapp.dto.*;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.Role;
import com.startica.privateapp.model.User;
import com.startica.privateapp.opening.model.CandidateOpening;
import com.startica.privateapp.repository.CandidateRepository;
import com.startica.privateapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for HR Performance Analytics
 * Handles Admin's HR performance tracking and candidate management
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HRPerformanceService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    /**
     * Get HR Performance Overview for all HR users
     * ADMIN only
     */
    @Transactional(readOnly = true)
    public List<HRPerformanceDTO> getHRPerformanceOverview() {
        log.info("Fetching HR Performance Overview");
        
        // Get all HR users
        List<User> hrUsers = userRepository.findByRole(Role.HR);
        log.info("Found {} HR users in database", hrUsers.size());
        
        if (hrUsers.isEmpty()) {
            log.warn("No HR users found in the system");
            return new ArrayList<>();
        }
        
        // Get all candidates grouped by HR
        List<Candidate> allCandidates = candidateRepository.findAll();
        log.info("Found {} total candidates", allCandidates.size());
        
        Map<Long, List<Candidate>> candidatesByHr = allCandidates.stream()
            .filter(c -> c.getSourceHrId() != null)
            .collect(Collectors.groupingBy(Candidate::getSourceHrId));
        
        log.info("Candidates grouped by {} HR IDs", candidatesByHr.size());
        
        // Build performance DTOs
        List<HRPerformanceDTO> performanceList = new ArrayList<>();
        
        for (User hr : hrUsers) {
            List<Candidate> hrCandidates = candidatesByHr.getOrDefault(hr.getId(), new ArrayList<>());
            
            HRPerformanceDTO dto = HRPerformanceDTO.builder()
                .hrId(hr.getId())
                .fullName(hr.getFullName())
                .email(hr.getEmail())
                .totalCandidates(hrCandidates.size())
                .hiredCount(countByStatus(hrCandidates, Candidate.CandidateStatus.HIRED))
                .contactedCount(countByStatus(hrCandidates, Candidate.CandidateStatus.CONTACTED))
                .interestedCount(countByStatus(hrCandidates, Candidate.CandidateStatus.INTERESTED))
                .pendingCount(countByStatus(hrCandidates, Candidate.CandidateStatus.PENDING))
                .appliedCount((int) hrCandidates.stream()
                    .filter(c -> c.getCandidateOpenings() != null && !c.getCandidateOpenings().isEmpty())
                    .count())
                .notContactedCount((int) hrCandidates.stream()
                    .filter(c -> c.getStatus() != Candidate.CandidateStatus.CONTACTED)
                    .count())
                .lastActivity(hrCandidates.stream()
                    .map(Candidate::getUpdatedAt)
                    .filter(Objects::nonNull)
                    .max(java.time.LocalDateTime::compareTo)
                    .orElse(null))
                .build();
            
            performanceList.add(dto);
        }
        
        // Sort by total candidates descending
        performanceList.sort((a, b) -> b.getTotalCandidates().compareTo(a.getTotalCandidates()));
        
        log.info("HR Performance Overview fetched: {} HR users", performanceList.size());
        return performanceList;
    }

    /**
     * Get candidates for a specific HR
     * ADMIN only - with admin remarks visible
     */
    @Transactional(readOnly = true)
    public Page<HRCandidateDTO> getHRCandidates(Long hrId, String search, 
                                                 Candidate.CandidateStatus status, 
                                                 Pageable pageable) {
        log.info("Fetching candidates for HR ID: {}", hrId);
        
        // Verify HR exists
        User hr = userRepository.findById(hrId)
            .orElseThrow(() -> new IllegalArgumentException("HR not found with ID: " + hrId));
        
        if (hr.getRole() != Role.HR) {
            throw new IllegalArgumentException("User is not an HR");
        }
        
        // Search candidates for this HR
        Page<Candidate> candidates = candidateRepository.searchCandidates(search, status, hrId, pageable);
        
        // Convert to DTOs with admin remarks
        List<HRCandidateDTO> dtoList = candidates.getContent().stream()
            .map(c -> convertToCandidateDTO(c, true))
            .collect(Collectors.toList());
        
        return new PageImpl<>(dtoList, pageable, candidates.getTotalElements());
    }

    /**
     * Update admin remark for a candidate
     * ADMIN only
     */
    @Transactional
    public HRCandidateDTO updateAdminRemark(Long candidateId, String adminRemark) {
        log.info("Updating admin remark for candidate ID: {}", candidateId);
        
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
        
        candidate.setAdminRemark(adminRemark);
        candidate = candidateRepository.save(candidate);
        
        log.info("Admin remark updated for candidate ID: {}", candidateId);
        return convertToCandidateDTO(candidate, true);
    }

    /**
     * Update candidate status (Admin context)
     * ADMIN only
     */
    @Transactional
    public HRCandidateDTO updateCandidateStatus(Long candidateId, Candidate.CandidateStatus status) {
        log.info("Updating status for candidate ID: {} to {}", candidateId, status);
        
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
        
        candidate.setStatus(status);
        candidate = candidateRepository.save(candidate);
        
        log.info("Status updated for candidate ID: {}", candidateId);
        return convertToCandidateDTO(candidate, true);
    }

    /**
     * Get candidates for logged-in HR
     * HR only - without admin remarks
     */
    @Transactional(readOnly = true)
    public Page<HRCandidateDTO> getMyCandidates(Long hrId, String search, 
                                                 Candidate.CandidateStatus status, 
                                                 Pageable pageable) {
        log.info("Fetching my candidates for HR ID: {} with search: '{}', status: {}", hrId, search, status);
        
        Page<Candidate> candidates = candidateRepository.searchCandidates(search, status, hrId, pageable);
        log.info("Found {} candidates for HR ID: {} (page {} of {})", 
            candidates.getTotalElements(), hrId, candidates.getNumber(), candidates.getTotalPages());
        
        // Convert to DTOs WITHOUT admin remarks
        List<HRCandidateDTO> dtoList = candidates.getContent().stream()
            .map(c -> convertToCandidateDTO(c, false))
            .collect(Collectors.toList());
        
        return new PageImpl<>(dtoList, pageable, candidates.getTotalElements());
    }

    /**
     * Update HR remark for own candidate
     * HR only - validates ownership
     */
    @Transactional
    public HRCandidateDTO updateHRRemark(Long candidateId, String hrRemark, Long loggedInHrId) {
        log.info("Updating HR remark for candidate ID: {} by HR ID: {}", candidateId, loggedInHrId);
        
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
        
        // Verify ownership
        if (!candidate.getSourceHrId().equals(loggedInHrId)) {
            throw new AccessDeniedException("You can only update remarks for your own candidates");
        }
        
        candidate.setHrRemark(hrRemark);
        candidate = candidateRepository.save(candidate);
        
        log.info("HR remark updated for candidate ID: {}", candidateId);
        return convertToCandidateDTO(candidate, false);
    }

    /**
     * Update candidate status (HR context)
     * HR only - validates ownership
     */
    @Transactional
    public HRCandidateDTO updateCandidateStatusByHR(Long candidateId, 
                                                      Candidate.CandidateStatus status, 
                                                      Long loggedInHrId) {
        log.info("Updating status for candidate ID: {} to {} by HR ID: {}", candidateId, status, loggedInHrId);
        
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
        
        // Verify ownership
        if (!candidate.getSourceHrId().equals(loggedInHrId)) {
            throw new AccessDeniedException("You can only update status for your own candidates");
        }
        
        candidate.setStatus(status);
        candidate = candidateRepository.save(candidate);
        
        log.info("Status updated for candidate ID: {}", candidateId);
        return convertToCandidateDTO(candidate, false);
    }

    // Helper methods
    
    private int countByStatus(List<Candidate> candidates, Candidate.CandidateStatus status) {
        return (int) candidates.stream()
            .filter(c -> c.getStatus() == status)
            .count();
    }

    private HRCandidateDTO convertToCandidateDTO(Candidate candidate, boolean includeAdminRemark) {
        User sourceHr = null;
        if (candidate.getSourceHrId() != null) {
            sourceHr = userRepository.findById(candidate.getSourceHrId()).orElse(null);
        }
        
        List<String> appliedOpenings = new ArrayList<>();
        try {
            if (candidate.getCandidateOpenings() != null && !candidate.getCandidateOpenings().isEmpty()) {
                appliedOpenings = candidate.getCandidateOpenings().stream()
                    .map(CandidateOpening::getOpening)
                    .filter(Objects::nonNull)
                    .map(o -> o.getTitle())
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("Error fetching applied openings for candidate {}: {}", candidate.getId(), e.getMessage());
        }
        
        HRCandidateDTO dto = HRCandidateDTO.builder()
            .id(candidate.getId())
            .firstName(candidate.getFirstName())
            .lastName(candidate.getLastName())
            .fullName((candidate.getFirstName() != null ? candidate.getFirstName() : "") + " " + 
                     (candidate.getLastName() != null ? candidate.getLastName() : ""))
            .email(candidate.getEmail())
            .phone(candidate.getPhone())
            .location(candidate.getLocation())
            .company(candidate.getCompany())
            .profile(candidate.getProfile())
            .degree(candidate.getDegree())
            .passingYear(candidate.getPassingYear())
            .experience(candidate.getExperience())
            .currentPackage(candidate.getCurrentPackage())
            .expectedCTC(candidate.getExpectedCTC())
            .gap(candidate.getGap())
            .skills(candidate.getSkills())
            .resumeUrl(candidate.getResumeUrl())
            .status(candidate.getStatus())
            .statusLabel(getStatusLabel(candidate.getStatus()))
            .sourceHrId(candidate.getSourceHrId())
            .sourceHrName(sourceHr != null ? sourceHr.getFullName() : "N/A")
            .notes(candidate.getNotes())
            .hrRemark(candidate.getHrRemark())
            .appliedOpenings(appliedOpenings)
            .createdAt(candidate.getCreatedAt())
            .updatedAt(candidate.getUpdatedAt())
            .build();
        
        // Only include admin remark if admin is viewing
        if (includeAdminRemark) {
            dto.setAdminRemark(candidate.getAdminRemark());
        }
        
        return dto;
    }

    private String getStatusLabel(Candidate.CandidateStatus status) {
        if (status == null) return "Unknown";
        
        switch (status) {
            case PENDING: return "Pending";
            case INTERESTED: return "Interested";
            case NOT_INTERESTED: return "Not Interested";
            case TELL_LATER: return "Tell Later";
            case CONTACTED: return "Contacted";
            case OFFERED: return "Offered";
            case HIRED: return "Hired";
            default: return status.name();
        }
    }
}
