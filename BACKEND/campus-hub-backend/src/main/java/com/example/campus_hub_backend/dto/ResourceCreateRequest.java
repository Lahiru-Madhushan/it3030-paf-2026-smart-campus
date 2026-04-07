package com.example.campus_hub_backend.dto;

import com.example.campus_hub_backend.enumtype.ResourceCondition;
import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.enumtype.ResourceType;
import com.example.campus_hub_backend.model.AssetIssue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceCreateRequest {

    @NotBlank(message = "Resource code is required")
    private String resourceCode;

    @NotBlank(message = "Name is required")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Resource type is required")
    private ResourceType resourceType;

    @NotBlank(message = "Category is required")
    private String category;

    @Min(value = 0, message = "Capacity must be greater than or equal to 0")
    private Integer capacity;

    private String building;
    private Integer floorNumber;
    private String roomNumber;
    private String locationText;
    private LocalTime availableFrom;
    private LocalTime availableTo;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private ResourceCondition condition;
    private Boolean borrowed;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0")
    @DecimalMax(value = "5.0", message = "Rating must be at most 5")
    private Double rating;

    private LocalDate lastServiceDate;
    private LocalDate nextServiceDate;

    @Min(value = 0, message = "Total bookings must be greater than or equal to 0")
    private Integer totalBookings;

    @Min(value = 0, message = "Today's bookings must be greater than or equal to 0")
    private Integer bookingsToday;

    private List<String> amenities;
    private List<Integer> monthlyBookings;
    private List<AssetIssue> issues;

    private String imageUrl;
    private Boolean requiresApproval;
    private Boolean isActive;
}
