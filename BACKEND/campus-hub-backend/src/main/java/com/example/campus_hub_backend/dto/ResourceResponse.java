package com.example.campus_hub_backend.dto;

import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.enumtype.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponse {

    private Long id;
    private String resourceCode;
    private String name;
    private String description;
    private ResourceType resourceType;
    private String category;
    private Integer capacity;
    private String building;
    private Integer floorNumber;
    private String roomNumber;
    private String locationText;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String imageUrl;
    private Boolean requiresApproval;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
