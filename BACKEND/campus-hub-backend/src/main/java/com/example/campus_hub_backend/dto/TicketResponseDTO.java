package com.example.campus_hub_backend.dto;

import com.example.campus_hub_backend.enumtype.TicketCategory;
import com.example.campus_hub_backend.enumtype.TicketPriority;
import com.example.campus_hub_backend.enumtype.TicketStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponseDTO {
    private Long id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String location;
    private String contactDetails;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime firstResponseAt;
    private String createdByName;
    private String createdByEmail;
    private String assignedToName;
    private String assignedToEmail;
    private int totalComments;
    private int totalAttachments;
    private List<String> attachmentPaths;
}