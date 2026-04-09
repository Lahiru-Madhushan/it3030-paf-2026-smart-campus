package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.ResourceCreateRequest;
import com.example.campus_hub_backend.dto.ResourceIssueReportRequest;
import com.example.campus_hub_backend.dto.ResourceResponse;
import com.example.campus_hub_backend.dto.ResourceStatusUpdateRequest;
import com.example.campus_hub_backend.dto.ResourceUpdateRequest;
import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.enumtype.ResourceType;
import org.springframework.data.domain.Page;

public interface ResourceService {

    Page<ResourceResponse> getAllResources(
            ResourceType type,
            ResourceStatus status,
            String building,
            Integer minCapacity,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    ResourceResponse getResourceById(Long id);

    ResourceResponse createResource(ResourceCreateRequest request);

    ResourceResponse updateResource(Long id, ResourceUpdateRequest request);

    ResourceResponse updateStatus(Long id, ResourceStatusUpdateRequest request);

    ResourceResponse reportIssue(Long id, ResourceIssueReportRequest request);

    void deleteResource(Long id);
}
