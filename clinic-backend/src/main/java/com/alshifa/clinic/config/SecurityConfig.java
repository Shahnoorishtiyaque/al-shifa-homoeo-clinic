package com.alshifa.clinic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // Enable CORS
                .cors(Customizer.withDefaults())

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Patients can book appointments without logging in
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/appointments"
                        ).permitAll()

                        // Only ADMIN, DOCTOR, STAFF can view appointments
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments",
                                "/api/appointments/status/**"
                        ).hasAnyRole("ADMIN", "DOCTOR", "STAFF")

                        // ADMIN and DOCTOR can update appointment status
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/appointments/**"
                        ).hasAnyRole("ADMIN", "DOCTOR")

                        // ADMIN and DOCTOR can soft-delete appointments
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/appointments/**"
                        ).hasAnyRole("ADMIN", "DOCTOR")

                        // ADMIN and DOCTOR can create users
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/users"
                        ).hasAnyRole("ADMIN", "DOCTOR")

                        // ADMIN and DOCTOR can enable/disable users
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/users/*/status"
                        ).hasAnyRole("ADMIN", "DOCTOR")

                        // ADMIN and DOCTOR can soft-delete user accounts
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/users/*"
                        ).hasAnyRole("ADMIN", "DOCTOR")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
