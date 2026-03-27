package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.AuthResponse;
import com.example.campus_hub_backend.dto.LoginRequest;
import com.example.campus_hub_backend.dto.RegisterRequest;
import com.example.campus_hub_backend.dto.UserResponse;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.entity.Otp;
import com.example.campus_hub_backend.enumtype.Role;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.repository.UserRepository;
import com.example.campus_hub_backend.repository.OtpRepository;
import com.example.campus_hub_backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final OtpRepository otpRepository;
    private final otpService otpService;
    private final Map<String, RegisterRequest> pendingRegistrations = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       OtpRepository otpRepository,
                       otpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.otpRepository = otpRepository;
        this.otpService = otpService;
    }

    // Method to send OTP for registration
    @Transactional
    public void sendRegistrationOtp(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        RegisterRequest pendingRequest = new RegisterRequest();
        pendingRequest.setName(request.getName());
        pendingRequest.setEmail(normalizedEmail);
        pendingRequest.setPassword(request.getPassword());
        pendingRegistrations.put(normalizedEmail, pendingRequest);

        String otp = otpService.generateOtp();
        otpService.sendOtp(normalizedEmail, otp);
        otpService.saveOtp(normalizedEmail, otp);
    }
    
    // Method to complete registration after OTP verification
    @Transactional
    public UserResponse completeRegistration(String email, RegisterRequest request) {
        // Check if user already exists (in case OTP was sent but not registered)
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Transactional
    public UserResponse completeRegistration(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        RegisterRequest pendingRequest = pendingRegistrations.get(normalizedEmail);

        if (pendingRequest == null) {
            throw new BadRequestException("Registration data not found. Please request OTP again.");
        }

        UserResponse response = completeRegistration(normalizedEmail, pendingRequest);
        pendingRegistrations.remove(normalizedEmail);
        return response;
    }
    
    // Old register method - kept for backward compatibility but modified
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Generate OTP for email verification
        String otp = otpService.generateOtp();
        otpService.sendOtp(request.getEmail(), otp);
        
        // Store OTP in the database with expiration time (5 minutes)
        // This will automatically delete any existing OTP for this email
        otpService.saveOtp(request.getEmail(), otp);

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    // Method to verify OTP during registration
    @Transactional
    public void verifyRegistrationOtp(String email, String otp) {
        boolean isValid = otpService.verifyOtp(email, otp);
        
        if (!isValid) {
            throw new BadRequestException("Invalid or expired OTP");
        }
        
        // Delete OTP after successful verification
        otpService.deleteOtp(email);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found after authentication"));

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Current user not found"));
        return mapToUserResponse(user);
    }

    @Transactional
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // Method to update user password after OTP verification
    @Transactional
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // Check if email is taken
    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}