package com.startica.privateapp.auth.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String fullName;
    private String email;
    private String phone;

    private String currentPassword;
    private String newPassword;
}
