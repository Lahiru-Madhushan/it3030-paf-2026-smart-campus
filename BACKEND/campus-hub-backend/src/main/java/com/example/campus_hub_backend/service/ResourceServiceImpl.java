package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.ResourceCreateRequest;
import com.example.campus_hub_backend.dto.ResourceResponse;
import com.example.campus_hub_backend.dto.ResourceStatusUpdateRequest;
import com.example.campus_hub_backend.dto.ResourceUpdateRequest;
import com.example.campus_hub_backend.entity.Resource;
import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.enumtype.ResourceType;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.DuplicateResourceCodeException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.ResourceRepository;
import com.example.campus_hub_backend.specification.ResourceSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

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
        validateBusinessRules(request.getAvailableFrom(), request.getAvailableTo(), request.getResourceType(),
                request.getBuilding(), request.getRoomNumber());

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
                .imageUrl(request.getImageUrl())
                .requiresApproval(Boolean.TRUE.equals(request.getRequiresApproval()))
                .isActive(request.getIsActive() == null || request.getIsActive())
                .build();

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponse updateResource(Long id, ResourceUpdateRequest request) {
        validateBusinessRules(request.getAvailableFrom(), request.getAvailableTo(), request.getResourceType(),
                request.getBuilding(), request.getRoomNumber());

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
    public void deleteResource(Long id) {
        Resource resource = getResourceEntity(id);
        resourceRepository.delete(resource);
    }

    private Resource getResourceEntity(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    private void validateBusinessRules(LocalTime from, LocalTime to, ResourceType type, String building, String roomNumber) {
        if (from != null && to != null && !from.isBefore(to)) {
            throw new BadRequestException("Available from time must be earlier than available to time");
        }

        if (type == ResourceType.ROOM || type == ResourceType.LAB) {
            if (building == null || building.isBlank()) {
                throw new BadRequestException("Building is required for ROOM and LAB resources");
            }
            if (roomNumber == null || roomNumber.isBlank()) {
                throw new BadRequestException("Room number is required for ROOM and LAB resources");
            }
        }
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
                .imageUrl(resource.getImageUrl())
                .requiresApproval(resource.getRequiresApproval())
                .isActive(resource.getIsActive())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
