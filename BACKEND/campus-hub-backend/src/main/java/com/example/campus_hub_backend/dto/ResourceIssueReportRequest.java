package com.example.campus_hub_backend.dto;

import com.example.campus_hub_backend.enumtype.IssueSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceIssueReportRequest {

    @NotBlank(message = "Issue details are required")
    private String text;

    @NotNull(message = "Issue severity is required")
    private IssueSeverity severity;
}
