package com.alshifa.clinic.controller;

import com.alshifa.clinic.entity.User;
import com.alshifa.clinic.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {

        User user = userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow();

        return Map.of(
                "id", user.getId(),
                "name", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }
}