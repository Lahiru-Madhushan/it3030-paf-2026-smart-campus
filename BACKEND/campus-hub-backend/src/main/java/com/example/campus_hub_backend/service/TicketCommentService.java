package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.CommentRequestDTO;
import com.example.campus_hub_backend.entity.IncidentTicket;
import com.example.campus_hub_backend.entity.TicketComment;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.IncidentTicketRepository;
import com.example.campus_hub_backend.repository.TicketCommentRepository;
import com.example.campus_hub_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final IncidentTicketRepository ticketRepository;
    private final UserRepository userRepository;

    // Add a comment to a ticket
    public TicketComment addComment(Long ticketId, CommentRequestDTO request, String userEmail) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TicketComment comment = new TicketComment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setCreatedBy(user);

        return commentRepository.save(comment);
    }

    // Get all comments for a ticket
    public List<TicketComment> getCommentsByTicket(Long ticketId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        return commentRepository.findByTicket(ticket);
    }

    // Edit a comment (only owner can edit)
    public TicketComment editComment(Long commentId, CommentRequestDTO request, String userEmail) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getCreatedBy().getEmail().equals(userEmail)) {
            throw new BadRequestException("You are not allowed to edit this comment");
        }

        comment.setContent(request.getContent());
        return commentRepository.save(comment);
    }

    // Delete a comment (only owner can delete)
    public void deleteComment(Long commentId, String userEmail) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getCreatedBy().getEmail().equals(userEmail)) {
            throw new BadRequestException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }
}