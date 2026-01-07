package com.startica.privateapp.opening.service;

import com.startica.privateapp.common.exception.ResourceNotFoundException;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.User;
import com.startica.privateapp.opening.dto.ApplyCandidateRequest;
import com.startica.privateapp.opening.dto.CandidateApplicationResponse;
import com.startica.privateapp.opening.model.CandidateOpening;
import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.opening.repository.CandidateOpeningRepository;
import com.startica.privateapp.opening.repository.OpeningRepository;
import com.startica.privateapp.repository.CandidateRepository;
import com.startica.privateapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateApplicationService {
    
    private final CandidateOpeningRepository candidateOpeningRepository;
    private final OpeningRepository openingRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public CandidateApplicationResponse applyToOpening(Long openingId, ApplyCandidateRequest request, Long userId) {
        log.info("Applying candidate {} to opening {}", request.getCandidateId(), openingId);
        
        Opening opening = openingRepository.findById(openingId)
            .orElseThrow(() -> new ResourceNotFoundException("Opening not found with id: " + openingId));
        
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
            .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + request.getCandidateId()));
        
        candidateOpeningRepository.findByCandidateIdAndOpeningId(request.getCandidateId(), openingId)
            .ifPresent(existing -> {
                throw new IllegalStateException("Candidate has already applied to this opening");
            });
        
        CandidateOpening application = CandidateOpening.builder()
            .candidate(candidate)
            .opening(opening)
            .notes(request.getNotes())
            .applicationStatus(request.getApplicationStatus() != null ? request.getApplicationStatus() : "APPLIED")
            .appliedBy(userId)
            .build();
        
        CandidateOpening saved = candidateOpeningRepository.save(application);
        log.info("Successfully applied candidate {} to opening {}", request.getCandidateId(), openingId);
        
        return mapToResponse(saved);
    }
    
    @Transactional
    public void removeApplication(Long openingId, Long candidateId, Long userId) {
        log.info("Removing candidate {} from opening {} by user {}", candidateId, openingId, userId);
        
        CandidateOpening application = candidateOpeningRepository.findByCandidateIdAndOpeningId(candidateId, openingId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        candidateOpeningRepository.delete(application);
        log.info("Successfully removed application");
    }
    
    @Transactional(readOnly = true)
    public Page<CandidateApplicationResponse> getOpeningApplications(Long openingId, int page, int size, String sortBy, String sortDir) {
        log.info("Fetching applications for opening {}", openingId);
        
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<CandidateOpening> applications = candidateOpeningRepository.findByOpeningId(openingId, pageable);
        
        return applications.map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public List<CandidateApplicationResponse> getCandidateApplications(Long candidateId) {
        log.info("Fetching applications for candidate {}", candidateId);
        
        List<CandidateOpening> applications = candidateOpeningRepository.findByCandidateId(candidateId);
        
        return applications.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public CandidateApplicationResponse updateApplicationStatus(Long openingId, Long candidateId, String status, Long userId) {
        log.info("Updating application status for candidate {} in opening {} to {}", candidateId, openingId, status);
        
        CandidateOpening application = candidateOpeningRepository.findByCandidateIdAndOpeningId(candidateId, openingId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        application.setApplicationStatus(status);
        CandidateOpening updated = candidateOpeningRepository.save(application);
        
        return mapToResponse(updated);
    }
    
    @Transactional(readOnly = true)
    public List<CandidateApplicationResponse> getApplicationsByStatus(Long openingId, String status) {
        log.info("Fetching {} applications for opening {}", status, openingId);
        
        List<CandidateOpening> applications = candidateOpeningRepository.findByOpeningIdAndStatus(openingId, status);
        
        return applications.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public long countOpeningApplications(Long openingId) {
        return candidateOpeningRepository.countByOpeningId(openingId);
    }
    
    @Transactional(readOnly = true)
    public long countCandidateApplications(Long candidateId) {
        return candidateOpeningRepository.countByCandidateId(candidateId);
    }
    
    @Transactional(readOnly = true)
    public boolean hasApplied(Long candidateId, Long openingId) {
        return candidateOpeningRepository.findByCandidateIdAndOpeningId(candidateId, openingId).isPresent();
    }
    
    @Transactional(readOnly = true)
    public List<Long> getAppliedCandidateIds(Long openingId) {
        return candidateOpeningRepository.findCandidateIdsByOpeningId(openingId);
    }
    
    @Transactional(readOnly = true)
    public List<Long> getAppliedOpeningIds(Long candidateId) {
        return candidateOpeningRepository.findOpeningIdsByCandidateId(candidateId);
    }
    
    private CandidateApplicationResponse mapToResponse(CandidateOpening application) {
        Candidate candidate = application.getCandidate();
        Opening opening = application.getOpening();
        
        String appliedByName = userRepository.findById(application.getAppliedBy())
            .map(User::getFullName)
            .orElse("Unknown");
        
        String candidateName = (candidate.getFirstName() != null ? candidate.getFirstName() : "") +
                               " " +
                               (candidate.getLastName() != null ? candidate.getLastName() : "");
        candidateName = candidateName.trim();

        return CandidateApplicationResponse.builder()
            .id(application.getId())
            .candidateId(candidate.getId())
            .candidateName(candidateName)
            .candidateEmail(candidate.getEmail())
            .candidatePhone(candidate.getPhone())
            .candidateSkills(candidate.getSkills())
            .candidateExperience(candidate.getExperience())
            .openingId(opening.getId())
            .openingTitle(opening.getTitle())
            .openingDepartment(opening.getDepartment())
            .openingLocation(opening.getLocation())
            .appliedAt(application.getAppliedAt())
            .applicationStatus(application.getApplicationStatus())
            .notes(application.getNotes())
            .appliedByName(appliedByName)
            .updatedAt(application.getUpdatedAt())
            .build();
    }
}
