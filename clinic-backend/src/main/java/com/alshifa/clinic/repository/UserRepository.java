package com.alshifa.clinic.repository;

import com.alshifa.clinic.entity.User;
import com.alshifa.clinic.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmail(String email);
    boolean existsByRoleAndEnabledTrueAndDeletedFalse(UserRole role);
    List<User> findAllByOrderByIdAsc();
    List<User> findAllByDeletedFalseOrderByIdAsc();
    java.util.Optional<User> findByIdAndDeletedFalse(Long id);
    long countByRoleAndEnabledTrueAndDeletedFalse(UserRole role);
}
