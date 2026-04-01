package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.dto.TicketRequestDTO;
import com.example.campus_hub_backend.dto.TicketResponseDTO;
import com.example.campus_hub_backend.enumtype.TicketStatus;
import com.example.campus_hub_backend.service.IncidentTicketService;
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
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    // POST /api/tickets — Create a new ticket (USER)
    @PostMapping
    public ResponseEntity<TicketResponseDTO> createTicket(
            @Valid @RequestBody TicketRequestDTO request,
            Principal principal) {
        String email = principal.getName();
        TicketResponseDTO response = ticketService.createTicket(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/tickets — Get all tickets (ADMIN)
    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/my — Get my tickets (USER)
    @GetMapping("/my")
    public ResponseEntity<List<TicketResponseDTO>> getMyTickets(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(ticketService.getMyTickets(email));
    }

    // GET /api/tickets/assigned — Get tickets assigned to me (TECHNICIAN)
    @GetMapping("/assigned")
    public ResponseEntity<List<TicketResponseDTO>> getAssignedTickets(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(ticketService.getAssignedTickets(email));
    }

    // GET /api/tickets/{id} — Get one ticket by id
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // PATCH /api/tickets/{id}/status — Update ticket status
    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(ticketService.updateStatus(id, status, reason));
    }

    // PATCH /api/tickets/{id}/assign — Assign technician
    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDTO> assignTechnician(
            @PathVariable Long id,
            @RequestParam String technicianEmail) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianEmail));
    }

    // DELETE /api/tickets/{id} — Delete ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}