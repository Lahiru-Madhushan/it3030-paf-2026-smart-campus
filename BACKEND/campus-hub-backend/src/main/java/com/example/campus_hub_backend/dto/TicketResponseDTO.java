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

    // Who created the ticket
    private String createdByName;
    private String createdByEmail;

    // Assigned technician
    private String assignedToName;
    private String assignedToEmail;

    // Comments and attachments count
    private int totalComments;
    private int totalAttachments;

    // List of attachment file paths
    private List<String> attachmentPaths;
}