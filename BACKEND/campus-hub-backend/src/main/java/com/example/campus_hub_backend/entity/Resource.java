package com.example.campus_hub_backend.entity;

import com.example.campus_hub_backend.converter.AssetIssueListJsonConverter;
import com.example.campus_hub_backend.converter.IntegerListJsonConverter;
import com.example.campus_hub_backend.converter.StringListJsonConverter;
import com.example.campus_hub_backend.enumtype.ResourceCondition;
import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.enumtype.ResourceType;
import com.example.campus_hub_backend.model.AssetIssue;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "resources",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_resource_code", columnNames = "resource_code")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_code", nullable = false, unique = true, length = 50)
    private String resourceCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false, length = 30)
    private ResourceType resourceType;

    @Column(nullable = false, length = 100)
    private String category;

    private Integer capacity;

    @Column(length = 100)
    private String building;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(name = "location_text", length = 200)
    private String locationText;

    @Column(name = "available_from")
    private LocalTime availableFrom;

    @Column(name = "available_to")
    private LocalTime availableTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ResourceStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_condition", nullable = false, length = 30)
    @Default
    private ResourceCondition condition = ResourceCondition.GOOD;

    @Column(nullable = false)
    @Default
    private Boolean borrowed = false;

    @Column(nullable = false)
    @Default
    private Double rating = 0.0;

    @Column(name = "last_service_date")
    private LocalDate lastServiceDate;

    @Column(name = "next_service_date")
    private LocalDate nextServiceDate;

    @Column(name = "total_bookings", nullable = false)
    @Default
    private Integer totalBookings = 0;

    @Column(name = "bookings_today", nullable = false)
    @Default
    private Integer bookingsToday = 0;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    @Default
    private List<String> amenities = new ArrayList<>();

    @Convert(converter = IntegerListJsonConverter.class)
    @Column(name = "monthly_bookings", columnDefinition = "TEXT")
    @Default
    private List<Integer> monthlyBookings = new ArrayList<>();

    @Convert(converter = AssetIssueListJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    @Default
    private List<AssetIssue> issues = new ArrayList<>();

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "requires_approval", nullable = false)
    @Default
    private Boolean requiresApproval = false;

    @Column(name = "is_active", nullable = false)
    @Default
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.requiresApproval == null) {
            this.requiresApproval = false;
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.borrowed == null) {
            this.borrowed = false;
        }
        if (this.condition == null) {
            this.condition = ResourceCondition.GOOD;
        }
        if (this.rating == null) {
            this.rating = 0.0;
        }
        if (this.totalBookings == null) {
            this.totalBookings = 0;
        }
        if (this.bookingsToday == null) {
            this.bookingsToday = 0;
        }
        if (this.amenities == null) {
            this.amenities = new ArrayList<>();
        }
        if (this.monthlyBookings == null) {
            this.monthlyBookings = new ArrayList<>();
        }
        if (this.issues == null) {
            this.issues = new ArrayList<>();
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
