package com.startica.privateapp.auth.controller;

import com.startica.privateapp.auth.service.AccountService;
import com.startica.privateapp.auth.dto.*;
import com.startica.privateapp.auth.service.AuthService;
import com.startica.privateapp.common.response.ApiResponse;
import com.startica.privateapp.model.User;
import com.startica.privateapp.auth.dto.UpdateProfileRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        User user = authService.getCurrentUser();
        authService.logout(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                accountService.updateMyProfile(auth.getName(), request)
        );
    }
}
