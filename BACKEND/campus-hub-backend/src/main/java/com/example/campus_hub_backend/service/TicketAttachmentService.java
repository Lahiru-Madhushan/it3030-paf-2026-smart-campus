package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.entity.IncidentTicket;
import com.example.campus_hub_backend.entity.TicketAttachment;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.IncidentTicketRepository;
import com.example.campus_hub_backend.repository.TicketAttachmentRepository;
import com.example.campus_hub_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketAttachmentService {

    private final TicketAttachmentRepository attachmentRepository;
    private final IncidentTicketRepository ticketRepository;
    private final UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/tickets/";

    // Upload image to a ticket (max 3 images)
    public TicketAttachment uploadAttachment(Long ticketId, MultipartFile file, String userEmail) throws IOException {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check max 3 attachments limit
        long existingCount = attachmentRepository.countByTicket(ticket);
        if (existingCount >= 3) {
            throw new BadRequestException("Maximum 3 attachments allowed per ticket");
        }

        // Create uploads folder if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique file name
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
        Path filePath = uploadPath.resolve(uniqueFileName);

        // Save file to disk
        Files.copy(file.getInputStream(), filePath);

        // Save to database
        TicketAttachment attachment = new TicketAttachment();
        attachment.setFileName(originalFileName);
        attachment.setFilePath(UPLOAD_DIR + uniqueFileName);
        attachment.setFileType(file.getContentType());
        attachment.setTicket(ticket);
        attachment.setUploadedBy(user);

        return attachmentRepository.save(attachment);
    }

    // Get all attachments for a ticket
    public List<TicketAttachment> getAttachmentsByTicket(Long ticketId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        return attachmentRepository.findByTicket(ticket);
    }

    // Delete an attachment
    public void deleteAttachment(Long attachmentId) throws IOException {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));

        Path filePath = Paths.get(attachment.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        attachmentRepository.delete(attachment);
    }
}