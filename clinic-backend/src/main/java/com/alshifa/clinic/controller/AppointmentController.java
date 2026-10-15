package com.alshifa.clinic.controller;

import com.alshifa.clinic.dto.AppointmentStatusRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PatchMapping;
import com.alshifa.clinic.dto.AppointmentRequest;
import com.alshifa.clinic.entity.Appointment;
import com.alshifa.clinic.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Appointment createAppointment(
            @Valid @RequestBody AppointmentRequest request) {

        return appointmentService.createAppointment(request);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
    @PatchMapping("/{id}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusRequest request) {

        return appointmentService.updateAppointmentStatus(
                id,
                request.getStatus()
        );
    }
    @GetMapping("/status/{status}")
    public List<Appointment> getAppointmentsByStatus(
            @PathVariable String status) {

        return appointmentService.getAppointmentsByStatus(status.toUpperCase());
    }
}