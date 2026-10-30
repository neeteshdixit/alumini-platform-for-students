package com.alumniconnect.service;

import com.alumniconnect.dto.ApiResponse;
import com.alumniconnect.dto.LoginRequest;
import com.alumniconnect.dto.SignupRequest;
import com.alumniconnect.dto.UserResponse;
import com.alumniconnect.model.User;
import com.alumniconnect.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ApiResponse<UserResponse> register(SignupRequest request) {
        // 1. Validation
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ApiResponse.error("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ApiResponse.error("Password must be at least 6 characters.");
        }
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            return ApiResponse.error("An account with this email already exists.");
        }

        // 2. Map DTO to Entity
        User user = new User();
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : "");
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCollege(request.getCollege() != null ? request.getCollege() : "General Campus");

        // Role normalization
        String role = "STUDENT";
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("alumni")) {
            role = "ALUMNI";
        }
        user.setRole(role);

        // Role-specific fields
        if ("STUDENT".equals(role)) {
            user.setRollNumber(request.getRollNumber());
            user.setBranch(request.getBranch());
        } else {
            user.setCompany(request.getCompany());
            user.setDesignation(request.getDesignation());
            user.setBatch(request.getBatch());
        }

        // 3. Save to MySQL
        User savedUser = userRepository.save(user);

        return ApiResponse.success("Registration successful! Welcome to AlumniConnect.", UserResponse.fromUser(savedUser));
    }

    public ApiResponse<UserResponse> login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ApiResponse.error("Email and password are required.");
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim().toLowerCase());
        if (userOpt.isEmpty()) {
            return ApiResponse.error("Invalid email or password.");
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ApiResponse.error("Invalid email or password.");
        }

        return ApiResponse.success("Login successful!", UserResponse.fromUser(user));
    }
}

