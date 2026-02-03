package com.startica.privateapp.account.service;

import com.startica.privateapp.account.dto.CreateHRRequest;
import com.startica.privateapp.account.dto.HRResponse;
import com.startica.privateapp.account.dto.UpdateHRRequest;
import com.startica.privateapp.common.exception.BusinessException;
import com.startica.privateapp.common.exception.DuplicateResourceException;
import com.startica.privateapp.common.exception.ResourceNotFoundException;
import com.startica.privateapp.model.Role;
import com.startica.privateapp.model.User;
import com.startica.privateapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

	@Autowired
    private UserRepository userRepository;
    
	@Autowired
	private PasswordEncoder passwordEncoder;

    @Transactional
    public HRResponse createHR(CreateHRRequest request) {
        // Check for duplicates
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Create HR user
        User hrUser = new User();
        hrUser.setUsername(request.getUsername());
        hrUser.setPassword(passwordEncoder.encode(request.getPassword()));
        hrUser.setFullName(request.getFullName());
        hrUser.setEmail(request.getEmail());
        hrUser.setPhone(request.getPhone());
        hrUser.setRole(Role.HR);
        hrUser.setActive(true);

        User savedUser = userRepository.save(hrUser);
        return mapToResponse(savedUser);
    }

    @Transactional
    public HRResponse updateHR(Long id, UpdateHRRequest request) {
        User hrUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (hrUser.getRole() != Role.HR) {
            throw new BusinessException("User is not an HR");
        }

        // Update fields if provided
        if (request.getFullName() != null) {
            hrUser.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(hrUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("User", "email", request.getEmail());
            }
            hrUser.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            hrUser.setPhone(request.getPhone());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            hrUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(hrUser);
        return mapToResponse(updatedUser);
    }

    @Transactional
    public void activateDeactivateHR(Long id, boolean active) {
        User hrUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (hrUser.getRole() != Role.HR) {
            throw new BusinessException("User is not an HR");
        }

        hrUser.setActive(active);
        userRepository.save(hrUser);
    }

    public List<HRResponse> getAllHR() {
        List<User> hrUsers = userRepository.findByRole(Role.HR);
        return hrUsers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<HRResponse> getAllHRPaginated(Pageable pageable) {
        Page<User> hrUsers = userRepository.findByRole(Role.HR, pageable);
        return hrUsers.map(this::mapToResponse);
    }

    public HRResponse getHRById(Long id) {
        User hrUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (hrUser.getRole() != Role.HR) {
            throw new BusinessException("User is not an HR");
        }

        return mapToResponse(hrUser);
    }

    private HRResponse mapToResponse(User user) {
        return HRResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.getActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @Transactional
    public void deleteHR(Long id) {

        User hrUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (hrUser.getRole() != Role.HR) {
            throw new BusinessException("User is not an HR");
        }

        // Optional safety check
        if (hrUser.getActive()) {
            throw new BusinessException("Deactivate HR before deleting");
        }

        userRepository.deleteById(id);
    }

}

