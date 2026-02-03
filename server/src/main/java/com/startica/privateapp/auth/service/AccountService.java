package com.startica.privateapp.auth.service;

import com.startica.privateapp.auth.dto.LoginResponse;
import com.startica.privateapp.auth.dto.UpdateProfileRequest;

public interface AccountService {

    LoginResponse updateMyProfile(String username, UpdateProfileRequest request);
}
