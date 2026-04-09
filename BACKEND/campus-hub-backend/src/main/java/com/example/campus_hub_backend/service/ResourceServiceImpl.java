package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.ResourceCreateRequest;
import com.example.campus_hub_backend.dto.ResourceIssueReportRequest;
import com.example.campus_hub_backend.dto.ResourceResponse;
import com.example.campus_hub_backend.dto.ResourceStatusUpdateRequest;
import com.example.campus_hub_backend.dto.ResourceUpdateRequest;
import com.example.campus_hub_backend.entity.Resource;
import com.example.campus_hub_backend.enumtype.IssueStatus;
import com.example.campus_hub_backend.enumtype.ResourceCondition;
import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.enumtype.ResourceType;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.DuplicateResourceCodeException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.model.AssetIssue;
import com.example.campus_hub_backend.repository.ResourceRepository;
import com.example.campus_hub_backend.specification.ResourceSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public Page<ResourceResponse> getAllResources(
            ResourceType type,
            ResourceStatus status,
            String building,
            Integer minCapacity,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Resource> specification = Specification
                .where(ResourceSpecification.hasType(type))
                .and(ResourceSpecification.hasStatus(status))
                .and(ResourceSpecification.hasBuilding(building))
                .and(ResourceSpecification.hasMinCapacity(minCapacity))
                .and(ResourceSpecification.hasKeyword(keyword));

        return resourceRepository.findAll(specification, pageable).map(this::mapToResponse);
    }

    @Override
    public ResourceResponse getResourceById(Long id) {
        Resource resource = getResourceEntity(id);
        return mapToResponse(resource);
    }

    @Override
    public ResourceResponse createResource(ResourceCreateRequest request) {
        validateBusinessRules(
                request.getAvailableFrom(),
                request.getAvailableTo(),
                request.getResourceType(),
                request.getBuilding(),
                request.getRoomNumber(),
                request.getLastServiceDate(),
                request.getNextServiceDate(),
                request.getStatus(),
                request.getBorrowed(),
                request.getCondition(),
                request.getMonthlyBookings()
        );

        if (resourceRepository.existsByResourceCode(request.getResourceCode())) {
            throw new DuplicateResourceCodeException("Resource code already exists: " + request.getResourceCode());
        }

        Resource resource = Resource.builder()
                .resourceCode(request.getResourceCode())
                .name(request.getName())
                .description(request.getDescription())
                .resourceType(request.getResourceType())
                .category(request.getCategory())
                .capacity(request.getCapacity())
                .building(request.getBuilding())
                .floorNumber(request.getFloorNumber())
                .roomNumber(request.getRoomNumber())
                .locationText(request.getLocationText())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .status(request.getStatus())
                .condition(request.getCondition() == null ? ResourceCondition.GOOD : request.getCondition())
                .borrowed(Boolean.TRUE.equals(request.getBorrowed()))
                .rating(request.getRating() == null ? 0.0 : request.getRating())
                .lastServiceDate(request.getLastServiceDate())
                .nextServiceDate(request.getNextServiceDate())
                .totalBookings(request.getTotalBookings() == null ? 0 : request.getTotalBookings())
                .bookingsToday(request.getBookingsToday() == null ? 0 : request.getBookingsToday())
                .amenities(safeStringList(request.getAmenities()))
                .monthlyBookings(normalizeMonthlyBookings(request.getMonthlyBookings()))
                .issues(safeIssueList(request.getIssues()))
                .imageUrl(request.getImageUrl())
                .requiresApproval(Boolean.TRUE.equals(request.getRequiresApproval()))
                .isActive(request.getIsActive() == null || request.getIsActive())
                .build();

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponse updateResource(Long id, ResourceUpdateRequest request) {
        validateBusinessRules(
                request.getAvailableFrom(),
                request.getAvailableTo(),
                request.getResourceType(),
                request.getBuilding(),
                request.getRoomNumber(),
                request.getLastServiceDate(),
                request.getNextServiceDate(),
                request.getStatus(),
                request.getBorrowed(),
                request.getCondition(),
                request.getMonthlyBookings()
        );

        Resource existing = getResourceEntity(id);

        if (resourceRepository.existsByResourceCodeAndIdNot(request.getResourceCode(), id)) {
            throw new DuplicateResourceCodeException("Resource code already exists: " + request.getResourceCode());
        }

        existing.setResourceCode(request.getResourceCode());
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setResourceType(request.getResourceType());
        existing.setCategory(request.getCategory());
        existing.setCapacity(request.getCapacity());
        existing.setBuilding(request.getBuilding());
        existing.setFloorNumber(request.getFloorNumber());
        existing.setRoomNumber(request.getRoomNumber());
        existing.setLocationText(request.getLocationText());
        existing.setAvailableFrom(request.getAvailableFrom());
        existing.setAvailableTo(request.getAvailableTo());
        existing.setStatus(request.getStatus());
        existing.setCondition(request.getCondition() == null ? ResourceCondition.GOOD : request.getCondition());
        existing.setBorrowed(Boolean.TRUE.equals(request.getBorrowed()));
        existing.setRating(request.getRating() == null ? 0.0 : request.getRating());
        existing.setLastServiceDate(request.getLastServiceDate());
        existing.setNextServiceDate(request.getNextServiceDate());
        existing.setTotalBookings(request.getTotalBookings() == null ? 0 : request.getTotalBookings());
        existing.setBookingsToday(request.getBookingsToday() == null ? 0 : request.getBookingsToday());
        existing.setAmenities(safeStringList(request.getAmenities()));
        existing.setMonthlyBookings(normalizeMonthlyBookings(request.getMonthlyBookings()));
        existing.setIssues(safeIssueList(request.getIssues()));
        existing.setImageUrl(request.getImageUrl());
        existing.setRequiresApproval(Boolean.TRUE.equals(request.getRequiresApproval()));
        existing.setIsActive(request.getIsActive() == null || request.getIsActive());

        return mapToResponse(resourceRepository.save(existing));
    }

    @Override
    public ResourceResponse updateStatus(Long id, ResourceStatusUpdateRequest request) {
        Resource resource = getResourceEntity(id);
        resource.setStatus(request.getStatus());
        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponse reportIssue(Long id, ResourceIssueReportRequest request) {
        Resource resource = getResourceEntity(id);
        List<AssetIssue> issues = safeIssueList(resource.getIssues());

        issues.add(AssetIssue.builder()
                .id("ISS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .text(request.getText().trim())
                .severity(request.getSeverity())
                .date(LocalDate.now())
                .status(IssueStatus.OPEN)
                .build());

        resource.setIssues(issues);
        resource.setCondition(ResourceCondition.REPAIR_NEEDED);

        if (resource.getStatus() == ResourceStatus.ACTIVE && Boolean.FALSE.equals(resource.getBorrowed())) {
            resource.setStatus(ResourceStatus.UNDER_MAINTENANCE);
        }

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = getResourceEntity(id);
        resourceRepository.delete(resource);
    }

    private Resource getResourceEntity(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    private void validateBusinessRules(
            LocalTime from,
            LocalTime to,
            ResourceType type,
            String building,
            String roomNumber,
            LocalDate lastServiceDate,
            LocalDate nextServiceDate,
            ResourceStatus status,
            Boolean borrowed,
            ResourceCondition condition,
            List<Integer> monthlyBookings
    ) {
        if (from != null && to != null && !from.isBefore(to)) {
            throw new BadRequestException("Available from time must be earlier than available to time");
        }

        if (type == ResourceType.ROOM
                || type == ResourceType.LAB
                || type == ResourceType.LECTURE_HALL
                || type == ResourceType.MEETING_ROOM) {
            if (building == null || building.isBlank()) {
                throw new BadRequestException("Building is required for room-based resources");
            }
            if (roomNumber == null || roomNumber.isBlank()) {
                throw new BadRequestException("Room number is required for room-based resources");
            }
        }

        if (lastServiceDate != null && nextServiceDate != null && nextServiceDate.isBefore(lastServiceDate)) {
            throw new BadRequestException("Next service date must be on or after the last service date");
        }

        if (Boolean.TRUE.equals(borrowed) && status != ResourceStatus.ACTIVE) {
            throw new BadRequestException("Only active resources can be marked as borrowed");
        }

        if (condition == ResourceCondition.REPAIR_NEEDED && status == ResourceStatus.INACTIVE) {
            throw new BadRequestException("Inactive resources cannot be marked as needing repair");
        }

        if (monthlyBookings != null && monthlyBookings.size() != 12) {
            throw new BadRequestException("Monthly bookings must contain exactly 12 values");
        }
    }

    private List<Integer> normalizeMonthlyBookings(List<Integer> monthlyBookings) {
        if (monthlyBookings == null || monthlyBookings.isEmpty()) {
            return new ArrayList<>(Collections.nCopies(12, 0));
        }
        return new ArrayList<>(monthlyBookings);
    }

    private List<String> safeStringList(List<String> values) {
        return values == null ? new ArrayList<>() : new ArrayList<>(values);
    }

    private List<AssetIssue> safeIssueList(List<AssetIssue> issues) {
        return issues == null ? new ArrayList<>() : new ArrayList<>(issues);
    }

    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .resourceCode(resource.getResourceCode())
                .name(resource.getName())
                .description(resource.getDescription())
                .resourceType(resource.getResourceType())
                .category(resource.getCategory())
                .capacity(resource.getCapacity())
                .building(resource.getBuilding())
                .floorNumber(resource.getFloorNumber())
                .roomNumber(resource.getRoomNumber())
                .locationText(resource.getLocationText())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .condition(resource.getCondition())
                .borrowed(resource.getBorrowed())
                .rating(resource.getRating())
                .lastServiceDate(resource.getLastServiceDate())
                .nextServiceDate(resource.getNextServiceDate())
                .totalBookings(resource.getTotalBookings())
                .bookingsToday(resource.getBookingsToday())
                .amenities(safeStringList(resource.getAmenities()))
                .monthlyBookings(normalizeMonthlyBookings(resource.getMonthlyBookings()))
                .issues(safeIssueList(resource.getIssues()))
                .imageUrl(resource.getImageUrl())
                .requiresApproval(resource.getRequiresApproval())
                .isActive(resource.getIsActive())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
