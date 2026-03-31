package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.IncidentTicket;
import com.example.campus_hub_backend.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

    // Get all attachments for a specific ticket
    List<TicketAttachment> findByTicket(IncidentTicket ticket);

    // Count attachments for a ticket (we need this to enforce max 3 limit)
    long countByTicket(IncidentTicket ticket);
}