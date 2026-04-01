package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.IncidentTicket;
import com.example.campus_hub_backend.entity.TicketComment;
import com.example.campus_hub_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

    // Get all comments for a specific ticket
    List<TicketComment> findByTicket(IncidentTicket ticket);

    // Get all comments made by a specific user
    List<TicketComment> findByCreatedBy(User user);
}