package com.alshifa.clinic.config;

import com.alshifa.clinic.entity.User;
import com.alshifa.clinic.enums.UserRole;
import com.alshifa.clinic.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapConfiguration.class);

    @Bean
    ApplicationRunner bootstrapInitialAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${clinic.admin.name:}") String adminName,
            @Value("${clinic.admin.email:}") String adminEmail,
            @Value("${clinic.admin.password:}") String adminPassword) {

        return args -> {
            if (userRepository.existsByRoleAndEnabledTrueAndDeletedFalse(UserRole.ADMIN)) {
                logger.info("An admin account already exists; initial admin bootstrap skipped.");
                return;
            }

            if (adminName.isBlank() || adminEmail.isBlank() || adminPassword.isBlank()) {
                logger.warn("No admin account exists. Set CLINIC_ADMIN_NAME, CLINIC_ADMIN_EMAIL, and CLINIC_ADMIN_PASSWORD to create the initial admin.");
                return;
            }

            String normalizedName = adminName.trim();
            String normalizedEmail = adminEmail.trim().toLowerCase();
            if (normalizedName.length() > 100 || normalizedEmail.length() > 100) {
                throw new IllegalStateException("Initial admin name and email must be 100 characters or fewer.");
            }
            if (!normalizedEmail.contains("@")) {
                throw new IllegalStateException("CLINIC_ADMIN_EMAIL must be a valid email address.");
            }
            if (adminPassword.length() < 8 || adminPassword.length() > 72) {
                throw new IllegalStateException("CLINIC_ADMIN_PASSWORD must contain 8 to 72 characters.");
            }
            if (userRepository.existsByEmail(normalizedEmail)) {
                throw new IllegalStateException("CLINIC_ADMIN_EMAIL is already assigned to a non-admin account.");
            }

            User admin = new User();
            admin.setFullName(normalizedName);
            admin.setEmail(normalizedEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole(UserRole.ADMIN);
            admin.setEnabled(true);

            userRepository.save(admin);
            logger.info("Created the initial admin account for {}.", normalizedEmail);
        };
    }
}
