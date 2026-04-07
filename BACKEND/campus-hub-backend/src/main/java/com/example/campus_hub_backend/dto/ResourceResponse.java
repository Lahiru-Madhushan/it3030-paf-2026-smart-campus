package com.example.campus_hub_backend.dto;

import com.example.campus_hub_backend.enumtype.ResourceCondition;
import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.enumtype.ResourceType;
import com.example.campus_hub_backend.model.AssetIssue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

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
    private ResourceCondition condition;
    private Boolean borrowed;
    private Double rating;
    private LocalDate lastServiceDate;
    private LocalDate nextServiceDate;
    private Integer totalBookings;
    private Integer bookingsToday;
    private List<String> amenities;
    private List<Integer> monthlyBookings;
    private List<AssetIssue> issues;
    private String imageUrl;
    private Boolean requiresApproval;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
