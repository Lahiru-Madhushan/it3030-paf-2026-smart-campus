package com.example.campus_hub_backend.model;

import com.example.campus_hub_backend.enumtype.IssueSeverity;
import com.example.campus_hub_backend.enumtype.IssueStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetIssue {
    private String id;
    private String text;
    private IssueSeverity severity;
    private LocalDate date;
    private IssueStatus status;
}
