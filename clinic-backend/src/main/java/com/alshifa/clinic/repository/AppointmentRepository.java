package com.alshifa.clinic.repository;

import com.alshifa.clinic.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDeletedFalseOrderByCreatedAtDescIdDesc();

    List<Appointment> findByStatusAndDeletedFalseOrderByCreatedAtDescIdDesc(String status);

    Optional<Appointment> findByIdAndDeletedFalse(Long id);
}
