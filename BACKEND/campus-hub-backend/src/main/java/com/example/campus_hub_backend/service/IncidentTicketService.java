package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.TicketRequestDTO;
import com.example.campus_hub_backend.dto.TicketResponseDTO;
import com.example.campus_hub_backend.entity.IncidentTicket;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.TicketStatus;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.IncidentTicketRepository;
import com.example.campus_hub_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final UserRepository userRepository;

    // Create a new ticket
    public TicketResponseDTO createTicket(TicketRequestDTO request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setLocation(request.getLocation());
        ticket.setContactDetails(request.getContactDetails());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedBy(user);

        IncidentTicket saved = ticketRepository.save(ticket);
        return mapToResponseDTO(saved);
    }

    // Get all tickets (Admin only)
    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get tickets by logged in user
    public List<TicketResponseDTO> getMyTickets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ticketRepository.findByCreatedBy(user)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get tickets assigned to logged in technician
    public List<TicketResponseDTO> getAssignedTickets(String technicianEmail) {
        User technician = userRepository.findByEmail(technicianEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ticketRepository.findByAssignedTo(technician)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get one ticket by id
    public TicketResponseDTO getTicketById(Long id) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return mapToResponseDTO(ticket);
    }

    // Update ticket status with workflow enforcement
    public TicketResponseDTO updateStatus(Long id, TicketStatus newStatus, String reason) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        TicketStatus currentStatus = ticket.getStatus();
        boolean isValidTransition = false;

        switch (currentStatus) {
            case OPEN:
                isValidTransition = (newStatus == TicketStatus.IN_PROGRESS
                        || newStatus == TicketStatus.REJECTED);
                break;
            case IN_PROGRESS:
                isValidTransition = (newStatus == TicketStatus.RESOLVED
                        || newStatus == TicketStatus.REJECTED);
                break;
            case RESOLVED:
                isValidTransition = (newStatus == TicketStatus.CLOSED);
                break;
            case CLOSED:
            case REJECTED:
                isValidTransition = false;
                break;
        }

        if (!isValidTransition) {
            throw new BadRequestException(
                "Cannot change status from " + currentStatus + " to " + newStatus
            );
        }

        ticket.setStatus(newStatus);

        if (newStatus == TicketStatus.REJECTED) {
            ticket.setRejectionReason(reason);
        }
        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        IncidentTicket saved = ticketRepository.save(ticket);
        return mapToResponseDTO(saved);
    }

    // Assign technician to ticket (Admin only)
    public TicketResponseDTO assignTechnician(Long ticketId, String technicianEmail) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        User technician = userRepository.findByEmail(technicianEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        ticket.setAssignedTo(technician);
        ticket.setStatus(TicketStatus.IN_PROGRESS);

        IncidentTicket saved = ticketRepository.save(ticket);
        return mapToResponseDTO(saved);
    }

    // Delete ticket (Admin only)
    public void deleteTicket(Long id) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        ticketRepository.delete(ticket);
    }

    // Map entity to response DTO
    private TicketResponseDTO mapToResponseDTO(IncidentTicket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setCategory(ticket.getCategory());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        dto.setLocation(ticket.getLocation());
        dto.setContactDetails(ticket.getContactDetails());
        dto.setRejectionReason(ticket.getRejectionReason());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        dto.setFirstResponseAt(ticket.getFirstResponseAt());

        if (ticket.getCreatedBy() != null) {
            dto.setCreatedByName(ticket.getCreatedBy().getName());
            dto.setCreatedByEmail(ticket.getCreatedBy().getEmail());
        }
        if (ticket.getAssignedTo() != null) {
            dto.setAssignedToName(ticket.getAssignedTo().getName());
            dto.setAssignedToEmail(ticket.getAssignedTo().getEmail());
        }
        if (ticket.getComments() != null) {
            dto.setTotalComments(ticket.getComments().size());
        }
        if (ticket.getAttachments() != null) {
            dto.setTotalAttachments(ticket.getAttachments().size());
            dto.setAttachmentPaths(ticket.getAttachments()
                    .stream()
                    .map(a -> a.getFilePath())
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}