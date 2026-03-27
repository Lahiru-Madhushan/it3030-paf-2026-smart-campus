package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.dto.*;
import com.example.campus_hub_backend.service.AuthService;
import com.example.campus_hub_backend.service.PasswordResetService;
import com.example.campus_hub_backend.service.otpService;
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
    private final otpService otpService;

    public AuthController(AuthService authService,
                          PasswordResetService passwordResetService,
                          otpService otpService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
        this.otpService = otpService;
    }

    // TEST ENDPOINT - Add this to verify controller is working
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("AuthController is working! Current time: " + System.currentTimeMillis());
    }

    // ==============================
    // REGISTER - STEP 1: SEND OTP
    // ==============================
    @PostMapping("/register/send-otp")
    public ResponseEntity<ApiResponse> sendRegistrationOtp(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.sendRegistrationOtp(request);
            return ResponseEntity.ok(new ApiResponse(true, "OTP sent to email. Please verify to complete registration."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ==============================
    // REGISTER - STEP 2: VERIFY OTP AND COMPLETE REGISTRATION
    // ==============================
    @PostMapping(value = "/register/verify", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> verifyRegistrationOtp(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
            
            if (!isOtpValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Invalid or expired OTP. Please request a new OTP."));
            }

            UserResponse userResponse = authService.completeRegistration(request.getEmail());
            otpService.deleteOtp(request.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ==============================
    // REGISTER - Alternative simplified version
    // ==============================
    @PostMapping("/register-simple")
    public ResponseEntity<?> registerSimple(@Valid @RequestBody RegisterRequest request) {
        try {
            // Generate OTP
            String otp = otpService.generateOtp();
            otpService.sendOtp(request.getEmail(), otp);
            otpService.saveOtp(request.getEmail(), otp);
            
            System.out.println("OTP for " + request.getEmail() + ": " + otp);
            
            return ResponseEntity.ok(new ApiResponse(true, "OTP sent: " + otp + " (Check console for debugging)"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
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
    public ResponseEntity<ApiResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        
        authService.changePassword(
                email,
                request.getOldPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully"));
    }

    // ==============================
    // FORGOT PASSWORD (SEND OTP)
    // ==============================
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        
        // Check if user exists
        if (!authService.isEmailTaken(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email not found"));
        }
        
        String otp = otpService.generateOtp();
        otpService.sendOtp(request.getEmail(), otp);
        otpService.saveOtp(request.getEmail(), otp);

        return ResponseEntity.ok(new ApiResponse(true, "OTP sent to email, please verify."));
    }

    // ==============================
    // VERIFY OTP
    // ==============================
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (isOtpValid) {
            return ResponseEntity.ok(new ApiResponse(true, "OTP verified successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Invalid or expired OTP."));
        }
    }

    // ==============================
    // RESET PASSWORD (USING OTP)
    // ==============================
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!isOtpValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Invalid or expired OTP."));
        }

        passwordResetService.resetPassword(request.getEmail(), request.getNewPassword());
        otpService.deleteOtp(request.getEmail());

        return ResponseEntity.ok(new ApiResponse(true, "Password has been reset successfully"));
    }

    // ==============================
    // OAUTH SUCCESS
    // ==============================
    @GetMapping("/oauth-success")
    public ResponseEntity<String> oauthSuccess(
            @RequestParam String token,
            @RequestParam String email,
            @RequestParam String role,
            @RequestParam String name) {

        String response = """
                Google OAuth login successful!
                Token: %s
                Email: %s
                Role: %s
                Name: %s
                """.formatted(token, email, role, name);

        return ResponseEntity.ok(response);
    }
}