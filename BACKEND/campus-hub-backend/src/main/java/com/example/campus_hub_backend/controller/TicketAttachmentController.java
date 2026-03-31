package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.entity.TicketAttachment;
import com.example.campus_hub_backend.service.TicketAttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketAttachmentController {

    private final TicketAttachmentService attachmentService;

    // POST /api/tickets/{id}/attachments — Upload image
    @PostMapping("/{id}/attachments")
    public ResponseEntity<TicketAttachment> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Principal principal) throws IOException {
        String email = principal.getName();
        TicketAttachment attachment = attachmentService.uploadAttachment(id, file, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
    }

    // GET /api/tickets/{id}/attachments — Get all attachments
    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<TicketAttachment>> getAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(attachmentService.getAttachmentsByTicket(id));
    }

    // DELETE /api/tickets/{id}/attachments/{attachmentId} — Delete attachment
    @DeleteMapping("/{id}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long id,
            @PathVariable Long attachmentId) throws IOException {
        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.noContent().build();
    }
}