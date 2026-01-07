package com.startica.privateapp.opening.service;

import com.startica.privateapp.common.exception.ResourceNotFoundException;
import com.startica.privateapp.model.User;
import com.startica.privateapp.opening.dto.CreateOpeningRequest;
import com.startica.privateapp.opening.dto.OpeningResponse;
import com.startica.privateapp.opening.dto.UpdateOpeningRequest;
import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.opening.model.OpeningStatus;
import com.startica.privateapp.opening.repository.OpeningRepository;
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
public class OpeningService {
    
    private final OpeningRepository openingRepository;
    private final UserRepository userRepository;
    private final CandidateApplicationService candidateApplicationService;
    
    @Transactional(readOnly = true)
    public Page<OpeningResponse> getAllOpenings(String search, OpeningStatus status, String department,
                                                 int page, int size, String sortBy, String sortDir, User currentUser) {
        log.info("Fetching openings - search: {}, status: {}, department: {}, page: {}, size: {}",
                search, status, department, page, size);
        
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Opening> openings;
        if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
            // HR users see only openings they created
            openings = openingRepository.searchOpeningsByCreatedBy(search, status, department, currentUser.getId(), pageable);
        } else {
            // Admin sees all openings
            openings = openingRepository.searchOpenings(search, status, department, pageable);
        }
        
        return openings.map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public OpeningResponse getOpeningById(Long id) {
        log.info("Fetching opening by id: {}", id);
        Opening opening = openingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opening not found with id: " + id));
        return mapToResponse(opening);
    }
    
    @Transactional
    public OpeningResponse createOpening(CreateOpeningRequest request, Long userId) {
        log.info("Creating new opening: {} by user: {}", request.getTitle(), userId);
        
        Opening opening = Opening.builder()
                .title(request.getTitle())
                .department(request.getDepartment())
                .location(request.getLocation())
                .type(request.getType())
                .positions(request.getPositions())
                .experience(request.getExperience())
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .skills(request.getSkills())
                .description(request.getDescription())
                .responsibilities(request.getResponsibilities())
                .requirements(request.getRequirements())
                .status(request.getStatus() != null ? request.getStatus() : OpeningStatus.ACTIVE)
                .createdBy(userId)
                .build();
        
        Opening saved = openingRepository.save(opening);
        log.info("Opening created successfully with id: {}", saved.getId());
        
        return mapToResponse(saved);
    }
    
    @Transactional
    public OpeningResponse updateOpening(Long id, UpdateOpeningRequest request, Long userId) {
        log.info("Updating opening: {} by user: {}", id, userId);
        
        Opening opening = openingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opening not found with id: " + id));
        
        if (request.getTitle() != null) opening.setTitle(request.getTitle());
        if (request.getDepartment() != null) opening.setDepartment(request.getDepartment());
        if (request.getLocation() != null) opening.setLocation(request.getLocation());
        if (request.getType() != null) opening.setType(request.getType());
        if (request.getPositions() != null) opening.setPositions(request.getPositions());
        if (request.getExperience() != null) opening.setExperience(request.getExperience());
        if (request.getMinSalary() != null) opening.setMinSalary(request.getMinSalary());
        if (request.getMaxSalary() != null) opening.setMaxSalary(request.getMaxSalary());
        if (request.getSkills() != null) opening.setSkills(request.getSkills());
        if (request.getDescription() != null) opening.setDescription(request.getDescription());
        if (request.getResponsibilities() != null) opening.setResponsibilities(request.getResponsibilities());
        if (request.getRequirements() != null) opening.setRequirements(request.getRequirements());
        if (request.getStatus() != null) opening.setStatus(request.getStatus());
        
        opening.setUpdatedBy(userId);
        
        Opening updated = openingRepository.save(opening);
        log.info("Opening updated successfully");
        
        return mapToResponse(updated);
    }
    
    @Transactional
    public void deleteOpening(Long id, Long userId) {
        log.info("Deleting opening: {} by user: {}", id, userId);
        
        Opening opening = openingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opening not found with id: " + id));
        
        openingRepository.delete(opening);
        log.info("Opening deleted successfully");
    }
    
    @Transactional
    public OpeningResponse updateOpeningStatus(Long id, OpeningStatus status, Long userId) {
        log.info("Updating opening status: {} to {} by user: {}", id, status, userId);
        
        Opening opening = openingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opening not found with id: " + id));
        
        opening.setStatus(status);
        opening.setUpdatedBy(userId);
        
        Opening updated = openingRepository.save(opening);
        log.info("Opening status updated successfully");
        
        return mapToResponse(updated);
    }
    
    @Transactional(readOnly = true)
    public List<OpeningResponse> getOpeningsByStatus(OpeningStatus status, User currentUser) {
        log.info("Fetching openings by status: {} for user: {}", status, currentUser.getId());
        List<Opening> openings;
        if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
            openings = openingRepository.findByStatusAndCreatedBy(status, currentUser.getId());
        } else {
            openings = openingRepository.findByStatus(status);
        }
        return openings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OpeningResponse> getOpeningsByDepartment(String department, User currentUser) {
        log.info("Fetching openings by department: {} for user: {}", department, currentUser.getId());
        List<Opening> openings;
        if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
            openings = openingRepository.findByDepartmentAndCreatedBy(department, currentUser.getId());
        } else {
            openings = openingRepository.findByDepartment(department);
        }
        return openings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Long countOpeningsByStatus(OpeningStatus status, User currentUser) {
        log.info("Counting openings by status: {} for user: {}", status, currentUser.getId());
        if (currentUser.getRole() == com.startica.privateapp.model.Role.HR) {
            return openingRepository.countByStatusAndCreatedBy(status, currentUser.getId());
        } else {
            return openingRepository.countByStatus(status);
        }
    }
    
    private OpeningResponse mapToResponse(Opening opening) {
        String createdByName = userRepository.findById(opening.getCreatedBy())
                .map(User::getFullName)
                .orElse("Unknown");
        
        String updatedByName = opening.getUpdatedBy() != null
                ? userRepository.findById(opening.getUpdatedBy()).map(User::getFullName).orElse("Unknown")
                : null;
        
        // Get applications count
        int applicationsCount = (int) candidateApplicationService.countOpeningApplications(opening.getId());
        
        return OpeningResponse.builder()
                .id(opening.getId())
                .title(opening.getTitle())
                .department(opening.getDepartment())
                .location(opening.getLocation())
                .type(opening.getType())
                .positions(opening.getPositions())
                .experience(opening.getExperience())
                .minSalary(opening.getMinSalary())
                .maxSalary(opening.getMaxSalary())
                .skills(opening.getSkills())
                .description(opening.getDescription())
                .responsibilities(opening.getResponsibilities())
                .requirements(opening.getRequirements())
                .status(opening.getStatus())
                .applicationsCount(applicationsCount)
                .createdBy(opening.getCreatedBy())
                .updatedBy(opening.getUpdatedBy())
                .createdByName(createdByName)
                .updatedByName(updatedByName)
                .createdAt(opening.getCreatedAt())
                .updatedAt(opening.getUpdatedAt())
                .build();
    }
}
