package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    Otp findByEmail(String email);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Otp o WHERE o.email = :email")
    void deleteByEmail(@Param("email") String email);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expirationTime < CURRENT_TIMESTAMP")
    void deleteExpiredOtps();
}