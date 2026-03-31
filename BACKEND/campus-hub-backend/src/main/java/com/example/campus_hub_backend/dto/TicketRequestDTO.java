package com.example.campus_hub_backend.dto;

import com.example.campus_hub_backend.enumtype.TicketCategory;
import com.example.campus_hub_backend.enumtype.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Location is required")
    private String location;

    private String contactDetails;
}