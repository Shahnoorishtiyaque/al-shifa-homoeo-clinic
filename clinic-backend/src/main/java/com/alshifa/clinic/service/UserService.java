package com.alshifa.clinic.service;

import com.alshifa.clinic.dto.CreateUserRequest;
import com.alshifa.clinic.entity.User;
import com.alshifa.clinic.enums.UserRole;
import com.alshifa.clinic.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(CreateUserRequest request, UserRole creatorRole) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists"
            );
        }

        UserRole requestedRole = request.getRole();

        if (creatorRole == UserRole.ADMIN) {
            // Admins may create ADMIN, DOCTOR, and STAFF accounts.
        } else if (creatorRole == UserRole.DOCTOR) {
            if (requestedRole != UserRole.STAFF && requestedRole != UserRole.DOCTOR) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "DOCTOR can create DOCTOR or STAFF accounts only"
                );
            }
        } else {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to create user accounts"
            );
        }

        User user = new User();
        user.setFullName(request.getName().trim());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(requestedRole);
        user.setEnabled(true);

        return userRepository.save(user);
    }
    public java.util.List<User> getAllUsers() {
        return userRepository.findAllByDeletedFalseOrderByIdAsc();
    }

    public List<User> getUsersVisibleTo(UserRole currentRole) {
        if (currentRole == UserRole.ADMIN) {
            return getAllUsers();
        }
        if (currentRole == UserRole.DOCTOR) {
            return getAllUsers().stream()
                    .filter(user -> user.getRole() == UserRole.DOCTOR
                            || user.getRole() == UserRole.STAFF)
                    .toList();
        }
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not allowed to view user accounts"
        );
    }

    public User softDeleteUser(Long userId, UserRole currentRole, String actorEmail) {
        if (currentRole != UserRole.ADMIN && currentRole != UserRole.DOCTOR) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to delete user accounts"
            );
        }

        User user = userRepository.findByIdAndDeletedFalse(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        if (user.getEmail().equalsIgnoreCase(actorEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot delete your own account"
            );
        }
        if (currentRole == UserRole.DOCTOR && user.getRole() == UserRole.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Doctors cannot delete admin accounts"
            );
        }
        if (user.getRole() == UserRole.ADMIN && user.isEnabled()
                && userRepository.countByRoleAndEnabledTrueAndDeletedFalse(UserRole.ADMIN) <= 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "At least one enabled admin account must remain"
            );
        }

        user.setEnabled(false);
        user.setDeleted(true);
        return userRepository.save(user);
    }
    public User updateUserStatus(
            Long userId,
            boolean enabled,
            UserRole currentRole) {

        User user = userRepository.findByIdAndDeletedFalse(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        if (user.getRole() == UserRole.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin accounts cannot be disabled through this endpoint"
            );
        }

        if (currentRole == UserRole.DOCTOR
                && user.getRole() != UserRole.STAFF) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Doctors can manage staff accounts only"
            );
        }

        if (currentRole != UserRole.ADMIN
                && currentRole != UserRole.DOCTOR) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to manage user accounts"
            );
        }

        user.setEnabled(enabled);
        return userRepository.save(user);
    }
}
