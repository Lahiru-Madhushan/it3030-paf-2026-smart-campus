package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.NotificationResponse;
import com.example.campus_hub_backend.entity.Notification;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.NotificationType;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.NotificationRepository;
import com.example.campus_hub_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import java.util.List;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
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
        try {
            return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                    .stream()
                    .map(this::mapToDto)
                    .toList();
        } catch (DataAccessException ex) {
            if (isMissingNotificationsTable(ex)) {
                log.warn("Notifications table missing. Returning empty notifications.");
                return List.of();
            }
            throw ex;
        }
    }

    public long getUnreadCount(String userEmail) {
        User user = getUserByEmail(userEmail);
        try {
            return notificationRepository.countByRecipientAndReadFalse(user);
        } catch (DataAccessException ex) {
            if (isMissingNotificationsTable(ex)) {
                log.warn("Notifications table missing. Returning unread count 0.");
                return 0L;
            }
            throw ex;
        }
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

    private boolean isMissingNotificationsTable(Throwable ex) {
        Throwable current = ex;
        while (current != null) {
            String message = current.getMessage();
            if (message != null
                    && message.contains("notifications")
                    && message.contains("doesn't exist")) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }
}