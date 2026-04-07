package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.NotificationResponse;
import com.example.campus_hub_backend.entity.Notification;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.NotificationType;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.NotificationRepository;
import com.example.campus_hub_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createNotification(User recipient,
                                   NotificationType type,
                                   String title,
                                   String message,
                                   String referenceType,
                                   Long referenceId) {

        if (recipient == null || recipient.getId() == null) {
            throw new BadRequestException("Recipient is required for notification");
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReferenceType(referenceType);
        notification.setReferenceId(referenceId);

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications(String userEmail) {
        User user = getUserByEmail(userEmail);

        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public long getUnreadCount(String userEmail) {
        User user = getUserByEmail(userEmail);
        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long notificationId, String userEmail) {
        User user = getUserByEmail(userEmail);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new BadRequestException("You are not allowed to update this notification");
        }

        notification.setRead(true);
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = getUserByEmail(userEmail);

        List<Notification> notifications = notificationRepository.findByRecipientAndReadFalse(user);
        notifications.forEach(n -> n.setRead(true));
    }

    @Transactional
    public void deleteNotification(Long notificationId, String userEmail) {
        User user = getUserByEmail(userEmail);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new BadRequestException("You are not allowed to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private NotificationResponse mapToDto(Notification notification) {
        NotificationResponse dto = new NotificationResponse();
        dto.setId(notification.getId());
        dto.setType(notification.getType());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setReferenceType(notification.getReferenceType());
        dto.setReferenceId(notification.getReferenceId());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}