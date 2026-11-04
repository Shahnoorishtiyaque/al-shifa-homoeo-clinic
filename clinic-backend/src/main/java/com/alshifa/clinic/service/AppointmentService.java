package com.alshifa.clinic.service;

import com.alshifa.clinic.enums.AppointmentStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.alshifa.clinic.dto.AppointmentRequest;
import com.alshifa.clinic.entity.Appointment;
import com.alshifa.clinic.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment createAppointment(AppointmentRequest request) {

        Appointment appointment = new Appointment();

        appointment.setPatientName(request.getPatientName());
        appointment.setPhone(request.getPhone());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setStatus("PENDING");

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findByDeletedFalseOrderByCreatedAtDescIdDesc();
    }
    public Appointment updateAppointmentStatus(
            Long id,
            AppointmentStatus newStatus) {

        Appointment appointment = appointmentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Appointment not found with ID: " + id
                ));

        appointment.setStatus(newStatus.name());

        return appointmentRepository.save(appointment);
    }
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatusAndDeletedFalseOrderByCreatedAtDescIdDesc(status);
    }

    public void softDeleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Appointment not found with ID: " + id
                ));

        appointment.setDeleted(true);
        appointmentRepository.save(appointment);
    }
}
