package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.IncidentTicket;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.TicketStatus;
import com.example.campus_hub_backend.enumtype.TicketPriority;
import com.example.campus_hub_backend.enumtype.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {

    // Get all tickets created by a specific user
    List<IncidentTicket> findByCreatedBy(User user);

    // Get all tickets by status
    List<IncidentTicket> findByStatus(TicketStatus status);

    // Get all tickets by priority
    List<IncidentTicket> findByPriority(TicketPriority priority);

    // Get all tickets by category
    List<IncidentTicket> findByCategory(TicketCategory category);

    // Get all tickets assigned to a technician
    List<IncidentTicket> findByAssignedTo(User technician);
}