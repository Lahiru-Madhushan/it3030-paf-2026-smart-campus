package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.Notification;
import com.example.campus_hub_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    long countByRecipientAndReadFalse(User recipient);

    List<Notification> findByRecipientAndReadFalse(User recipient);
}