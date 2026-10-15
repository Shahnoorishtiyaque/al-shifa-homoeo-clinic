package com.alshifa.clinic.repository;

import com.alshifa.clinic.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByStatus(String status);
}