package com.example.campus_hub_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponseDTO {
    private Long id;
    private String content;
    private boolean resolutionNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long ticketId;
    private String createdByName;
    private String createdByEmail;
}