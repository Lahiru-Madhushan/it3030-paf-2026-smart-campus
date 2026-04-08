package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.CommentRequestDTO;
import com.example.campus_hub_backend.dto.CommentResponseDTO;
import com.example.campus_hub_backend.entity.IncidentTicket;
import com.example.campus_hub_backend.entity.TicketComment;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.NotificationType;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.IncidentTicketRepository;
import com.example.campus_hub_backend.repository.TicketCommentRepository;
import com.example.campus_hub_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.example.campus_hub_backend.enumtype.NotificationType;

@Service
@RequiredArgsConstructor
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final IncidentTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

public CommentResponseDTO addComment(Long ticketId, CommentRequestDTO request, String userEmail) {
    IncidentTicket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

    User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (ticket.getFirstResponseAt() == null) {
        ticket.setFirstResponseAt(LocalDateTime.now());
        ticketRepository.save(ticket);
    }

    TicketComment comment = new TicketComment();
    comment.setContent(request.getContent());
    comment.setResolutionNote(request.isResolutionNote());
    comment.setTicket(ticket);
    comment.setCreatedBy(user);

    TicketComment saved = commentRepository.save(comment);

    if (!ticket.getCreatedBy().getId().equals(user.getId())) {
        notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET_COMMENT,
                "New comment on your ticket",
                user.getName() + " commented on ticket \"" + ticket.getTitle() + "\".",
                "TICKET",
                ticket.getId()
        );
    }

    if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().getId().equals(user.getId())) {
        notificationService.createNotification(
                ticket.getAssignedTo(),
                NotificationType.TICKET_COMMENT,
                "New comment on assigned ticket",
                user.getName() + " commented on ticket \"" + ticket.getTitle() + "\".",
                "TICKET",
                ticket.getId()
        );
    }

    return mapToDTO(saved);
}

    public List<CommentResponseDTO> getCommentsByTicket(Long ticketId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        return commentRepository.findByTicket(ticket)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CommentResponseDTO editComment(Long commentId, CommentRequestDTO request, String userEmail) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        if (!comment.getCreatedBy().getEmail().equals(userEmail)) {
            throw new BadRequestException("You are not allowed to edit this comment");
        }
        comment.setContent(request.getContent());
        return mapToDTO(commentRepository.save(comment));
    }

    public void deleteComment(Long commentId, String userEmail) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        if (!comment.getCreatedBy().getEmail().equals(userEmail)) {
            throw new BadRequestException("You are not allowed to delete this comment");
        }
        commentRepository.delete(comment);
    }

    private CommentResponseDTO mapToDTO(TicketComment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setResolutionNote(comment.isResolutionNote());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setTicketId(comment.getTicket().getId());
        if (comment.getCreatedBy() != null) {
            dto.setCreatedByName(comment.getCreatedBy().getName());
            dto.setCreatedByEmail(comment.getCreatedBy().getEmail());
        }
        return dto;
    }
}