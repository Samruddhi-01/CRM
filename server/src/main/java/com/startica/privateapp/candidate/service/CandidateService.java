package com.startica.privateapp.candidate.service;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;


import com.startica.privateapp.audit.service.AuditService;
import com.startica.privateapp.candidate.dto.*;
import com.startica.privateapp.common.exception.BusinessException;
import com.startica.privateapp.common.exception.DuplicateResourceException;
import com.startica.privateapp.common.exception.ResourceNotFoundException;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.Candidate.CandidateStatus;
import com.startica.privateapp.model.Role;
import com.startica.privateapp.model.User;
import com.startica.privateapp.opening.repository.CandidateOpeningRepository;
import com.startica.privateapp.repository.CandidateRepository;
import com.startica.privateapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final CandidateOpeningRepository candidateOpeningRepository;

    @Transactional
    public CandidateResponse createCandidate(CreateCandidateRequest request, User currentUser) {
        // Validate duplicate email and phone
        if (candidateRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Candidate", "email", request.getEmail());
        }
        if (candidateRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Candidate", "phone", request.getPhone());
        }

        // Create candidate
        Candidate candidate = new Candidate();
        candidate.setFirstName(request.getFirstName());
        candidate.setLastName(request.getLastName());
        candidate.setEmail(request.getEmail());
        candidate.setPhone(request.getPhone());
        candidate.setLocation(request.getLocation());
        candidate.setCompany(request.getCompany());
        candidate.setProfile(request.getProfile());
        candidate.setDegree(request.getDegree());
        candidate.setPassingYear(request.getPassingYear());
        candidate.setExperience(request.getExperience());
        candidate.setCurrentPackage(request.getCurrentPackage());
        candidate.setExpectedCTC(request.getExpectedCTC());
        candidate.setGap(request.getGap());
        candidate.setSkills(request.getSkills());
        candidate.setResumeUrl(request.getResumeUrl());
        candidate.setPercentage(candidate.getPercentage());
        candidate.setNotes(request.getNotes());
        candidate.setEmploymentHistory(request.getEmploymentHistory());
        candidate.setEducation(request.getEducation());
        candidate.setExperienceLevel(request.getExperienceLevel());
        candidate.setNoticePeriod(request.getNoticePeriod());
        candidate.setStatus(request.getStatus() != null ? request.getStatus() : CandidateStatus.PENDING);
        candidate.setSourceHrId(currentUser.getId());

        Candidate savedCandidate = candidateRepository.save(candidate);

        // Log audit
        auditService.logCandidateCreation(savedCandidate, currentUser);

        return mapToResponse(savedCandidate, currentUser.getFullName());
    }

    @Transactional
    public CandidateResponse updateCandidate(Long id, UpdateCandidateRequest request, User currentUser) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        // Check authorization (HR can only update their own candidates, Admin can update all)
        if (currentUser.getRole() == Role.HR && !candidate.getSourceHrId().equals(currentUser.getId())) {
            throw new BusinessException("You can only update candidates you created");
        }

        // Update fields and log changes
        if (request.getFirstName() != null && !request.getFirstName().equals(candidate.getFirstName())) {
            auditService.logCandidateUpdate(id, "firstName", candidate.getFirstName(), request.getFirstName(), currentUser);
            candidate.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().equals(candidate.getLastName())) {
            auditService.logCandidateUpdate(id, "lastName", candidate.getLastName(), request.getLastName(), currentUser);
            candidate.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(candidate.getEmail())) {
            if (candidateRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Candidate", "email", request.getEmail());
            }
            auditService.logCandidateUpdate(id, "email", candidate.getEmail(), request.getEmail(), currentUser);
            candidate.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().equals(candidate.getPhone())) {
            if (candidateRepository.existsByPhone(request.getPhone())) {
                throw new DuplicateResourceException("Candidate", "phone", request.getPhone());
            }
            auditService.logCandidateUpdate(id, "phone", candidate.getPhone(), request.getPhone(), currentUser);
            candidate.setPhone(request.getPhone());
        }
        if (request.getLocation() != null) {
            candidate.setLocation(request.getLocation());
        }
        if (request.getCompany() != null) {
            candidate.setCompany(request.getCompany());
        }
        if (request.getProfile() != null) {
            candidate.setProfile(request.getProfile());
        }
        if (request.getDegree() != null) {
            candidate.setDegree(request.getDegree());
        }
        if (request.getPassingYear() != null) {
            candidate.setPassingYear(request.getPassingYear());
        }
        if (request.getExperience() != null) {
            candidate.setExperience(request.getExperience());
        }
        if (request.getCurrentPackage() != null) {
            candidate.setCurrentPackage(request.getCurrentPackage());
        }
        if (request.getExpectedCTC() != null) {
            candidate.setExpectedCTC(request.getExpectedCTC());
        }
        if (request.getGap() != null) {
            candidate.setGap(request.getGap());
        }
        if (request.getSkills() != null) {
            candidate.setSkills(request.getSkills());
        }
        if (request.getResumeUrl() != null) {
            candidate.setResumeUrl(request.getResumeUrl());
        }
        if (request.getStatus() != null) {
            candidate.setStatus(request.getStatus());
        }
        if (request.getNotes() != null) {
            candidate.setNotes(request.getNotes());
        }
        if (request.getEmploymentHistory() != null) {
            candidate.setEmploymentHistory(request.getEmploymentHistory());
        }
        if (request.getEducation() != null) {
            candidate.setEducation(request.getEducation());
        }
        if (request.getExperienceLevel() != null) {
            candidate.setExperienceLevel(request.getExperienceLevel());
        }
        if (request.getNoticePeriod() != null) {
            candidate.setNoticePeriod(request.getNoticePeriod());
        }

        Candidate updatedCandidate = candidateRepository.save(candidate);
        String hrName = getUserFullName(candidate.getSourceHrId());
        return mapToResponse(updatedCandidate, hrName);
    }

    @Transactional
    public void updateCandidateStatus(Long id, UpdateStatusRequest request, User currentUser) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        // Check authorization
        if (currentUser.getRole() == Role.HR && !candidate.getSourceHrId().equals(currentUser.getId())) {
            throw new BusinessException("You can only update status of candidates you created");
        }

        // Validate comment requirement for certain statuses
        if ((request.getStatus() == CandidateStatus.NOT_INTERESTED ||
             request.getStatus() == CandidateStatus.TELL_LATER) &&
            (request.getComment() == null || request.getComment().isEmpty())) {
            throw new BusinessException("Comment is required for NOT_INTERESTED and TELL_LATER statuses");
        }

        String oldStatus = candidate.getStatus().name();
        candidate.setStatus(request.getStatus());
        candidateRepository.save(candidate);

        // Log status change
        auditService.logStatusChange(id, oldStatus, request.getStatus().name(), request.getComment(), currentUser);
    }

    @Transactional
    public CandidateResponse updateAdminRemark(Long id, String adminRemark, User currentUser) {
        // Only ADMIN can update admin remarks
        if (currentUser.getRole() != Role.ADMIN) {
            throw new BusinessException("Only admins can update admin remarks");
        }

        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        String oldRemark = candidate.getAdminRemark();
        candidate.setAdminRemark(adminRemark);
        Candidate updatedCandidate = candidateRepository.save(candidate);

        // Log the remark update
        auditService.logCandidateUpdate(id, "adminRemark", oldRemark, adminRemark, currentUser);

        String hrName = getUserFullName(candidate.getSourceHrId());
        return mapToResponse(updatedCandidate, hrName);
    }

    @Transactional
    public void bulkUpdateStatus(BulkStatusUpdateRequest request, User currentUser) {
        List<Candidate> candidates = candidateRepository.findAllById(request.getCandidateIds());

        if (candidates.size() != request.getCandidateIds().size()) {
            throw new BusinessException("Some candidate IDs are invalid");
        }

        for (Candidate candidate : candidates) {
            // Check authorization
            if (currentUser.getRole() == Role.HR && !candidate.getSourceHrId().equals(currentUser.getId())) {
                throw new BusinessException("You can only update status of candidates you created");
            }

            String oldStatus = candidate.getStatus().name();
            candidate.setStatus(request.getStatus());
            candidateRepository.save(candidate);

            // Log status change
            auditService.logStatusChange(candidate.getId(), oldStatus, request.getStatus().name(),
                    request.getComment(), currentUser);
        }
    }

    @Transactional
    public void deleteCandidate(Long id, User currentUser) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        // Check authorization (HR can only delete their own candidates, Admin can delete all)
        if (currentUser.getRole() == Role.HR && !candidate.getSourceHrId().equals(currentUser.getId())) {
            throw new BusinessException("You can only delete candidates you created");
        }

        // Log deletion before deleting
        auditService.logCandidateDeletion(candidate, currentUser);

        // Delete all candidate openings first to avoid foreign key constraint violation
        candidateOpeningRepository.findByCandidateId(id).forEach(candidateOpeningRepository::delete);

        // Now delete the candidate
        candidateRepository.delete(candidate);
    }

    public Page<CandidateResponse> getCandidates(String search, CandidateStatus status,
                                                   Long sourceHrId, User currentUser, Pageable pageable) {
        // If HR user, only show their candidates
        Long hrFilter = currentUser.getRole() == Role.HR ? currentUser.getId() : sourceHrId;

        Page<Candidate> candidates = candidateRepository.searchCandidates(search, status, hrFilter, pageable);
        return candidates.map(c -> mapToResponse(c, getUserFullName(c.getSourceHrId())));
    }

    public CandidateResponse getCandidateById(Long id, User currentUser) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        // Check authorization
        if (currentUser.getRole() == Role.HR && !candidate.getSourceHrId().equals(currentUser.getId())) {
            throw new BusinessException("You can only view candidates you created");
        }

        String hrName = getUserFullName(candidate.getSourceHrId());
        return mapToResponse(candidate, hrName);
    }
    public Map<String, Integer> getWeeklyChart() {
        List<Object[]> data = candidateRepository.getMonthlyStatistics();
        Map<String, Integer> map = new LinkedHashMap<>();

        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        for (Object[] row : data) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            int week = ((Number) row[2]).intValue();
            int count = ((Number) row[3]).intValue();

            if (year == currentYear && month == currentMonth) {
                map.put("W" + week, count);
            }
        }

        // Always return W1–W5
        for (int i = 1; i <= 5; i++) {
            map.putIfAbsent("W" + i, 0);
        }

        return map;
    }


    private String getUserFullName(Long userId) {
        return userRepository.findById(userId)
                .map(User::getFullName)
                .orElse("Unknown");
    }

    private CandidateResponse mapToResponse(Candidate candidate, String hrName) {
        return CandidateResponse.builder()
                .id(candidate.getId())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
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
                .sourceHrId(candidate.getSourceHrId())
                .sourceHrName(hrName)
                .notes(candidate.getNotes())
                .hrRemark(candidate.getHrRemark())
                .adminRemark(candidate.getAdminRemark())
                .employmentHistory(candidate.getEmploymentHistory())
                .education(candidate.getEducation())
                .experienceLevel(candidate.getExperienceLevel())
                .noticePeriod(candidate.getNoticePeriod())
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }
    @Transactional
    public void populatePercentagesForAllCandidates() {
        List<Candidate> candidates = candidateRepository.findAll();
        for (Candidate candidate : candidates) {
            candidate.updatePercentageFromEducation(); // extract from education JSON
        }
        candidateRepository.saveAll(candidates);
    }

}

