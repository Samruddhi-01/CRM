package com.startica.privateapp.account.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHRRequest {

    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private String password; // Optional - only if changing password
}

