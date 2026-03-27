package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.entity.Otp;
import com.example.campus_hub_backend.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class otpService {

    private final JavaMailSender emailSender;
    private final OtpRepository otpRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public otpService(JavaMailSender emailSender, OtpRepository otpRepository) {
        this.emailSender = emailSender;
        this.otpRepository = otpRepository;
    }

    // ================================
    // Generate OTP
    // ================================
    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // ================================
    // Send OTP Email
    // ================================
    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp + "\n\nThis code will expire in 5 minutes.");
        emailSender.send(message);
    }

    // ================================
    // Save OTP to Database (Delete existing if present)
    // ================================
    public void saveOtp(String email, String otp) {
        // Delete existing OTP for this email to avoid duplicates
        deleteOtp(email);
        
        // Save new OTP
        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpirationTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otpEntity);
    }

    // ================================
    // Verify OTP (Check if OTP is valid and not expired)
    // ================================
    public boolean verifyOtp(String email, String otp) {
        Otp otpEntity = otpRepository.findByEmail(email);
        
        if (otpEntity != null && 
            otpEntity.getOtp().equals(otp) && 
            otpEntity.getExpirationTime().isAfter(LocalDateTime.now())) {
            return true;
        }
        return false;
    }

    // ================================
    // Delete OTP after verification
    // ================================
    public void deleteOtp(String email) {
        otpRepository.deleteByEmail(email);
    }
}