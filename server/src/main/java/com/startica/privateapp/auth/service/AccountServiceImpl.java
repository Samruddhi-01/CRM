package com.startica.privateapp.auth.service;

import com.startica.privateapp.auth.dto.LoginResponse;
import com.startica.privateapp.auth.dto.UpdateProfileRequest;
import com.startica.privateapp.model.User;
import com.startica.privateapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepository userRepository;

    @Override
    public LoginResponse updateMyProfile(String username, UpdateProfileRequest req) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());

        userRepository.save(user);

        return LoginResponse.builder()
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .active(user.getActive())
                        .createdAt(user.getCreatedAt())
                        .lastLogin(user.getLastLogin())
                        .build())
                .build();
    }
}
