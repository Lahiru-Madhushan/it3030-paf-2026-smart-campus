package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.dto.CommentRequestDTO;
import com.example.campus_hub_backend.dto.CommentResponseDTO;
import com.example.campus_hub_backend.service.TicketCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketCommentController {

    private final TicketCommentService commentService;

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequestDTO request,
            Principal principal) {
        String email = principal.getName();
        CommentResponseDTO comment = commentService.addComment(id, request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(id));
    }

    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<CommentResponseDTO> editComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequestDTO request,
            Principal principal) {
        String email = principal.getName();
        CommentResponseDTO updated = commentService.editComment(commentId, request, email);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            Principal principal) {
        String email = principal.getName();
        commentService.deleteComment(commentId, email);
        return ResponseEntity.noContent().build();
    }
}