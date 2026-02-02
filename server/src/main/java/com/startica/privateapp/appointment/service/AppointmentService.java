package com.startica.privateapp.appointment.service;

import com.startica.privateapp.appointment.model.Appointment;
import com.startica.privateapp.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;

    public Page<Appointment> getAll(int page, int size) {
        return repository.findAll(
                PageRequest.of(page, size, Sort.by("appointmentDate").descending())
        );
    }

    public Appointment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public Appointment create(Appointment appointment) {
        return repository.save(appointment);
    }

    public Appointment update(Long id, Appointment updated) {
        Appointment existing = getById(id);

        existing.setCandidateName(updated.getCandidateName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAppointmentDate(updated.getAppointmentDate());
        existing.setAppointmentTime(updated.getAppointmentTime());
        existing.setCompany(updated.getCompany());
        existing.setProfile(updated.getProfile());
        existing.setReference(updated.getReference());
        existing.setNotes(updated.getNotes());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
