package com.example.campus_hub_backend.dto;

import com.example.campus_hub_backend.enumtype.ResourceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ResourceStatus status;
}
