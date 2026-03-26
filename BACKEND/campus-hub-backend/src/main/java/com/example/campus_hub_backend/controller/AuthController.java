package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.dto.AuthResponse;
import com.example.campus_hub_backend.dto.ChangePasswordRequest;
import com.example.campus_hub_backend.dto.ForgotPasswordRequest;
import com.example.campus_hub_backend.dto.LoginRequest;
import com.example.campus_hub_backend.dto.RegisterRequest;
import com.example.campus_hub_backend.dto.ResetPasswordRequest;
import com.example.campus_hub_backend.dto.UserResponse;
import com.example.campus_hub_backend.service.AuthService;
import com.example.campus_hub_backend.service.PasswordResetService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService,
                          PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    // ==============================
    // REGISTER
    // ==============================
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    // ==============================
    // LOGIN
    // ==============================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ==============================
    // GET CURRENT USER
    // ==============================
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(
                authService.getCurrentUser(authentication.getName())
        );
    }

    // ==============================
    // CHANGE PASSWORD (LOGGED IN)
    // ==============================
    @PatchMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        authService.changePassword(
                email,
                request.getOldPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password updated successfully");
    }

    // ==============================
    // FORGOT PASSWORD (SEND TOKEN)
    // ==============================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        passwordResetService.forgotPassword(request.getEmail());

        return ResponseEntity.ok("Password reset link sent to email");
    }

    // ==============================
    // RESET PASSWORD (USING TOKEN)
    // ==============================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password has been reset successfully");
    }
}