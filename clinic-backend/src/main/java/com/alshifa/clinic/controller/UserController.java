package com.alshifa.clinic.controller;

import com.alshifa.clinic.dto.CreateUserRequest;
import com.alshifa.clinic.entity.User;
import com.alshifa.clinic.enums.UserRole;
import com.alshifa.clinic.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createUser(
            @Valid @RequestBody CreateUserRequest request,
            Authentication authentication) {

        UserRole creatorRole = authentication.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> UserRole.valueOf(
                        authority.substring("ROLE_".length())))
                .findFirst()
                .orElseThrow();

        User createdUser = userService.createUser(request, creatorRole);

        // Never return the password or password hash.
        return Map.of(
                "id", createdUser.getId(),
                "name", createdUser.getFullName(),
                "email", createdUser.getEmail(),
                "role", createdUser.getRole().name(),
                "enabled", createdUser.isEnabled()
        );
    }

    @GetMapping
    public java.util.List<Map<String, Object>> getAllUsers(
            Authentication authentication) {

        UserRole currentRole = authentication.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> UserRole.valueOf(
                        authority.substring("ROLE_".length())))
                .findFirst()
                .orElseThrow();

        if (currentRole != UserRole.ADMIN
                && currentRole != UserRole.DOCTOR) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "You are not allowed to view user accounts"
            );
        }

        return userService.getAllUsers().stream()
                .map(user -> Map.<String, Object>of(
                        "id", user.getId(),
                        "name", user.getFullName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "enabled", user.isEnabled()
                ))
                .toList();
    }
    @PatchMapping("/{id}/status")
    public Map<String, Object> updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled,
            Authentication authentication) {

        UserRole currentRole = authentication.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> UserRole.valueOf(
                        authority.substring("ROLE_".length())))
                .findFirst()
                .orElseThrow();

        User updatedUser = userService.updateUserStatus(
                id, enabled, currentRole);

        return Map.of(
                "id", updatedUser.getId(),
                "name", updatedUser.getFullName(),
                "email", updatedUser.getEmail(),
                "role", updatedUser.getRole().name(),
                "enabled", updatedUser.isEnabled()
        );
    }
}