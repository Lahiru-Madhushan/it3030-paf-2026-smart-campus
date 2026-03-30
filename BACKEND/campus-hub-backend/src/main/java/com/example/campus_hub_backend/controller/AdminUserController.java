package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.dto.ApiResponse;
import com.example.campus_hub_backend.dto.UpdateRoleRequest;
import com.example.campus_hub_backend.dto.UpdateUserRequest;
import com.example.campus_hub_backend.dto.UserResponse;
import com.example.campus_hub_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
                                                   @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateRole(@PathVariable Long id,
                                                   @RequestBody String requestBody,
                                                   Authentication authentication) {
        String role = extractRole(requestBody);
        UpdateRoleRequest request = new UpdateRoleRequest();
        request.setRole(role);
        return ResponseEntity.ok(userService.updateRole(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id, Authentication authentication) {
        userService.deleteUser(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
    }

    private String extractRole(String requestBody) {
        if (requestBody == null || requestBody.isBlank()) {
            return "";
        }

        String trimmed = requestBody.trim();
        if (trimmed.startsWith("{")) {
            int keyIndex = trimmed.indexOf("\"role\"");
            if (keyIndex >= 0) {
                int colonIndex = trimmed.indexOf(':', keyIndex);
                if (colonIndex >= 0) {
                    String valuePart = trimmed.substring(colonIndex + 1).trim();
                    if (valuePart.endsWith("}")) {
                        valuePart = valuePart.substring(0, valuePart.length() - 1).trim();
                    }
                    return valuePart.replace("\"", "").trim();
                }
            }
            return "";
        }

        return trimmed.replace("\"", "");
    }
}