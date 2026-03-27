package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.UpdateRoleRequest;
import com.example.campus_hub_backend.dto.UpdateUserRequest;
import com.example.campus_hub_backend.dto.UserResponse;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.Role;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        userRepository.findByEmail(normalizedEmail).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(id)) {
                throw new BadRequestException("Email is already used by another user");
            }
        });

        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    public UserResponse updateRole(Long id, UpdateRoleRequest request, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String inputRole = request.getRole().trim().toUpperCase();
        Role newRole;

        try {
            newRole = Role.valueOf(inputRole);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role. Allowed roles: USER, ADMIN");
        }

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail) && newRole == Role.USER) {
            throw new BadRequestException("Admin cannot downgrade their own role to USER");
        }

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    public void deleteUser(Long id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new BadRequestException("Admin cannot delete their own account");
        }

        userRepository.delete(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}